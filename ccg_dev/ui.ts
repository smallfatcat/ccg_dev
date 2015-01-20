// UI functions

function mouseDown(event) {
  console.log('Mouse:' + event.which + ' Xpos:' + event.pageX + ' Ypos:' + event.pageY);
  var PointerPos: Vector2D = new Vector2D({ x: event.pageX, y: <number>event.pageY });
  gPointer.pos = PointerPos;
  if (gPointer.mode == 'select') {
    deselectPlayers();
    var selectedID: number = checkMouseHit(gPointer.pos);
    if (selectedID != -1) {
      var selectedPlayer: Player = gPlayers[selectedID];
      selectedPlayer.isSelected = true;
      gSelectedPlayerIDs.push(selectedPlayer.id);
      gPointer.mode = 'makedest';
      return;
    }
    else {
      gPointer.startDrag.x = event.pageX;
      gPointer.startDrag.y = event.pageY;
      gPointer.endDrag.x = event.pageX;
      gPointer.endDrag.y = event.pageY;
      document.body.addEventListener('mousemove', onMouseMove);
      document.body.addEventListener('mouseup', onMouseUp);
      gPointer.mode = 'drag';
    }
  }

  if (gPointer.mode == 'makedest') {
    gPlayers[gSelectedPlayerIDs[0]].destination = PointerPos;
    gPlayers[gSelectedPlayerIDs[0]].isSelected = false;
    gPlayers[gSelectedPlayerIDs[0]].moveTowards(gPlayers[gSelectedPlayerIDs[0]].destination);
    gPlayers[gSelectedPlayerIDs[0]].isMoving = true;
    gStats.playersMoving++;
    gSelectedPlayerIDs.pop();
    gPointer.mode = 'select';
    return;
  }
  /*
  var bomb = new Bomb({ id: gBombs.length, pos: { x: event.pageX, y: event.pageY }, maxRadius: 150, minRadius: 1, maxLifeTime: 1, damage: 1 })
  gBombs.push(bomb);
  gStats.bombsUsed++;
  */
}

function onMouseMove(event) {
  gPointer.endDrag.x = event.pageX;
  gPointer.endDrag.y = event.pageY;
}

function onMouseUp(event) {
  selectPlayersInBox();
  gPointer.mode = 'select';
  document.body.removeEventListener('mousemove', onMouseMove);
  document.body.removeEventListener('mouseup', onMouseUp);
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
  var checkPos: Vector2D = new Vector2D({ x: x, y: y });
  var closestDistance: number = -1;
  var closestPlayerID: number = -1;
  for (var i = 0; i < gPlayers.length; i++) {
    var distance = getDistance(checkPos, gPlayers[i].pos);
    if (distance < closestDistance || closestDistance == -1) {
      closestDistance = distance;
      closestPlayerID = gPlayers[i].id;
    }
  }
  console.log('closestPlayerID: ' + closestPlayerID);
  return gPlayers[closestPlayerID];
}

function resetButton() {
  init();
}

function updateStats() {
  var d = new Date();
  var currentTime = d.getTime();
  gStats.lastFrameTime = currentTime - gStats.currentTime;
  gStats.currentTime = currentTime;
  gStats.frameCounter++;
  gStats.fps = Math.round(1000 / gStats.lastFrameTime);
}

function checkMouseHit(mousePos: Vector2D) {
  var minDistance: number = -1;
  var hitID: number = -1;
  for (var i = 0; i < gPlayers.length; i++) {
    var checkRadius: number = gPlayers[i].collisionRadius;
    var distance = getDistance(mousePos, gPlayers[i].pos);
    if (distance <= checkRadius) {
      if (distance < minDistance || minDistance == -1) {
        minDistance = distance;
        hitID = gPlayers[i].id;
      }
    }
  }
  return hitID;
}

function deselectPlayers() {
  for (var i = 0; i < gSelectedPlayerIDs.length;i++) {
    gPlayers[gSelectedPlayerIDs[i]].isSelected = false;
  }
  gSelectedPlayerIDs = [];
}

function selectPlayersInBox() {
  for (var i = 0; i < gPlayers.length; i++) {
    if (checkPlayerInBox(gPlayers[i], gPointer.startDrag, gPointer.endDrag)) {
      gPlayers[i].isSelected = true;
      gSelectedPlayerIDs.push(gPlayers[i].id);
    }
  }
}

function checkPlayerInBox(player: Player, startBox: Vector2D, endBox: Vector2D) {
  var inBox: boolean = false;
  if (player.pos.x - player.collisionRadius > startBox.x &&
    player.pos.x + player.collisionRadius < endBox.x &&
    player.pos.y - player.collisionRadius > startBox.y &&
    player.pos.y + player.collisionRadius < endBox.y) {
    inBox = true;
  }
  return inBox;

}