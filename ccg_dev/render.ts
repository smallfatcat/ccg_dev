// Rendering Functions

function render() {
  $('#content').empty();
  var html: string = '';
  for (var i = 0; i < MAX_BALLS; i++) {
    html += renderPlayer(g_entities[i]);
  }
  html += '<div id="canvasDiv" class="absolute" style="left: ' + (g_pointer.xPos - 134) + 'px; top: ' + (g_pointer.yPos - 134) + 'px;"><canvas id = "myCanvas" width = "300" height = "300" style = "border:1px solid #d3d3d3;" ></div>';
  html += '<div id="mouseHit" class="absolute" style="left: ' + g_pointer.xPos + 'px; top: ' + g_pointer.yPos + 'px;"><img id="imouseHit" style="width: 32px;" src="crosshair.png"></div>';

  $('#content').append(html);
  drawCanvas();
  for (var i = 0; i < MAX_BALLS; i++) {
    $('#i' + i).rotate(g_entities[i].rotDegrees);
  }
}

function drawCanvas() {
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  ctx.beginPath();
  ctx.arc(150, 150, 100, 0, 2 * Math.PI);
  ctx.stroke();
  var img = document.getElementById("i0");
  img.src = 'tile_grey_32.png';
  ctx.drawImage(img, 0, 0);
}

function renderPlayer(player: Player) {
  var playerDiv: string = '';
  //playerDiv += '<div id="playerDiv' + player.id + '" class="absolute" style="left: ' + player.xPos + 'px; top: ' + player.yPos + 'px;">' + player.name + ' x: ' + player.xPos + ' y: ' + player.yPos + '</div>';
  var imgSrc: string = '';
  //imgSrc = player.id < (MAX_BALLS / 2) ? 'ball.png' : 'ball_red.png';
  imgSrc = 'police.png';
  playerDiv += '<div id="playerDiv' + player.id + '" class="absolute" style="left: ' + player.xPos + 'px; top: ' + player.yPos + 'px;"><img id="i' + player.id + '" style="width: 32px;" src="' + imgSrc + '"></div>';

  return playerDiv;
  //$('#content').append(playerDiv);
  //$('#playerDiv').animate({ 'left': player.xPos + 'px', 'top': player.yPos + 'px' });
}