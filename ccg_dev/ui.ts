// UI functions

function mouseDown(event) {
  console.log('Mouse:' + event.which + ' Xpos:' + event.pageX + ' Ypos:' + event.pageY);
  g_pointer.pos.x = event.pageX - 16;
  g_pointer.pos.y = event.pageY - 16;
  var bomb = new Bomb({ id: gBombs.length, pos: {x: event.pageX, y: event.pageY }, maxRadius: 150, minRadius: 1, maxLifeTime: 1, damage: 1})
  gBombs.push(bomb);
  gStats.bombsUsed++;
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