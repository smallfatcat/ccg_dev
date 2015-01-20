// Rendering Functions

function renderPlayArea() {
  // If this is the first time, create the canvas and write it to the page
  if (!gPlayAreaCanvasCreated) {
    $('#content').empty();
    var html: string = gPlayArea.generateHtml();
    var infoWindowPos: Vector2D = new Vector2D({ x: 800, y: 0 });
    gInfoWindow = new InfoWindow({ pos: infoWindowPos, visible: true});
    html += '<div id="infowindow" class="infowindow" style="left: ' + gInfoWindow.pos.x + 'px; top: ' + gInfoWindow.pos.y +'px;">Test</div>';
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

  var c = <HTMLCanvasElement> document.getElementById(gPlayArea.containerID);
  var ctx = c.getContext("2d");

  // Clear the Play Area Canvas
  ctx.clearRect(0, 0, gPlayArea.width, gPlayArea.height);

  // Each Alive entity
  for (var i = 0; i < MAX_PLAYERS; i++) {
    if (gPlayers[i].isAlive) {
      drawFilledCircle(ctx, gPlayers[i].pos.x, gPlayers[i].pos.y, gPlayers[i].collisionRadius, gPlayers[i].team == 0 ? 'red' : 'blue');
      drawCircle(ctx, gPlayers[i].destination.x, gPlayers[i].destination.y, gPlayers[i].collisionRadius);
      //drawImage(ctx, gPlayers[i].pos.x, gPlayers[i].pos.y, gPlayers[i].rotDegrees, 32, 'policeimg');
      if (gPlayers[i].isFighting) {
        drawFilledRectangle(ctx, gPlayers[i].pos.x - 12, gPlayers[i].pos.y - 24, (24 / 100) * gPlayers[i].health, 4, 'yellow');
      }
      if (gPlayers[i].isSelected) {
        drawRectangle(ctx, gPlayers[i].pos.x - gPlayers[i].collisionRadius - 2, gPlayers[i].pos.y - gPlayers[i].collisionRadius - 2, (gPlayers[i].collisionRadius*2) + 4, (gPlayers[i].collisionRadius*2) + 4);
      }
    }
    else {
      drawFilledCircle(ctx, gPlayers[i].pos.x, gPlayers[i].pos.y, 5, gPlayers[i].team == 0 ? 'red' : 'blue');
    }
  }

  // Draw selection box
  if (gPointer.mode == 'drag') {
    drawRectangle(ctx, gPointer.startDrag.x, gPointer.startDrag.y, gPointer.endDrag.x - gPointer.startDrag.x, gPointer.endDrag.y - gPointer.startDrag.y);
  }

  // Each Bomb
  for (i = 0; i < gBombs.length; i++) {
    if (gBombs[i].isAlive) {
      drawFilledCircle(ctx, gBombs[i].pos.x, gBombs[i].pos.y, gBombs[i].radius, 'red');
    }
  }

}

function updateInfoWindow() {
  var html: string = '';
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
    html += '<br><br>Reset in ' + gStats.resetCountdown + (gStats.resetCountdown == 1 ? ' second':' seconds');
  }
  html += '<br><input type="button" id="resetBut" value="Start"></input>';

  $('#infowindow').empty();
  $('#infowindow').append(html);
  $('#resetBut').mousedown(function () {
    init();
  });
}


function drawFilledCircle(ctx, x: number, y: number, radius: number, color: string) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
}

function drawCircle(ctx, x: number, y: number, radius: number) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();
}

function drawRectangle(ctx, x: number, y: number, width: number, height: number) {
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';
  ctx.stroke();
}

function drawFilledRectangle(ctx, x: number, y: number, width: number, height: number, color: string) {
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';
  ctx.stroke();
}

function drawImage(ctx, x: number, y: number, a: number, width: number, imgID: string) {
  var image = document.getElementById(imgID);

  ctx.translate(x, y);
  ctx.rotate(a * Math.PI / 180);
  //ctx.fillRect(-50, -50, 100, 100);
  ctx.drawImage(image, width / -2, width / -2);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}