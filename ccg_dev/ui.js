// UI functions
function mouseDown(event) {
    console.log('Mouse:' + event.which + ' Xpos:' + event.pageX + ' Ypos:' + event.pageY);
    var PointerPos = new Vector2D({ x: event.pageX, y: event.pageY });
    gPointer.pos = PointerPos;
    if (gPointer.mode == 'select') {
        deselectPlayers();
        var selectedID = checkMouseHit(gPointer.pos);
        if (selectedID != -1) {
            var selectedPlayer = gPlayers[selectedID];
            selectedPlayer.isSelected = true;
            gSelectedPlayerIDs.push(selectedPlayer.id);
            gPointer.mode = 'makedest';
            return;
        } else {
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
        console.log('makedestbox');
        gPlayers[gSelectedPlayerIDs[0]].destination = PointerPos;
        gPlayers[gSelectedPlayerIDs[0]].isSelected = false;
        gPlayers[gSelectedPlayerIDs[0]].moveTowards(gPlayers[gSelectedPlayerIDs[0]].destination);
        gPlayers[gSelectedPlayerIDs[0]].isMoving = true;
        gStats.playersMoving++;
        gSelectedPlayerIDs = [];
        gPointer.mode = 'select';
        return;
    }

    if (gPointer.mode == 'makedestbox') {
        console.log('makedestbox');
        var n = gSelectedPlayerIDs.length;
        if (n > 0) {
            var rows = Math.ceil(Math.sqrt(n));
            var destGrid = createGrid(gPointer.pos.x, gPointer.pos.y, n, 16, rows);
            for (var i = 0; i < gSelectedPlayerIDs.length; i++) {
                gPlayers[gSelectedPlayerIDs[i]].destination = destGrid[i];
                gPlayers[gSelectedPlayerIDs[i]].isSelected = false;
                gPlayers[gSelectedPlayerIDs[i]].moveTowards(gPlayers[gSelectedPlayerIDs[i]].destination);
                gPlayers[gSelectedPlayerIDs[i]].isMoving = true;
                gStats.playersMoving++;
            }
            gSelectedPlayerIDs = [];
        }
        gPointer.mode = 'select';
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
    deselectPlayers();
    selectPlayersInBox();
}

function onMouseUp(event) {
    deselectPlayers();
    selectPlayersInBox();
    if (gSelectedPlayerIDs.length > 0) {
        gPointer.mode = 'makedestbox';
    } else {
        gPointer.mode = 'select';
    }
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

function selectPlayer(x, y) {
    var checkPos = new Vector2D({ x: x, y: y });
    var closestDistance = -1;
    var closestPlayerID = -1;
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

function checkMouseHit(mousePos) {
    var minDistance = -1;
    var hitID = -1;
    for (var i = 0; i < gPlayers.length; i++) {
        var checkRadius = gPlayers[i].collisionRadius;
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
    for (var i = 0; i < gSelectedPlayerIDs.length; i++) {
        gPlayers[gSelectedPlayerIDs[i]].isSelected = false;
    }
    gSelectedPlayerIDs = [];
}

function selectPlayersInBox() {
    for (var i = 0; i < gPlayers.length; i++) {
        if (checkPlayerInBox(gPlayers[i], gPointer.startDrag, gPointer.endDrag)) {
            gPlayers[i].isSelected = true;
            gSelectedPlayerIDs.push(gPlayers[i].id);
        } else {
            gPlayers[i].isSelected = false;
        }
    }
}

function checkPlayerInBox(player, startBox, endBox) {
    var inBox = false;
    var minX = Math.min(startBox.x, endBox.x);
    var maxX = Math.max(startBox.x, endBox.x);
    var minY = Math.min(startBox.y, endBox.y);
    var maxY = Math.max(startBox.y, endBox.y);
    if (player.pos.x - player.collisionRadius > minX && player.pos.x + player.collisionRadius < maxX && player.pos.y - player.collisionRadius > minY && player.pos.y + player.collisionRadius < maxY) {
        inBox = true;
    }
    return inBox;
}
//# sourceMappingURL=ui.js.map
