// UI functions

function mouseDown(event) {
  console.log('Mouse:' + event.which + ' Xpos:' + event.pageX + ' Ypos:' + event.pageY);
  g_pointer.xPos = event.pageX - 16;
  g_pointer.yPos = event.pageY - 16;
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