// UI functions

function mouseDown(event) {
  console.log('Mouse:' + event.which + ' Xpos:' + event.pageX + ' Ypos:' + event.pageY);
  g_pointer.pos.x = event.pageX;
  g_pointer.pos.y = event.pageY;
  selectPlayer(event.pageX, event.pageY);
  /*
  var bomb = new Bomb({ id: gBombs.length, pos: { x: event.pageX, y: event.pageY }, maxRadius: 150, minRadius: 1, maxLifeTime: 1, damage: 1 })
  gBombs.push(bomb);
  gStats.bombsUsed++;
  */
}

function keyDown(event) {
  console.log('Key Pressed:' + event.which);
  if (gPause_released && event.which == 32) {
    gPause = !gPause;
    gPause_released = false;
  }
}

function keyUp(event) {
  if (event.which == 32) {
    gPause_released = true;
  }
} 

function selectPlayer(x: number, y: number) {
  var closestDistance: number = -1;
  var closestPlayerID: number = -1;
  for (var i = 0; i < gEntities.length; i++) {
    var distance = getDistance({ x: x, y: y }, gEntities[i].pos);
    if (distance < closestDistance || closestDistance == -1) {
      closestDistance = distance;
      closestPlayerID = gEntities[i].id;
    }
  }
  console.log('closestPlayerID: ' + closestPlayerID);
  return gEntities[closestPlayerID];
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
  if (angle < Math.PI/2 && angle > Math.PI/-2) {
    return true;
  }
  // else b behind a
  else {
    return false;
  }
}

function selectOtherPlayer(x: number, y: number, id: number) {
  var closestDistance: number = -1;
  var closestPlayerID: number = -1;
  var player: Player = gEntities[id];
  for (var i = 0; i < gEntities.length; i++) {
    // Make sure we skip the player we are checking from
    if (id != gEntities[i].id && gEntities[i].isAlive) {
      // Check if other player is in front of this player
      if (isInfront(player, gEntities[i])) {
        var distance = getDistance({ x: x, y: y }, gEntities[i].pos);
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