// Physics and game logic

// Main physics loop
function physics() {
  // Check if game is paused
  if (!gPause) {
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
  gStats.lastFrameTime = currentTime - gStats.currentTime;
  gStats.currentTime = currentTime;
  gStats.frameCounter++;
  gStats.fps = Math.round( 1000 / gStats.lastFrameTime );

}

function calcBombPhysics() {
  var aliveBombs = [];
  var newID: number = 0;
  // loop through bombs
  for (var i = 0; i < gBombs.length; i++) {
    if (gBombs[i].isAlive) {
      // t is the time elapsed in this tick
      var t: number = PHYSICS_TICK / 1000;
      // increment lifetime
      gBombs[i].lifeTime += t;
      // If bombs new lifetime is over maxlife, kill it
      if (gBombs[i].lifeTime > gBombs[i].maxLifeTime) {
        gBombs[i].isAlive = false;
      }
      // bomb is still alive
      else {
        // increase the radius of the bomb
        var radiusIncrease: number = (gBombs[i].maxRadius - gBombs[i].minRadius) / gBombs[i].maxLifeTime * t;
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
  // Loop through all test objects
  for (var i = 0; i < MAX_BALLS; i++) {
    if (gEntities[i].isAlive) {
      // Do physics for all test objects 
      physicsPlayer(gEntities[i]);
    }
  }
}

// Do physics for player object
function physicsPlayer(player: Player) {
  // Equations
  // v^2 = u^2 + 2as // s = u*t + 0.5 * a * t^2 // v = u + a*t

  // t is the time elapsed in this tick
  var t: number = PHYSICS_TICK / 1000;

  // ux/uy are the initial velocities, vx/vy final velocities, startx/starty are the initial coords, endx/endy are the final coords
  // Set initial velocity
  var ux: number = player.vel.x;
  var uy: number = player.vel.y;
  // calculate final velocity
  var vx: number = ux + (player.acc.x * t);
  var vy: number = uy + (player.acc.y * t);
  // Set initital coords 
  var startx: number = player.pos.x;
  var starty: number = player.pos.y;
  // Calculate final coords
  var endx: number = startx + ((ux * t) + (0.5 * t * t * player.acc.x));
  var endy: number = starty + ((uy * t) + (0.5 * t * t * player.acc.y));

  // Set up a collision result object
  var collided;

  // Do collisions on each side of the box - to be changed, testing only
  collided = collide(t, ux, vx, startx, endx, 800, player.acc.x, 1, ELASTICITY_NORMAL);
  endx = collided.end;
  vx = collided.v;
  if (collided.touched) {
    vy *= PHYSICS_FRICTION;
  }

  collided = collide(t, ux, vx, startx, endx, 0, player.acc.x, -1, ELASTICITY_NORMAL);
  endx = collided.end;
  vx = collided.v;
  if (collided.touched) {
    vy *= PHYSICS_FRICTION;
  }

  collided = collide(t, uy, vy, starty, endy, 800, player.acc.y, 1, ELASTICITY_NORMAL);
  endy = collided.end;
  vy = collided.v;
  if (collided.touched) {
    vx *= PHYSICS_FRICTION;
  }

  collided = collide(t, uy, vy, starty, endy, 0, player.acc.y, -1, ELASTICITY_NORMAL);
  endy = collided.end;
  vy = collided.v;
  if (collided.touched) {
    vx *= PHYSICS_FRICTION;
  }

  // Calculate new direction angle
  var rotRadians: number = Math.atan2(player.vel.y, player.vel.x);
  var twoPi: number = 6.283185307179586476925286766559;

  // Store new values
  player.pos.x = endx;
  player.pos.y = endy;
  player.vel.x = vx;
  player.vel.y = vy;
  player.rotDegrees = ((rotRadians / twoPi) * 360) + 90;

  // calculate distances
  player.acc.x = 0;
  player.acc.y = 0;
  var newDistances = [];
  for (i = 0; i < MAX_BALLS; i++) {
    if (gEntities[i].isAlive && player.id != gEntities[i].id) {
      var distanceObject = calcGravity(player, gEntities[i]);
      player.acc.x += distanceObject.vectorToOther.x * distanceObject.gforce / player.mass;
      player.acc.y += distanceObject.vectorToOther.y * distanceObject.gforce / player.mass;
      if (player.acc.x > 100 || player.acc.x < -100 || player.acc.y > 100 || player.acc.y < -100) {
        player.acc.x = 100;
        player.acc.y = 100;
      }
      newDistances.push(distanceObject);
    }
  }
  player.distances = newDistances;
}

function calcGravity(source: Player, other: Player) {
  var distanceToOther: number = getDistance(source.pos.x, source.pos.y, other.pos.x, other.pos.y);
  var vectorToOther = { x: ((other.pos.x - source.pos.x) / distanceToOther), y: ((other.pos.y - source.pos.y) / distanceToOther) };
  //  Gravity experiment
  if (distanceToOther > -10 && distanceToOther < 10) {
    if (distanceToOther > 0) {
      distanceToOther = 10;
    }
    else {
      distanceToOther = -10;
    }
  }
  var gravityForceX: number = GRAVITY_CONSTANT * (source.mass * other.mass / (distanceToOther * distanceToOther));
  return { otherID: other.id, distance: distanceToOther, vectorToOther: vectorToOther, gforce: gravityForceX};
}

// Check collision with the sides of the box
function collide(t: number, u: number, v: number, start: number, end: number, limit: number, acc: number, direction: number, elasticity: number) {
  // Set flag if the collision occured
  var touched: boolean = false;
  // if we crossed the boundary
  if ((end > limit && direction == 1) || (end < limit && direction == -1)) {
    // Mark flag that we crossed the boundary
    touched = true;
    // s is the amount we need to travel from start to the boundary
    var s: number = (limit - start) * direction;
    // v is the velocity when we reached the boundary
    v = Math.sqrt(u * u + (2 * acc * s)) * direction;
    // calculate the time at which we hit the boundary
    var collisionTime: number = acc > 0 ? (v - u) / acc : s / u;
    // calculate the remaining time in this tick after the collison
    var remainingtime: number = t - collisionTime;
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
    }
    // else v is very small
    else {
      // Set final pos on the boundary
      end = limit;
      // Zero out velocity
      v = 0;
    }
  }

  // return the final position, velocity, and if there was a collision with the boundary
  return { 'end': end, 'v': v, 'touched': touched };
} 

function getDistance(xa: number, ya: number, xb: number, yb: number) {
  var x: number = xb - xa;
  var y: number = yb - ya;
  var distance: number = Math.sqrt((x * x) + (y * y));
  return distance;
}

function checkBombHit(bomb: Bomb, player: Player) {
  var isHit: boolean = false;
  var checkRadius: number = bomb.radius+16;
  var distance = getDistance(bomb.pos.x, bomb.pos.y, player.pos.x, player.pos.y);
  if (distance <= checkRadius) {
    isHit = true;
  }
  return isHit;
}

function applyBombDamage(bomb: Bomb) {
  for (var i = 0; i < MAX_BALLS; i++) {
    if (gEntities[i].isAlive) {
      if (checkBombHit(bomb, gEntities[i])) {
        gEntities[i].isAlive = false;
        gStats.kills++;
      }
    }
  }
}