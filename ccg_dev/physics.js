// Physics and game logic
// Main physics loop
function physics() {
    // Check if game is paused
    if (!g_pause) {
        calcPlayerPhysics();
        calcBombPhysics();
    }

    // Call the physics loop again in PHYSICS_TICK milliseconds
    setTimeout(physics, PHYSICS_TICK);

    // Render Scene
    //render();
    renderPlayArea();

    // Modify Stats
    var d = new Date();
    var currentTime = d.getTime();
    g_stats.lastFrameTime = currentTime - g_stats.currentTime;
    g_stats.currentTime = currentTime;
    g_stats.frameCounter++;
    g_stats.fps = Math.round(1000 / g_stats.lastFrameTime);
}

function calcBombPhysics() {
    var aliveBombs = [];
    var newID = 0;

    for (var i = 0; i < g_bombs.length; i++) {
        if (g_bombs[i].isAlive) {
            // t is the time elapsed in this tick
            var t = PHYSICS_TICK / 1000;

            // increment lifetime
            g_bombs[i].lifeTime += t;

            // If bombs new lifetime is over maxlife, kill it
            if (g_bombs[i].lifeTime > g_bombs[i].maxLifeTime) {
                g_bombs[i].isAlive = false;
            } else {
                // increase the radius of the bomb
                var radiusIncrease = (g_bombs[i].maxRadius - g_bombs[i].minRadius) / g_bombs[i].maxLifeTime * t;
                g_bombs[i].radius += radiusIncrease;

                // check players for damage
                applyBombDamage(g_bombs[i]);

                // keep this bomb in the global array, give it a new ID for the new array
                g_bombs[i].id = newID;
                newID++;
                aliveBombs.push(g_bombs[i]);
            }
        }
    }

    // overwrite bomb array removing dead bombs
    g_bombs = aliveBombs;
}

function calcPlayerPhysics() {
    for (var i = 0; i < MAX_BALLS; i++) {
        if (g_entities[i].isAlive) {
            // Do physics for all test objects
            physicsPlayer(g_entities[i]);
        }
    }
}

// Do physics for player object
function physicsPlayer(player) {
    // Equations
    // v^2 = u^2 + 2as // s = u*t + 0.5 * a * t^2 // v = u + a*t
    // t is the time elapsed in this tick
    var t = PHYSICS_TICK / 1000;

    // ux/uy are the initial velocities, vx/vy final velocities, startx/starty are the initial coords, endx/endy are the final coords
    // Set initial velocity
    var ux = player.xVel;
    var uy = player.yVel;

    // calculate final velocity
    var vx = ux + (player.xAcc * t);
    var vy = uy + (player.yAcc * t);

    // Set initital coords
    var startx = player.xPos;
    var starty = player.yPos;

    // Calculate final coords
    var endx = startx + ((ux * t) + (0.5 * t * t * player.xAcc));
    var endy = starty + ((uy * t) + (0.5 * t * t * player.yAcc));

    // Set up a collision result object
    var collided;

    // Do collisions on each side of the box - to be changed, testing only
    collided = collide(t, ux, vx, startx, endx, 800, player.xAcc, 1, ELASTICITY_NORMAL);
    endx = collided.end;
    vx = collided.v;
    if (collided.touched) {
        vy *= PHYSICS_FRICTION;
    }

    collided = collide(t, ux, vx, startx, endx, 0, player.xAcc, -1, ELASTICITY_NORMAL);
    endx = collided.end;
    vx = collided.v;
    if (collided.touched) {
        vy *= PHYSICS_FRICTION;
    }

    collided = collide(t, uy, vy, starty, endy, 800, player.yAcc, 1, ELASTICITY_NORMAL);
    endy = collided.end;
    vy = collided.v;
    if (collided.touched) {
        vx *= PHYSICS_FRICTION;
    }

    collided = collide(t, uy, vy, starty, endy, 0, player.yAcc, -1, ELASTICITY_NORMAL);
    endy = collided.end;
    vy = collided.v;
    if (collided.touched) {
        vx *= PHYSICS_FRICTION;
    }

    // Calculate new direction angle
    var rotRadians = Math.atan2(player.yVel, player.xVel);
    var twoPi = 6.283185307179586476925286766559;

    // Store new values
    player.xPos = endx;
    player.yPos = endy;
    player.xVel = vx;
    player.yVel = vy;
    player.rotDegrees = ((rotRadians / twoPi) * 360) + 90;

    // calculate distances
    player.xAcc = 0;
    player.yAcc = 0;
    var newDistances = [];
    for (i = 0; i < MAX_BALLS; i++) {
        if (g_entities[i].isAlive && player.id != g_entities[i].id) {
            var distanceObject = calcGravity(player, g_entities[i]);
            player.xAcc += distanceObject.vectorToOther.x * distanceObject.gforce / player.mass;
            player.yAcc += distanceObject.vectorToOther.y * distanceObject.gforce / player.mass;
            if (player.xAcc > 100 || player.xAcc < -100 || player.yAcc > 100 || player.yAcc < -100) {
                player.xAcc = 100;
                player.yAcc = 100;
            }
            newDistances.push(distanceObject);
        }
    }
    player.distances = newDistances;
}

function calcGravity(source, other) {
    var distanceToOther = getDistance(source.xPos, source.yPos, other.xPos, other.yPos);
    var vectorToOther = { x: ((other.xPos - source.xPos) / distanceToOther), y: ((other.yPos - source.yPos) / distanceToOther) };

    //  Gravity experiment
    if (distanceToOther > -10 && distanceToOther < 10) {
        if (distanceToOther > 0) {
            distanceToOther = 10;
        } else {
            distanceToOther = -10;
        }
    }
    var gravityForceX = GRAVITY_CONSTANT * (source.mass * other.mass / (distanceToOther * distanceToOther));
    return { otherID: other.id, distance: distanceToOther, vectorToOther: vectorToOther, gforce: gravityForceX };
}

// Check collision with the sides of the box
function collide(t, u, v, start, end, limit, acc, direction, elasticity) {
    // Set flag if the collision occured
    var touched = false;

    // if we crossed the boundary
    if ((end > limit && direction == 1) || (end < limit && direction == -1)) {
        // Mark flag that we crossed the boundary
        touched = true;

        // s is the amount we need to travel from start to the boundary
        var s = (limit - start) * direction;

        // v is the velocity when we reached the boundary
        v = Math.sqrt(u * u + (2 * acc * s)) * direction;

        // calculate the time at which we hit the boundary
        var collisionTime = acc > 0 ? (v - u) / acc : s / u;

        // calculate the remaining time in this tick after the collison
        var remainingtime = t - collisionTime;

        // reverse velocity and account for elasticity
        v *= -1 * elasticity;

        // if v is not very small
        if ((v < -0.1 && direction == 1) || (v > 0.1 && direction == -1)) {
            // Set initial u as v from the collision above
            u = v;

            // Set the start at the collision point
            start = limit;

            // calculate new final pos
            end = start + ((u * remainingtime) + (0.5 * remainingtime * remainingtime * acc));

            // calculate final velocity
            v = u + (acc * remainingtime);
        } else {
            // Set final pos on the boundary
            end = limit;

            // Zero out velocity
            v = 0;
        }
    }

    // return the final position, velocity, and if there was a collision with the boundary
    return { 'end': end, 'v': v, 'touched': touched };
}

function getDistance(xa, ya, xb, yb) {
    var x = xb - xa;
    var y = yb - ya;
    var distance = Math.sqrt((x * x) + (y * y));
    return distance;
}

function checkBombHit(bomb, player) {
    var isHit = false;
    var checkRadius = bomb.radius + 16;
    var distance = getDistance(bomb.xPos, bomb.yPos, player.xPos, player.yPos);
    if (distance <= checkRadius) {
        isHit = true;
    }
    return isHit;
}

function applyBombDamage(bomb) {
    for (var i = 0; i < MAX_BALLS; i++) {
        if (g_entities[i].isAlive) {
            if (checkBombHit(bomb, g_entities[i])) {
                g_entities[i].isAlive = false;
                g_stats.kills++;
            }
        }
    }
}
//# sourceMappingURL=physics.js.map
