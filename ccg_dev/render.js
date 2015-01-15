// Rendering Functions
function renderPlayArea() {
    // If this is the first time, create the canvas and write it to the page
    if (!g_playAreaCanvasCreated) {
        $('#content').empty();
        var html = g_playArea.generateHtml();

        // write scene to html
        $('#content').append(html);
        g_playAreaCanvasCreated = true;
    }

    // Use canvas
    var c = document.getElementById(g_playArea.containerID);
    var ctx = c.getContext("2d");

    ctx.clearRect(0, 0, g_playArea.width, g_playArea.height);

    for (var i = 0; i < MAX_BALLS; i++) {
        if (g_entities[i].isAlive) {
            drawCircle(ctx, g_entities[i].xPos, g_entities[i].yPos, 16);
        }
    }

    for (i = 0; i < g_bombs.length; i++) {
        if (g_bombs[i].isAlive) {
            drawCircle(ctx, g_bombs[i].xPos, g_bombs[i].yPos, g_bombs[i].radius);
        }
    }
}

function drawCircle(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

function render() {
    $('#content').empty();

    // Set up
    var html = '';

    for (var i = 0; i < MAX_BALLS; i++) {
        if (g_entities[i].isAlive) {
            html += renderPlayer(g_entities[i]);
        }
    }

    for (i = 0; i < g_bombs.length; i++) {
        if (g_bombs[i].isAlive) {
            html += '<div id="bombDiv' + g_bombs[i].id + '" class="absolute" style="left: ' + (g_bombs[i].xPos - 150) + 'px; top: ' + (g_bombs[i].yPos - 150) + 'px;"><canvas id = "bomb' + g_bombs[i].id + '" width = "300" height = "300";" ></div>';
        }
    }

    // Mouse pointer
    html += '<div id="mouseHit" class="absolute" style="left: ' + g_pointer.xPos + 'px; top: ' + g_pointer.yPos + 'px;"><img id="imouseHit" style="width: 32px;" src="crosshair.png"></div>';

    // write scene to html
    $('#content').append(html);

    for (i = 0; i < g_bombs.length; i++) {
        if (g_bombs[i].isAlive) {
            drawBomb(g_bombs[i]);
        }
    }

    for (var i = 0; i < MAX_BALLS; i++) {
        $('#i' + i).rotate(g_entities[i].rotDegrees);
    }
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

    //playerDiv += '<div id="playerDiv' + player.id + '" class="absolute" style="left: ' + player.xPos + 'px; top: ' + player.yPos + 'px;">' + player.name + ' x: ' + player.xPos + ' y: ' + player.yPos + '</div>';
    var imgSrc = '';

    //imgSrc = player.id < (MAX_BALLS / 2) ? 'ball.png' : 'ball_red.png';
    imgSrc = 'police.png';
    playerDiv += '<div id="playerDiv' + player.id + '" class="absolute" style="left: ' + player.xPos + 'px; top: ' + player.yPos + 'px;"><img id="i' + player.id + '" style="width: 32px;" src="' + imgSrc + '"></div>';

    return playerDiv;
    //$('#content').append(playerDiv);
    //$('#playerDiv').animate({ 'left': player.xPos + 'px', 'top': player.yPos + 'px' });
}
//# sourceMappingURL=render.js.map
