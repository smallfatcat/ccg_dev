// UI functions

function mouseDown(event) {
  console.log('Mouse:' + event.which + ' Xpos:' + event.pageX + ' Ypos:' + event.pageY);
  g_pointer.xPos = event.pageX - 16;
  g_pointer.yPos = event.pageY - 16;
  var bomb = new Bomb({ id: g_bombs.length, xPos: event.pageX, yPos: event.pageY, maxRadius: 150, minRadius: 1, maxLifeTime: 1, damage: 1})
  g_bombs.push(bomb);
  g_stats.bombsUsed++;
}

function keyDown(event) {
  console.log('Key Pressed:' + event.which);
  if (g_pause_released && event.which == 32) {
    g_pause = !g_pause;
    g_pause_released = false;
  }
}

function keyUp(event) {
  if (event.which == 32) {
    g_pause_released = true;
  }
} 