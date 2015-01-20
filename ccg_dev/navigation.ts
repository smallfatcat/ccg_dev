function navigatePlayer(player: Player) {
  var destinationDistance = getDistance(player.pos, player.destination);
  if (destinationDistance < 1) {
    player.stop();
    player.isMoving = false;
    gStats.playersMoving--;
  }
  else {
    // Reorient algorithm
    player.speed = PHYSICS_MAXRUN;
    player.vel = reorient(player.vel, getVectorAB(player.pos, player.destination), player.id);

    // Avoidance algorithm
    var closestPlayerID: number = selectOtherPlayer(player.pos.x, player.pos.y, player.id);
    if (closestPlayerID != -1) {
      var closestPlayer: Player = gEntities[closestPlayerID];
      var closesetDistance: number = getDistance(player.pos, closestPlayer.pos);
      var detectRadius: number = player.collisionRadius + closestPlayer.collisionRadius + DETECT_RADIUS;
      if (closesetDistance < detectRadius) {
        var brakingForce = calcBrakingForce(closesetDistance - player.collisionRadius - closestPlayer.collisionRadius);
        player.speed = PHYSICS_MAXRUN * (1 - brakingForce);
        //console.log(player.id + ' Avoiding: ' + closestPlayer.id);
        player.vel = avoid(player.vel, getVectorAB(player.pos, closestPlayer.pos));
      }
    }
    // Calculate slowdown for nearing destination
    var destBrakingForce = calcBrakingForce(destinationDistance);
    player.speed = Math.min(PHYSICS_MAXRUN * (1 - destBrakingForce), player.speed);

    // Set speed due to braking etc
    var adjustedVel: Vector2D = player.vel.normalize();
    adjustedVel.x *= player.speed;
    adjustedVel.y *= player.speed;
    player.vel = adjustedVel;
  }
}

function reorient(v: Vector2D, t: Vector2D, id: number) {
  // calculate angle between velocity and target
  var angle: number = v.getAngleBetween(t);

  //if angle is above 180 reverse it
  if (angle > Math.PI) {
    angle = angle - (Math.PI * 2);
  }
  if (angle < -Math.PI) {
    angle = angle + (Math.PI * 2);
  }


  var angleDeg: number = (angle / (Math.PI * 2)) * 360;
  angleDeg = angleDeg < 0 ? (angleDeg * -1) : angleDeg;

  var newV: Vector2D = new Vector2D({ x: v.x, y: v.y });
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

function avoid(v: Vector2D, h: Vector2D) {
  // calculate angle between velocity and hazard
  var angle: number = v.getAngleBetween(h);

  var newV: Vector2D = new Vector2D({ x: v.x, y: v.y });
  // if angle is positive turn left
  var angleDeg: number = (angle / (Math.PI * 2)) * 360;
  angleDeg = angleDeg < 0 ? (angleDeg * -1) : angleDeg;
  if (angle > 0.00872664626) {
    newV = turn(v, 'left', angleDeg);
    //console.log('  left, angle: ' + angle + ' v: ' + v.x + ',' + v.y + ' h: ' + h.x + ',' + h.y);
  }
  // else turn right
  if (angle <= 0.00872664626) {
    newV = turn(v, 'right', angleDeg);
    //console.log('  right, angle: ' + angle + ' v: ' + v.x + ',' + v.y + ' h: ' + h.x + ',' + h.y);
  }

  // return new velocity
  return newV;
} 

function turn(v: Vector2D, d: string, angleDeg: number) {
  var angleRad: number = (angleDeg / 360) * (Math.PI * 2);
  var newV: Vector2D = new Vector2D({ x: 0, y: 0 });
  var y: number;
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

function calcBrakingForce(d: number) {
  var A: number = 1.491824698;
  var B: number = 0.670320046;
  var normalFactor: number = 2.426595825;
  var brakingForce = A * Math.exp(d / -10) - B;
  brakingForce *= normalFactor;
  brakingForce = Math.min(brakingForce, 0.8);
  return brakingForce;
}

function isInfront(a: Player, b: Player) {
  var angle: number = calculateAngle(a.vel, getVectorAB(a.pos, b.pos));
  //if angle is above 180 reverse it
  if (angle > Math.PI) {
    angle = angle - (Math.PI * 2);
  }
  if (angle < -Math.PI) {
    angle = angle + (Math.PI * 2);
  }

  // if angle is less than 90 b is in front of a
  if (angle < Math.PI / 2 && angle > Math.PI / -2) {
    return true;
  }
  // else b behind a
  else {
    return false;
  }
}

function selectOtherPlayer(x: number, y: number, id: number) {
  var checkPos: Vector2D = new Vector2D({ x: x, y: y });
  var closestDistance: number = -1;
  var closestPlayerID: number = -1;
  var player: Player = gEntities[id];
  for (var i = 0; i < gEntities.length; i++) {
    // Make sure we skip the player we are checking from
    if (id != gEntities[i].id && gEntities[i].isAlive) {
      // Check if other player is in front of this player
      if (isInfront(player, gEntities[i])) {
        var distance = getDistance(checkPos, gEntities[i].pos);
        if (distance < closestDistance || closestDistance == -1) {
          closestDistance = distance;
          closestPlayerID = gEntities[i].id;
        }
      }
    }
  }
  //console.log('closestPlayerID: ' + closestPlayerID);
  return closestPlayerID;

}