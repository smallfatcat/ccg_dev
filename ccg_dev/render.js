// Rendering Functions
function renderPlayAreaPixi() {
    if (!gPlayAreaCanvasCreated) {
        // create an new instance of a pixi stage
        stage = new PIXI.Stage(0xDDDDDD);

        // create a renderer instance.
        renderer = PIXI.autoDetectRenderer(800, 800);

        // add the renderer view element to the DOM
        $('#content').empty();
        $('#content').append(renderer.view);

        var html = '';
        var infoWindowPos = new Vector2D({ x: 800, y: 0 });
        gInfoWindow = new InfoWindow({ pos: infoWindowPos, visible: true });
        html += '<div id="infowindow" class="infowindow" style="left: ' + gInfoWindow.pos.x + 'px; top: ' + gInfoWindow.pos.y + 'px;"><div id="IWmain"></div><div id="IWsub"></div></div > ';

        // write scene to html
        $('#content').append(html);
        gPlayAreaCanvasCreated = true;

        // create a texture from an image path
        textures[0] = PIXI.Texture.fromImage("man_red.png");
        textures[1] = PIXI.Texture.fromImage("man_green.png");

        for (var i = 0; i < MAX_PLAYERS; i++) {
            // create a new Sprite using the texture
            var sprite = new PIXI.Sprite(textures[gPlayers[i].team]);

            // center the sprites anchor point
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;

            // move the sprite t the center of the screen
            sprite.position.x = gPlayers[i].pos.x;
            sprite.position.y = gPlayers[i].pos.y;

            stage.addChild(sprite);
            gSprites.push(sprite);
        }
        gfxObject = new PIXI.Graphics();
        stage.addChild(gfxObject);
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

    requestAnimationFrame(animate);
}

function animate() {
    gfxObject.clear();

    for (var i = 0; i < MAX_PLAYERS; i++) {
        gSprites[i].position.x = gPlayers[i].pos.x;
        gSprites[i].position.y = gPlayers[i].pos.y;
        gSprites[i].rotation = degToRad(gPlayers[i].rotDegrees);
        gfxObject.lineStyle(1, 0, 1);
        if (gPlayers[i].isMoving) {
            gfxObject.drawCircle(gPlayers[i].destination.x, gPlayers[i].destination.y, gPlayers[i].collisionRadius);
        }
        if (gPlayers[i].isSelected) {
            gfxObject.drawRect(gPlayers[i].pos.x - gPlayers[i].collisionRadius - 2, gPlayers[i].pos.y - gPlayers[i].collisionRadius - 2, (gPlayers[i].collisionRadius * 2) + 4, (gPlayers[i].collisionRadius * 2) + 4);
        }
    }

    // Draw selection box
    if (gPointer.mode == 'drag') {
        gfxObject.drawRect(gPointer.startDrag.x, gPointer.startDrag.y, gPointer.endDrag.x - gPointer.startDrag.x, gPointer.endDrag.y - gPointer.startDrag.y);
    }

    // render the stage
    renderer.render(stage);
}

function renderPlayArea() {
    // If this is the first time, create the canvas and write it to the page
    if (!gPlayAreaCanvasCreated) {
        $('#content').empty();
        var html = gPlayArea.generateHtml();
        var infoWindowPos = new Vector2D({ x: 800, y: 0 });
        gInfoWindow = new InfoWindow({ pos: infoWindowPos, visible: true });
        html += '<div id="infowindow" class="infowindow" style="left: ' + gInfoWindow.pos.x + 'px; top: ' + gInfoWindow.pos.y + 'px;"><div id="IWmain"></div><div id="IWsub"></div></div > ';

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
    var c = document.getElementById(gPlayArea.containerID);
    var ctx = c.getContext("2d");

    // Clear the Play Area Canvas
    ctx.clearRect(0, 0, gPlayArea.width, gPlayArea.height);

    for (var i = 0; i < MAX_PLAYERS; i++) {
        if (gPlayers[i].isAlive) {
            //drawFilledCircle(ctx, gPlayers[i].pos.x, gPlayers[i].pos.y, gPlayers[i].collisionRadius, gPlayers[i].team == 0 ? 'red' : 'blue');
            //drawCircle(ctx, gPlayers[i].destination.x, gPlayers[i].destination.y, gPlayers[i].collisionRadius);
            drawImage(ctx, gPlayers[i].pos.x, gPlayers[i].pos.y, gPlayers[i].rotDegrees, 16, gPlayers[i].team == 0 ? 'man_red' : 'man_green');
            if (gPlayers[i].isFighting) {
                drawFilledRectangle(ctx, gPlayers[i].pos.x - 12, gPlayers[i].pos.y - 24, (24 / 100) * gPlayers[i].health, 4, 'yellow');
            }
            if (gPlayers[i].isSelected) {
                drawRectangle(ctx, gPlayers[i].pos.x - gPlayers[i].collisionRadius - 2, gPlayers[i].pos.y - gPlayers[i].collisionRadius - 2, (gPlayers[i].collisionRadius * 2) + 4, (gPlayers[i].collisionRadius * 2) + 4);
            }
        } else {
            drawFilledCircle(ctx, gPlayers[i].pos.x, gPlayers[i].pos.y, 5, gPlayers[i].team == 0 ? 'red' : 'blue');
        }
    }

    // Draw selection box
    if (gPointer.mode == 'drag') {
        drawRectangle(ctx, gPointer.startDrag.x, gPointer.startDrag.y, gPointer.endDrag.x - gPointer.startDrag.x, gPointer.endDrag.y - gPointer.startDrag.y);
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
    html += '<br>playersSelected: ' + gSelectedPlayerIDs.length;
    if (gPause) {
        html += '<br><br>GAME PAUSED';
    }
    if (gReset) {
        html += '<br><br>Reset in ' + gStats.resetCountdown + (gStats.resetCountdown == 1 ? ' second' : ' seconds');
    }
    var htmlSub = '<input type="button" id="resetBut" value="Reset"></input>';

    $('#IWmain').empty();
    $('#IWmain').append(html);
    $('#IWsub').empty();
    $('#IWsub').append(htmlSub);
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

function drawRectangle(ctx, x, y, width, height) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.stroke();
}

function drawFilledRectangle(ctx, x, y, width, height, color) {
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
