// UI functions
function mouseDown(event) {
    console.log('Mouse:' + event.which + ' Xpos:' + event.pageX + ' Ypos:' + event.pageY);
    var PointerPos = new Vector2D({ x: event.pageX, y: event.pageY });
    g_pointer.pos = PointerPos;
    if (g_pointer.mode == 'select') {
        var selectedPlayer = selectPlayer(event.pageX, event.pageY);
        selectedPlayer.isSelected = true;
        gSelectedPlayerID = selectedPlayer.id;
        g_pointer.mode = 'makedest';
        return;
    }

    if (g_pointer.mode == 'makedest') {
        gEntities[gSelectedPlayerID].destination = PointerPos;
        gEntities[gSelectedPlayerID].isSelected = false;
        gEntities[gSelectedPlayerID].isMoving = true;
        gEntities[gSelectedPlayerID].pointAt(gEntities[gSelectedPlayerID].destination);
        gEntities[gSelectedPlayerID].moveForward;
        gSelectedPlayerID = -1;
        g_pointer.mode = 'select';
        return;
    }
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

function selectPlayer(x, y) {
    var checkPos = new Vector2D({ x: x, y: y });
    var closestDistance = -1;
    var closestPlayerID = -1;
    for (var i = 0; i < gEntities.length; i++) {
        var distance = getDistance(checkPos, gEntities[i].pos);
        if (distance < closestDistance || closestDistance == -1) {
            closestDistance = distance;
            closestPlayerID = gEntities[i].id;
        }
    }
    console.log('closestPlayerID: ' + closestPlayerID);
    return gEntities[closestPlayerID];
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
//# sourceMappingURL=ui.js.map
