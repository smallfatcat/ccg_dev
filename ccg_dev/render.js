// Rendering Functions
function renderPlayArea() {
    // If this is the first time, create the canvas and write it to the page
    if (!gPlayAreaCanvasCreated) {
        $('#content').empty();
        var html = g_playArea.generateHtml();
        var infoWindowPos = new Vector2D({ x: 800, y: 0 });
        gInfoWindow = new InfoWindow({ pos: infoWindowPos, visible: true });
        html += '<div id="infowindow" class="infowindow" style="left: ' + gInfoWindow.pos.x + 'px; top: ' + gInfoWindow.pos.y + 'px;">Test</div>';

        // write scene to html
        $('#content').append(html);
        gPlayAreaCanvasCreated = true;
    }

    // Show or hide infoWindow
    if (gInfoWindow.visible && !gInfoWindow.currentVisibility) {
        $('#infowindow').show();
        gInfoWindow.currentVisibility = true;
    }
    if (!gInfoWindow.visible && gInfoWindow.currentVisibility) {
        $('#infowindow').hide();
        gInfoWindow.currentVisibility = false;
    }

    updateInfoWindow();

    // Use canvas
    var c = document.getElementById(g_playArea.containerID);
    var ctx = c.getContext("2d");

    // Clear the Play Area Canvas
    ctx.clearRect(0, 0, g_playArea.width, g_playArea.height);

    for (var i = 0; i < MAX_PLAYERS; i++) {
        if (gEntities[i].isAlive) {
            drawFilledCircle(ctx, gEntities[i].pos.x, gEntities[i].pos.y, gEntities[i].collisionRadius, gEntities[i].team == 0 ? 'red' : 'blue');
            drawCircle(ctx, gEntities[i].destination.x, gEntities[i].destination.y, gEntities[i].collisionRadius);

            //drawImage(ctx, gEntities[i].pos.x, gEntities[i].pos.y, gEntities[i].rotDegrees, 32, 'policeimg');
            if (gEntities[i].isFighting) {
                drawRectangle(ctx, gEntities[i].pos.x - 12, gEntities[i].pos.y - 24, (24 / 100) * gEntities[i].health, 4, 'yellow');
            }
        } else {
            drawFilledCircle(ctx, gEntities[i].pos.x, gEntities[i].pos.y, 5, gEntities[i].team == 0 ? 'red' : 'blue');
        }
    }

    for (i = 0; i < gBombs.length; i++) {
        if (gBombs[i].isAlive) {
            drawFilledCircle(ctx, gBombs[i].pos.x, gBombs[i].pos.y, gBombs[i].radius, 'red');
        }
    }
}

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
    if (gPause) {
        html += '<br><br>GAME PAUSED';
    }
    if (gReset) {
        html += '<br><br>Reset in ' + gStats.resetCountdown + (gStats.resetCountdown == 1 ? ' second' : ' seconds');
    }
    html += '<br><input type="button" id="resetBut" value="Start"></input>';

    $('#infowindow').empty();
    $('#infowindow').append(html);
    $('#resetBut').mousedown(function () {
        init();
    });
}

function drawFilledCircle(ctx, x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
}

function drawCircle(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawRectangle(ctx, x, y, width, height, color) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.stroke();
}

function drawImage(ctx, x, y, a, width, imgID) {
    var image = document.getElementById(imgID);

    ctx.translate(x, y);
    ctx.rotate(a * Math.PI / 180);

    //ctx.fillRect(-50, -50, 100, 100);
    ctx.drawImage(image, width / -2, width / -2);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}
//# sourceMappingURL=render.js.map
