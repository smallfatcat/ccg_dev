// Physics and game logic
// Main physics loop
function physics() {
    // Check if game is paused
    if (!gPause) {
        // Check for end of game
        if (gStats.playersMoving == 0) {
            if (!gReset) {
                gReset = true;
                setTimeout(reset, 1000);
            }
        }
        calcPlayerPhysics();
        calcBombPhysics();
        if (gApproachTimerFlag) {
            //makeAllThingsApproachEnemies();
            //gApproachTimerFlag = false;
            //setTimeout(setApproachTimerFlag, 1000);
        }
    }

    // Call the physics loop again in PHYSICS_TICK milliseconds
    setTimeout(physics, PHYSICS_TICK);

    // Render Scene
    //render();
    renderPlayArea();

    // Modify Stats
    var d = new Date();
    var currentTime = d.getTime();
    gStats.lastFrameTime = currentTime - gStats.currentTime;
    gStats.currentTime = currentTime;
    gStats.frameCounter++;
    gStats.fps = Math.round(1000 / gStats.lastFrameTime);
}

function reset() {
    gStats.resetCountdown--;
    if (gStats.resetCountdown == 0) {
        init();
        gStats.resetCountdown = 5;
        gReset = false;
    } else {
        setTimeout(reset, 1000);
    }
}

function setApproachTimerFlag() {
    gApproachTimerFlag = true;
    console.log('setApproachTimerFlag hit');
}

function calcBombPhysics() {
    var aliveBombs = [];
    var newID = 0;

    for (var i = 0; i < gBombs.length; i++) {
        if (gBombs[i].isAlive) {
            // t is the time elapsed in this tick
            var t = PHYSICS_TICK / 1000;

            // increment lifetime
            gBombs[i].lifeTime += t;

            // If bombs new lifetime is over maxlife, kill it
            if (gBombs[i].lifeTime > gBombs[i].maxLifeTime) {
                gBombs[i].isAlive = false;
            } else {
                // increase the radius of the bomb
                var radiusIncrease = (gBombs[i].maxRadius - gBombs[i].minRadius) / gBombs[i].maxLifeTime * t;
                gBombs[i].radius += radiusIncrease;

                // check players for damage
                applyBombDamage(gBombs[i]);

                // keep this bomb in the global array, give it a new ID for the new array
                gBombs[i].id = newID;
                newID++;
                aliveBombs.push(gBombs[i]);
            }
        }
    }

    // overwrite bomb array removing dead bombs
    gBombs = aliveBombs;
}

function calcPlayerPhysics() {
    for (var i = 0; i < MAX_PLAYERS; i++) {
        if (gEntities[i].isAlive) {
            // Do physics for all test objects
            physicsPlayer(gEntities[i]);
        }
    }
    /*
    // calculate collisions and store them in global array
    gCollisions = doCollisionChecks();
    
    // Iterate through collisions array
    for (var i: number = 0; i < gCollisions.length; i++) {
    // If entity is in fight mode, check fight priority
    var source: Player = gEntities[gCollisions[i].sourceID];
    var target: Player = gEntities[gCollisions[i].targetID];
    setFighting(source, target);
    }
    
    // Perform Fights
    performFights();
    */
}

function performFights() {
    for (var i = 0; i < gEntities.length; i++) {
        var player = gEntities[i];
        var target = gEntities[player.fight.targetID];
        if (player.isFighting) {
            if (target.isAlive) {
                if (attackRoll(player.attackChance)) {
                    target.health -= player.damage;
                    if (target.health < 1) {
                        target.isAlive = false;
                        target.team == 0 ? gStats.teamKillsA++ : gStats.teamKillsB++;
                        gStats.kills++;
                        gStats.playersAlive--;
                        player.isFighting = false;
                        gEntities[target.fight.targetID].attackers--;
                        target.isFighting = false;
                        player.pointAt(nearestEnemyPos(player.pos, player.team));
                        player.moveForward();
                    }
                }
            } else {
                player.isFighting = false;
                player.pointAt(nearestEnemyPos(player.pos, player.team));
                player.moveForward();
            }
        }
    }
}

function attackRoll(percentage) {
    var roll = Math.random() * 100;
    if (roll < percentage) {
        return true;
    }
    return false;
}

function setFighting(source, target) {
    if (source.team != target.team) {
        if (source.isFighting) {
            if (source.fight.targetHealth > target.health) {
                source.stop();
                source.pointAt(target.pos);
                source.fight.targetID = target.id;
                source.fight.targetHealth = target.health;
                source.fight.targetDirection = getVectorAB(source.pos, target.pos);
            }
        } else {
            source.stop();
            source.pointAt(target.pos);
            source.isFighting = true;
            target.attackers++;
            source.fight.targetID = target.id;
            source.fight.targetHealth = target.health;
            source.fight.targetDirection = getVectorAB(source.pos, target.pos);
        }
        if (target.isFighting) {
            if (target.fight.targetHealth > source.health) {
                target.stop();
                target.pointAt(source.pos);
                target.fight.targetID = source.id;
                target.fight.targetHealth = source.health;
                target.fight.targetDirection = getVectorAB(target.pos, source.pos);
            }
        } else {
            target.stop();
            target.pointAt(source.pos);
            target.isFighting = true;
            source.attackers++;
            target.fight.targetID = source.id;
            target.fight.targetHealth = source.health;
            target.fight.targetDirection = getVectorAB(target.pos, source.pos);
        }
    }
}

function nearestEnemyPos(myPos, myTeam) {
    var enemyPos = { x: 400, y: 400 };
    var distance = 0;
    var minDistance = -1;
    for (var i = 0; i < gEntities.length; i++) {
        var enemy = gEntities[i];
        if (enemy.isAlive && enemy.team != myTeam && enemy.attackers < 2) {
            distance = getDistance(myPos, enemy.pos);
            if (distance < minDistance || minDistance == -1) {
                minDistance = distance;
                enemyPos = enemy.pos;
            }
        }
    }
    return enemyPos;
}

function makeAllThingsApproachEnemies() {
    for (var i = 0; i < gEntities.length; i++) {
        if (!gEntities[i].isFighting) {
            gEntities[i].pointAt(nearestEnemyPos(gEntities[i].pos, gEntities[i].team));
            gEntities[i].moveForward();
        }
    }
}

function reorient(v, t, id) {
    // calculate angle between velocity and target
    var angle = calculateAngle(v, t);

    //if angle is above 180 reverse it
    if (angle > Math.PI) {
        angle = angle - (Math.PI * 2);
    }
    if (angle < -Math.PI) {
        angle = angle + (Math.PI * 2);
    }

    var angleDeg = (angle / (Math.PI * 2)) * 360;
    angleDeg = angleDeg < 0 ? (angleDeg * -1) : angleDeg;

    var newV = { x: v.x, y: v.y };

    // if angle is positive turn right
    if (angle > 0) {
        newV = turn(v, 'right', angleDeg / 2);
        //console.log('Angle: ' + angle + 'Turn: right ID: ' + id);
    }

    // if angle is negative turn left
    if (angle < 0) {
        newV = turn(v, 'left', angleDeg / 2);
        //console.log('Angle: ' + angle + ' Turn: left ID: '+ id);
    }

    // if angle is zero do nothing
    // return new velocity
    return newV;
}

function avoid(v, h) {
    // calculate angle between velocity and hazard
    var angle = calculateAngle(v, h);

    //if angle is above 180 reverse it
    if (angle > Math.PI) {
        angle = angle - (Math.PI * 2);
    }
    if (angle < -Math.PI) {
        angle = angle + (Math.PI * 2);
    }

    var newV = { x: v.x, y: v.y };

    // if angle is positive turn left
    var angleDeg = (angle / (Math.PI * 2)) * 360;
    angleDeg = angleDeg < 0 ? (angleDeg * -1) : angleDeg;
    if (angle > 0.00872664626) {
        newV = turn(v, 'left', angleDeg);
        console.log('  left, angle: ' + angle + ' v: ' + v.x + ',' + v.y + ' h: ' + h.x + ',' + h.y);
    }

    // else turn right
    if (angle <= 0.00872664626) {
        newV = turn(v, 'right', angleDeg);
        console.log('  right, angle: ' + angle + ' v: ' + v.x + ',' + v.y + ' h: ' + h.x + ',' + h.y);
    }

    // return new velocity
    return newV;
}

function calculateAngle(a, b) {
    var angle;
    angle = Math.atan2(b.y, b.x) - Math.atan2(a.y, a.x);

    //console.log('Angle: ' + angle + ' a: ' + Math.atan2(a.y, a.x) + ' b: ' + Math.atan2(b.y, b.x));
    return angle;
}

function dot(a, b) {
    var dotProduct = (a.x * b.x) + (a.y * b.y);
    return dotProduct;
}

function mag(a) {
    var magnitude = Math.sqrt((a.x * a.x) + (a.y * a.y));
    return magnitude;
}

function turn(v, d, angleDeg) {
    var angleRad = (angleDeg / 360) * (Math.PI * 2);
    var newV = { x: 0, y: 0 };
    var y;
    if (d == 'left') {
        newV.x = (v.x * Math.cos(angleRad)) + (v.y * Math.sin(angleRad));
        newV.y = (v.y * Math.cos(angleRad)) - (v.x * Math.sin(angleRad));
    }
    if (d == 'right') {
        newV.x = (v.x * Math.cos(angleRad)) - (v.y * Math.sin(angleRad));
        newV.y = (v.x * Math.sin(angleRad)) + (v.y * Math.cos(angleRad));
    }
    return newV;
}

function calcVelocity(u, acc, t) {
    var v = { x: 0, y: 0 };
    v.x = u.x + (acc.x * t);
    v.y = u.y + (acc.y * t);
    return v;
}

function calcFinalCoords(start, u, acc, t) {
    var end = { x: 0, y: 0 };
    end.x = start.x + ((u.x * t) + (0.5 * t * t * acc.x));
    end.y = start.y + ((u.y * t) + (0.5 * t * t * acc.y));
    return end;
}

// Do physics for player object
function physicsPlayer(player) {
    // Equations
    // v^2 = u^2 + 2as // s = u*t + 0.5 * a * t^2 // v = u + a*t
    // t is the time elapsed in this tick
    var t = PHYSICS_TICK / 1000;

    // u is the initial velocity, v final velocity, start is the initial coords, end is the final coords
    // Set initial velocity
    var u = player.vel;

    // calculate final velocity
    var v = calcVelocity(u, player.acc, t);

    // Set initital coords
    var start = player.pos;

    // Calculate final coords
    var end = calcFinalCoords(start, u, player.acc, t);

    // Store new values
    player.pos = end;
    player.vel = v;

    // if there is no velocity to establish a direction
    if (!(player.vel.x == 0) && !(player.vel.y == 0)) {
        // Calculate new direction angle
        var rotRadians = Math.atan2(player.vel.y, player.vel.x);
        player.rotDegrees = ((rotRadians / (Math.PI * 2)) * 360) + 90;
    }

    // Reset distance info
    player.acc = { x: 0, y: 0 };
    player.distances = [];

    // If player is moving run avoidance code
    if (player.isMoving) {
        var destinationDistance = getDistance(player.pos, player.destination);
        if (destinationDistance < 1) {
            player.stop();
            player.isMoving = false;
            gStats.playersMoving--;
        } else {
            // Reorient algorithm
            player.speed = PHYSICS_MAXRUN;
            player.vel = reorient(player.vel, getVectorAB(player.pos, player.destination), player.id);

            // Avoidance algorithm
            var closestPlayerID = selectOtherPlayer(player.pos.x, player.pos.y, player.id);
            if (closestPlayerID != -1) {
                var closestPlayer = gEntities[closestPlayerID];
                var closesetDistance = getDistance(player.pos, closestPlayer.pos);
                var detectRadius = player.collisionRadius + closestPlayer.collisionRadius + DETECT_RADIUS;
                if (closesetDistance < detectRadius) {
                    var brakingForce = calcBrakingForce(closesetDistance - player.collisionRadius - closestPlayer.collisionRadius);
                    player.speed = PHYSICS_MAXRUN * (1 - brakingForce);
                    console.log(player.id + ' Avoiding: ' + closestPlayer.id);
                    player.vel = avoid(player.vel, getVectorAB(player.pos, closestPlayer.pos));
                }
            }

            // Calculate slowdown for nearing destination
            var destBrakingForce = calcBrakingForce(destinationDistance);
            player.speed = Math.min(PHYSICS_MAXRUN * (1 - destBrakingForce), player.speed);

            // Set speed due to braking etc
            var adjustedVel = normalize(player.vel);
            adjustedVel.x *= player.speed;
            adjustedVel.y *= player.speed;
            player.vel = adjustedVel;
        }
    }
}

function calcBrakingForce(d) {
    var A = 1.491824698;
    var B = 0.670320046;
    var normalFactor = 2.426595825;
    var brakingForce = A * Math.exp(d / -10) - B;
    brakingForce *= normalFactor;
    brakingForce = Math.min(brakingForce, 0.8);
    return brakingForce;
}

function applyGravity(player, distanceObject) {
    player.acc.x += distanceObject.vectorToOther.x * distanceObject.gforce / player.mass;
    player.acc.y += distanceObject.vectorToOther.y * distanceObject.gforce / player.mass;
    if (player.acc.x > PHYSICS_MAXACC) {
        player.acc.x = PHYSICS_MAXACC;
    }
    if (player.acc.x < -1 * PHYSICS_MAXACC) {
        player.acc.x = -1 * PHYSICS_MAXACC;
    }
    if (player.acc.y > PHYSICS_MAXACC) {
        player.acc.y = PHYSICS_MAXACC;
    }
    if (player.acc.y < -1 * PHYSICS_MAXACC) {
        player.acc.y = -1 * PHYSICS_MAXACC;
    }
}

function doCollisionChecks() {
    var collisions = [];
    var players = [];
    players = gEntities.slice(0);

    for (var i = 0; i < MAX_PLAYERS; i++) {
        var source = players.pop();
        if (source.isAlive) {
            for (var j = 0; j < players.length; j++) {
                var target = players[j];
                if (target.isAlive && source.isAlive) {
                    //var distanceObject: DistanceObject = calcGravity(source, target);
                    //applyGravity(source, distanceObject);
                    //var invertedDistanceObject: DistanceObject = storeDistanceObject(source, target, distanceObject);
                    //applyGravity(target, invertedDistanceObject);
                    var isHit = checkRadiusCollision(source, target);
                    if (isHit) {
                        //combine(source, target);
                        var collision = { sourceID: source.id, targetID: target.id };
                        collisions.push(collision);
                    }
                }
            }
        }
    }
    return collisions;
}

function combine(source, target) {
    // Calculate initial momentum
    var momentum = { x: 0, y: 0 };
    momentum.x = (source.vel.x * source.mass) + (target.vel.x * target.mass);
    momentum.y = (source.vel.y * source.mass) + (target.vel.y * target.mass);
    var newMass = source.mass + target.mass;
    if (target.mass <= source.mass) {
        // Kill Target
        target.isAlive = false;
        source.vel.x = momentum.x / newMass;
        source.vel.y = momentum.y / newMass;
    }
    if (target.mass > source.mass) {
        source.isAlive = false;
        target.vel.x = momentum.x / newMass;
        target.vel.y = momentum.y / newMass;
    }
}

function storeDistanceObject(source, target, distanceObject) {
    var invertedDistanceObject = { targetID: source.id, vectorToOther: { x: distanceObject.vectorToOther.x * -1, y: distanceObject.vectorToOther.y * -1 }, gforce: distanceObject.gforce, distance: distanceObject.distance };
    source.distances.push(distanceObject);
    target.distances.push(invertedDistanceObject);
    return invertedDistanceObject;
}

function getVectorAB(A, B) {
    var AB = { x: B.x - A.x, y: B.y - A.y };
    return AB;
}

function calcGravity(source, target) {
    var distanceToOther = getDistance(source.pos, target.pos);
    var vectorToOther = getVectorAB(source.pos, target.pos);
    vectorToOther.x /= distanceToOther;
    vectorToOther.y /= distanceToOther;

    //  Gravity experiment
    var totalCollisionRadius = source.collisionRadius + target.collisionRadius;
    if (distanceToOther < totalCollisionRadius) {
        distanceToOther = totalCollisionRadius;
    }
    var gravityForceX = GRAVITY_CONSTANT * (source.mass * target.mass / (distanceToOther * distanceToOther));
    return { targetID: target.id, distance: distanceToOther, vectorToOther: vectorToOther, gforce: gravityForceX };
}

function calcGravityForce(source, other) {
}

function checkSideCollision(u, v, start, end, acc, t) {
    var collided;
    collided = collide(t, u.x, v.x, start.x, end.x, 800, acc.x, 1, ELASTICITY_NORMAL);
    end.x = collided.end;
    v.x = collided.v;
    if (collided.touched) {
        v.y *= PHYSICS_FRICTION;
    }

    collided = collide(t, u.x, v.x, start.x, end.x, 0, acc.x, -1, ELASTICITY_NORMAL);
    end.x = collided.end;
    v.x = collided.v;
    if (collided.touched) {
        v.y *= PHYSICS_FRICTION;
    }

    collided = collide(t, u.y, v.y, start.y, end.y, 800, acc.y, 1, ELASTICITY_NORMAL);
    end.y = collided.end;
    v.y = collided.v;
    if (collided.touched) {
        v.x *= PHYSICS_FRICTION;
    }

    collided = collide(t, u.y, v.y, start.y, end.y, 0, acc.y, -1, ELASTICITY_NORMAL);
    end.y = collided.end;
    v.y = collided.v;
    if (collided.touched) {
        v.x *= PHYSICS_FRICTION;
    }
    return { v: v, end: end };
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

function getDistance(a, b) {
    var x = b.x - a.x;
    var y = b.y - a.y;
    var distance = Math.sqrt((x * x) + (y * y));
    return distance;
}

function checkRadiusCollision(source, target) {
    var isHit = false;
    var d = getDistance(source.pos, target.pos);
    if (d <= source.collisionRadius + target.collisionRadius) {
        isHit = true;
    }
    return isHit;
}

function checkBombHit(bomb, player) {
    var isHit = false;
    var checkRadius = bomb.radius + 16;
    var distance = getDistance(bomb.pos, player.pos);
    if (distance <= checkRadius) {
        isHit = true;
    }
    return isHit;
}

function applyBombDamage(bomb) {
    for (var i = 0; i < MAX_PLAYERS; i++) {
        if (gEntities[i].isAlive) {
            if (checkBombHit(bomb, gEntities[i])) {
                gEntities[i].isAlive = false;
                gStats.kills++;
            }
        }
    }
}

function normalize(vector) {
    var distance = Math.sqrt((vector.x * vector.x) + (vector.y * vector.y));
    vector.x = vector.x / distance;
    vector.y = vector.y / distance;
    return vector;
}
//# sourceMappingURL=physics.js.map
