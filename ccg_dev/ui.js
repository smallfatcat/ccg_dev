// UI functions
function addInputListeners() {
    $(document).on("keydown", function (event) {
        keyDown(event);
    });
    $(document).on("mousedown", function (event) {
        mouseDown(event);
    });
    $(document).keyup(function (event) {
        keyUp(event);
    });
    document.body.addEventListener('mousemove', getMousePos);
}

function getMousePos(event) {
    gPointer.pos.x = event.clientX;
    gPointer.pos.y = event.clientY;
}

// Info window
function updateInfoWindow() {
    var html = '';
    html += 'startTime: ' + gStats.startTime;
    html += '<br>frameCounter: ' + gStats.frameCounter;
    html += '<br>currentTime: ' + gStats.currentTime;
    html += '<br>fps: ' + gStats.fps;
    html += '<br>lastFrameTime: ' + gStats.lastFrameTime;

    //html += '<br>kills: ' + gStats.kills;
    //html += '<br>teamKillsA: ' + gStats.teamKillsA;
    //html += '<br>teamKillsB: ' + gStats.teamKillsB;
    html += '<br>playersAlive: ' + gStats.playersAlive;

    //html += '<br>bombsUsed: ' + gStats.bombsUsed;
    html += '<br>playersMoving: ' + gStats.playersMoving;
    html += '<br>playersSelected: ' + gSelectedPlayerIDs.length;
    html += '<br>Mouse x: ' + gPointer.pos.x;
    html += '<br>Mouse y: : ' + gPointer.pos.y;
    html += '<br>Mouse mode: : ' + gPointer.mode;
    html += '<br>Draw mode: : ' + (gDrawToggle ? 'on' : 'off');
    if (gPause) {
        html += '<br><br>GAME PAUSED';
    }
    if (gReset) {
        html += '<br><br>Reset in ' + gStats.resetCountdown + (gStats.resetCountdown == 1 ? ' second' : ' seconds');
    }
    var htmlSub = '<input type="button" id="resetBut" value="Reset"></input>';
    htmlSub += '<br><input type="button" id="navHUDBut" value="Toggle NavHUD"></input>';
    htmlSub += '<br><input type="button" id="drawBut" value="Toggle Draw"></input>';

    $('#IWmain').empty();
    $('#IWmain').append(html);
    $('#IWsub').empty();
    $('#IWsub').append(htmlSub);
    $('#resetBut').mousedown(function () {
        init();
    });
    $('#navHUDBut').mousedown(function () {
        navHUDtoggle();
    });
    $('#drawBut').mousedown(function () {
        drawToggle();
    });
}

// button functions
function resetButton() {
    init();
}

function navHUDtoggle() {
    gNavHUD = !gNavHUD;
}

function drawToggle() {
    gDrawToggle = !gDrawToggle;
}

// mouse functions
function mouseDown(event) {
    console.log('Mouse:' + event.which + ' Xpos:' + event.pageX + ' Ypos:' + event.pageY);
    var PointerPos = new Vector2D({ x: event.pageX, y: event.pageY });
    gPointer.pos = PointerPos;
    if (!gDrawToggle) {
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
            var player = gPlayers[gSelectedPlayerIDs[0]];
            player.emptyWaypoints();
            player.setWaypoints(PointerPos);
            player.destination = PointerPos;
            player.isSelected = false;
            player.moveTowards(player.destination);

            player.isMoving = true;
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
                var destGrid = createGrid(gPointer.pos.x, gPointer.pos.y, n, 32, rows);
                for (var i = 0; i < gSelectedPlayerIDs.length; i++) {
                    var player = gPlayers[gSelectedPlayerIDs[i]];
                    player.emptyWaypoints();
                    player.setWaypoints(destGrid[i]);
                    player.destination = destGrid[i];
                    player.isSelected = false;
                    player.moveTowards(player.destination);
                    player.isMoving = true;
                    gStats.playersMoving++;
                }
                gSelectedPlayerIDs = [];
            }
            gPointer.mode = 'select';
        }
    } else {
        if (gPointer.mode == 'select' && event.pageX < 800) {
            gPointer.startDrag.x = event.pageX;
            gPointer.startDrag.y = event.pageY;
            gPointer.endDrag.x = event.pageX;
            gPointer.endDrag.y = event.pageY;
            document.body.addEventListener('mousemove', onMouseMoveDraw);
            document.body.addEventListener('mouseup', onMouseUpDraw);
            gPointer.mode = 'drag';
        }
    }
    /*
    var bomb = new Bomb({ id: gBombs.length, pos: { x: event.pageX, y: event.pageY }, maxRadius: 150, minRadius: 1, maxLifeTime: 1, damage: 1 })
    gBombs.push(bomb);
    gStats.bombsUsed++;
    */
}

//var scenery9 = new Scenery({ rect: new Rect({ x: 450, y: 200, width: 200, height: 16 }) });
//gScenery.push(scenery1);
function onMouseUpDraw(event) {
    var ax = Math.min(gPointer.startDrag.x, gPointer.endDrag.x);
    var ay = Math.min(gPointer.startDrag.y, gPointer.endDrag.y);
    var bx = Math.max(gPointer.startDrag.x, gPointer.endDrag.x);
    var by = Math.max(gPointer.startDrag.y, gPointer.endDrag.y);

    var scenery = new Scenery({
        rect: new Rect({
            x: ax,
            y: ay,
            width: bx - ax,
            height: by - ay
        })
    });
    gScenery.push(scenery);
    gEdges = buildEdges();
    gVG = buildVG();
    gPointer.mode = 'select';
    document.body.removeEventListener('mousemove', onMouseMoveDraw);
    document.body.removeEventListener('mouseup', onMouseUpDraw);
}

function onMouseMoveDraw(event) {
    gPointer.endDrag.x = event.pageX;
    gPointer.endDrag.y = event.pageY;
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

// Keyboard functions
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
