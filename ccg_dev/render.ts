// Rendering Functions

function renderPlayArea() {
  // If this is the first time, create the canvas and write it to the page
  if (!gPlayAreaCanvasCreated) {
    $('#content').empty();
    var html: string = g_playArea.generateHtml();
    // write scene to html
    $('#content').append(html);
    gPlayAreaCanvasCreated = true;
  }

  // Use canvas

  var c = <HTMLCanvasElement> document.getElementById(g_playArea.containerID);
  var ctx = c.getContext("2d");

  // Clear the Play Area Canvas
  ctx.clearRect(0, 0, g_playArea.width, g_playArea.height);

  // Each Alive entity
  for (var i = 0; i < MAX_BALLS; i++) {
    if (gEntities[i].isAlive) {
      drawCircle( ctx, gEntities[i].pos.x, gEntities[i].pos.y, 16 );
    }
  }

  // Each Bomb
  for (i = 0; i < gBombs.length; i++) {
    if (gBombs[i].isAlive) {
      drawCircle(ctx, gBombs[i].pos.x, gBombs[i].pos.y, gBombs[i].radius);
    }
  }

}

function drawCircle(ctx, x: number, y: number, radius: number ) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();
}

function render() {
  $('#content').empty();
  // Set up 
  var html: string = '';
  // Each test object
  for (var i = 0; i < MAX_BALLS; i++) {
    if (gEntities[i].isAlive) {
      html += renderPlayer(gEntities[i]);
    }
  }
  // Each Bomb
  for (i = 0; i < gBombs.length; i++) {
    if (gBombs[i].isAlive) {
      html += '<div id="bombDiv' + gBombs[i].id + '" class="absolute" style="left: ' + (gBombs[i].pos.x - 150) + 'px; top: ' + (gBombs[i].pos.y - 150) + 'px;"><canvas id = "bomb' + gBombs[i].id + '" width = "300" height = "300";" ></div>';
    }
  }

  // Mouse pointer
  html += '<div id="mouseHit" class="absolute" style="left: ' + g_pointer.pos.x + 'px; top: ' + g_pointer.pos.y + 'px;"><img id="imouseHit" style="width: 32px;" src="crosshair.png"></div>';

  // write scene to html
  $('#content').append(html);

  // draw bombs
  for (i = 0; i < gBombs.length; i++) {
    if (gBombs[i].isAlive) {
      drawBomb(gBombs[i]);
    }
  }
  
  // rotate each test object
  //for (var i = 0; i < MAX_BALLS; i++) {
  //  $('#i' + i).rotate(gEntities[i].rotDegrees);
  //}
}

function drawBomb(bomb: Bomb) {
  
  var c = <HTMLCanvasElement> document.getElementById("bomb"+bomb.id);
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

function renderPlayer(player: Player) {
  var playerDiv: string = '';
  //playerDiv += '<div id="playerDiv' + player.id + '" class="absolute" style="left: ' + player.pos.x + 'px; top: ' + player.pos.y + 'px;">' + player.name + ' x: ' + player.pos.x + ' y: ' + player.pos.y + '</div>';
  var imgSrc: string = '';
  //imgSrc = player.id < (MAX_BALLS / 2) ? 'ball.png' : 'ball_red.png';
  imgSrc = 'police.png';
  playerDiv += '<div id="playerDiv' + player.id + '" class="absolute" style="left: ' + player.pos.x + 'px; top: ' + player.pos.y + 'px;"><img id="i' + player.id + '" style="width: 32px;" src="' + imgSrc + '"></div>';

  return playerDiv;
  //$('#content').append(playerDiv);
  //$('#playerDiv').animate({ 'left': player.pos.x + 'px', 'top': player.pos.y + 'px' });
}