function physics() {
  if (!g_pause) {
    for (var i = 0; i < MAX_BALLS; i++) {
      g_entities[i].rotDegrees = physicsPlayer(g_entities[i]);
    }
  }
  setTimeout(physics, PHYSICS_TICK);
  render();
}

function physicsPlayer(player: Player) {
  // v^2 = u^2 + 2as
  // s = u*t + 0.5 * a * t^2
  // v = u + a*t
  var t: number = PHYSICS_TICK / 1000;

  var ux: number = player.xVel;
  var uy: number = player.yVel;
  var vx: number = ux + (player.xAcc * t);
  var vy: number = uy + (player.yAcc * t);
  var startx: number = player.xPos;
  var starty: number = player.yPos;
  var endx: number = startx + ((ux * t) + (0.5 * t * t * player.xAcc));
  var endy: number = starty + ((uy * t) + (0.5 * t * t * player.yAcc));

  var collided;

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

  player.xPos = endx;
  player.yPos = endy;

  player.xVel = vx;
  player.yVel = vy;

  var rotRadians: number = Math.atan2(player.yVel, player.xVel);
  var twoPi: number = 6.283185307179586476925286766559;
  var rotDegrees: number = ((rotRadians / twoPi) * 360) + 90;
  return rotDegrees;

}

function collide(t: number, u: number, v: number, start: number, end: number, limit: number, acc: number, direction: number, elasticity: number) {
  var touched: boolean = false;
  if ((end > limit && direction == 1) || (end < limit && direction == -1)) {
    touched = true;
    var s: number = (limit - start) * direction;
    v = Math.sqrt(u * u + (2 * acc * s)) * direction;
    var collisionTime: number = acc > 0 ? (v - u) / acc : s / u;
    var remainingtime: number = t - collisionTime;
    v *= -1 * elasticity;
    if ((v < -0.1 && direction == 1) || (v > 0.1 && direction == -1)) {
      u = v;
      start = limit;
      end = start + ((u * remainingtime) + (0.5 * remainingtime * remainingtime * acc));
      v = u + (acc * remainingtime);
      //end = 500;
    }
    else {
      end = limit;
      v = 0;
    }
  }
  return { 'end': end, 'v': v, 'touched': touched };
} 