// Physics and game logic

// Main physics loop
function physics() {
  // Check if game is paused
  if (!g_pause) {
    // Loop through all test objects
    for (var i = 0; i < MAX_BALLS; i++) {
      // Do physics for all test objects 
      physicsPlayer(g_entities[i]);
    }

    var aliveBombs = [];
    var newID: number = 0;
    // loop through bombs
    for (var i = 0; i < g_bombs.length; i++) {
      if (g_bombs[i].isAlive) {
        // t is the time elapsed in this tick
        var t: number = PHYSICS_TICK / 1000;
        // increment lifetime
        g_bombs[i].lifeTime += t;
        // If bombs new lifetime is over maxlife, kill it
        if (g_bombs[i].lifeTime > g_bombs[i].maxLifeTime) {
          g_bombs[i].isAlive = false;
        }
        // bomb is still alive
        else {
          // increase the radius of the bomb
          var radiusIncrease: number = (g_bombs[i].maxRadius - g_bombs[i].minRadius) / g_bombs[i].maxLifeTime * t;
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

  // Call the physics loop again in PHYSICS_TICK milliseconds
  setTimeout(physics, PHYSICS_TICK);

  // Render Scene
  render();
}

// Do physics for player object
function physicsPlayer(player: Player) {
  // Equations
  // v^2 = u^2 + 2as // s = u*t + 0.5 * a * t^2 // v = u + a*t

  // t is the time elapsed in this tick
  var t: number = PHYSICS_TICK / 1000;

  // ux/uy are the initial velocities, vx/vy final velocities, startx/starty are the initial coords, endx/endy are the final coords
  // Set initial velocity
  var ux: number = player.xVel;
  var uy: number = player.yVel;
  // calculate final velocity
  var vx: number = ux + (player.xAcc * t);
  var vy: number = uy + (player.yAcc * t);
  // Set initital coords 
  var startx: number = player.xPos;
  var starty: number = player.yPos;
  // Calculate final coords
  var endx: number = startx + ((ux * t) + (0.5 * t * t * player.xAcc));
  var endy: number = starty + ((uy * t) + (0.5 * t * t * player.yAcc));

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
  var rotRadians: number = Math.atan2(player.yVel, player.xVel);
  var twoPi: number = 6.283185307179586476925286766559;

  // Store new values
  player.xPos = endx;
  player.yPos = endy;
  player.xVel = vx;
  player.yVel = vy;
  player.rotDegrees = ((rotRadians / twoPi) * 360) + 90;
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
  var distance = getDistance(bomb.xPos, bomb.yPos, player.xPos+16, player.yPos+16);
  if (distance <= bomb.radius + 16) {
    isHit = true;
  }
  return isHit;
}

function applyBombDamage(bomb: Bomb) {
  for (var i = 0; i < MAX_BALLS; i++) {
    if ( checkBombHit( bomb, g_entities[i] ) ) {
      g_entities[i].isAlive = false;
    }
  }
}