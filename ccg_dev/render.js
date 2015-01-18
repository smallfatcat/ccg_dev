// Rendering Functions
function renderPlayArea() {
    // If this is the first time, create the canvas and write it to the page
    if (!gPlayAreaCanvasCreated) {
        $('#content').empty();
        var html = g_playArea.generateHtml();
        gInfoWindow = new InfoWindow({ pos: { x: 800, y: 0 }, visible: true });
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

    for (var i = 0; i < MAX_PLAYERS; i++) {
        if (gEntities[i].isAlive) {
            drawCircle(ctx, gEntities[i].pos.x, gEntities[i].pos.y, gEntities[i].collisionRadius, gEntities[i].team == 0 ? 'red' : 'blue');
            drawCircle(ctx, gEntities[i].destination.x, gEntities[i].destination.y, gEntities[i].collisionRadius, 'grey');
            drawImage(ctx, gEntities[i].pos.x, gEntities[i].pos.y, gEntities[i].rotDegrees, 32, 'policeimg');
            if (gEntities[i].isFighting) {
                drawRectangle(ctx, gEntities[i].pos.x - 12, gEntities[i].pos.y - 24, (24 / 100) * gEntities[i].health, 4, 'yellow');
            }
        } else {
            drawCircle(ctx, gEntities[i].pos.x, gEntities[i].pos.y, 5, gEntities[i].team == 0 ? 'red' : 'blue');
        }
    }

    for (i = 0; i < gBombs.length; i++) {
        if (gBombs[i].isAlive) {
            drawCircle(ctx, gBombs[i].pos.x, gBombs[i].pos.y, gBombs[i].radius, 'red');
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
    html += '<br>kills: ' + gStats.kills;
    html += '<br>teamKillsA: ' + gStats.teamKillsA;
    html += '<br>teamKillsB: ' + gStats.teamKillsB;
    html += '<br>playersAlive: ' + gStats.playersAlive;
    html += '<br>bombsUsed: ' + gStats.bombsUsed;
    if (gPause) {
        html += '<br><br>GAME PAUSED';
    }
    if (gReset) {
        html += '<br><br>Reset in ' + gStats.resetCountdown + (gStats.resetCountdown == 1 ? ' second' : ' seconds');
    }

    $('#infowindow').empty();
    $('#infowindow').append(html);
}

function drawCircle(ctx, x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
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

function render() {
    $('#content').empty();

    // Set up
    var html = '';

    for (var i = 0; i < MAX_PLAYERS; i++) {
        if (gEntities[i].isAlive) {
            html += renderPlayer(gEntities[i]);
        }
    }

    for (i = 0; i < gBombs.length; i++) {
        if (gBombs[i].isAlive) {
            html += '<div id="bombDiv' + gBombs[i].id + '" class="absolute" style="left: ' + (gBombs[i].pos.x - 150) + 'px; top: ' + (gBombs[i].pos.y - 150) + 'px;"><canvas id = "bomb' + gBombs[i].id + '" width = "300" height = "300";" ></div>';
        }
    }

    // Mouse pointer
    html += '<div id="mouseHit" class="absolute" style="left: ' + g_pointer.pos.x + 'px; top: ' + g_pointer.pos.y + 'px;"><img id="imouseHit" style="width: 32px;" src="crosshair.png"></div>';

    // write scene to html
    $('#content').append(html);

    for (i = 0; i < gBombs.length; i++) {
        if (gBombs[i].isAlive) {
            drawBomb(gBombs[i]);
        }
    }
    // rotate each test object
    //for (var i = 0; i < MAX_PLAYERS; i++) {
    //  $('#i' + i).rotate(gEntities[i].rotDegrees);
    //}
}

function drawBomb(bomb) {
    var c = document.getElementById("bomb" + bomb.id);
    if (c == null) {
        console.log('break');
    }
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(150, 150, bomb.radius, 0, 2 * Math.PI);
    ctx.stroke();
    //var img = document.getElementById("i0");
    //img.src = 'tile_grey_32.png';
    //ctx.drawImage(img, 0, 0);
}

function renderPlayer(player) {
    var playerDiv = '';

    //playerDiv += '<div id="playerDiv' + player.id + '" class="absolute" style="left: ' + player.pos.x + 'px; top: ' + player.pos.y + 'px;">' + player.name + ' x: ' + player.pos.x + ' y: ' + player.pos.y + '</div>';
    var imgSrc = '';

    //imgSrc = player.id < (MAX_PLAYERS / 2) ? 'ball.png' : 'ball_red.png';
    imgSrc = 'police.png';
    playerDiv += '<div id="playerDiv' + player.id + '" class="absolute" style="left: ' + player.pos.x + 'px; top: ' + player.pos.y + 'px;"><img id="i' + player.id + '" style="width: 32px;" src="' + imgSrc + '"></div>';

    return playerDiv;
    //$('#content').append(playerDiv);
    //$('#playerDiv').animate({ 'left': player.pos.x + 'px', 'top': player.pos.y + 'px' });
}
//# sourceMappingURL=render.js.map
