function physics() {
    if (!g_pause) {
        for (var i = 0; i < MAX_BALLS; i++) {
            g_entities[i].rotDegrees = physicsPlayer(g_entities[i]);
        }
    }
    setTimeout(physics, PHYSICS_TICK);
    render();
}

function physicsPlayer(player) {
    // v^2 = u^2 + 2as
    // s = u*t + 0.5 * a * t^2
    // v = u + a*t
    var t = PHYSICS_TICK / 1000;

    var ux = player.xVel;
    var uy = player.yVel;
    var vx = ux + (player.xAcc * t);
    var vy = uy + (player.yAcc * t);
    var startx = player.xPos;
    var starty = player.yPos;
    var endx = startx + ((ux * t) + (0.5 * t * t * player.xAcc));
    var endy = starty + ((uy * t) + (0.5 * t * t * player.yAcc));

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

    var rotRadians = Math.atan2(player.yVel, player.xVel);
    var twoPi = 6.283185307179586476925286766559;
    var rotDegrees = ((rotRadians / twoPi) * 360) + 90;
    return rotDegrees;
}

function collide(t, u, v, start, end, limit, acc, direction, elasticity) {
    var touched = false;
    if ((end > limit && direction == 1) || (end < limit && direction == -1)) {
        touched = true;
        var s = (limit - start) * direction;
        v = Math.sqrt(u * u + (2 * acc * s)) * direction;
        var collisionTime = acc > 0 ? (v - u) / acc : s / u;
        var remainingtime = t - collisionTime;
        v *= -1 * elasticity;
        if ((v < -0.1 && direction == 1) || (v > 0.1 && direction == -1)) {
            u = v;
            start = limit;
            end = start + ((u * remainingtime) + (0.5 * remainingtime * remainingtime * acc));
            v = u + (acc * remainingtime);
            //end = 500;
        } else {
            end = limit;
            v = 0;
        }
    }
    return { 'end': end, 'v': v, 'touched': touched };
}
//# sourceMappingURL=physics.js.map
