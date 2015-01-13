var PHYSICS_TICK: number = 33;
var PHYSICS_GRAVITY: number = 9.8;

class Entity {
  id: number;
  xPos: number;
  yPos: number;

  xVel: number;
  yVel: number;

  xAcc: number;
  yAcc: number;

  constructor(properties: EntProps) {
    this.id = properties.id;
    this.xPos = properties.xPos;
    this.yPos = properties.yPos;
    this.xVel = 0;
    this.yVel = 0;
    this.xAcc = 0;
    this.yAcc = PHYSICS_GRAVITY;
  }

  show() {

  }

  hide() {

  }

  move(x: number, y: number) {
    this.xPos += x;
    this.yPos += y;
  }

  moveTo(x: number, y: number) {
    this.xPos = x;
    this.yPos = y;
  }
}

class Prop extends Entity {
  iconID: number;
  constructor(properties: PropProps) {
    super(properties);
    this.iconID = properties.iconID;
  }
}

class Player extends Entity {
  iconID: number;
  name: string;
  constructor(properties: PlayerProps) {
    super(properties);
    this.name = properties.name;
    this.iconID = properties.iconID;
  }
}

interface EntProps {
  id: number;
  xPos: number;
  yPos: number;
}

interface PropProps extends EntProps {
  iconID: number;
}

interface PlayerProps extends EntProps {
  iconID: number;
  name: string;
}


var g_player1 = new Player({ id: 1, xPos: 10, yPos: 20, iconID: 1, name: 'David' });
var g_player2 = new Player({ id: 2, xPos: 10, yPos: 50, iconID: 2, name: 'Gary' });

window.onload = () => {
  render();
  setTimeout(physics, PHYSICS_TICK);
};

function render() {
  $('#content').empty();
  renderPlayer(g_player1);
  renderPlayer(g_player2);
}

function physics() {
  physicsPlayer(g_player1);
  physicsPlayer(g_player2);
  setTimeout(physics, PHYSICS_TICK);
  render();
}

function physicsPlayer(player: Player) {
  // v^2 = u^2 + 2as
  // s = u*t + 0.5 * a * t^2
  // v = u + a*t
  var t: number = PHYSICS_TICK / 1000;

  var uy: number = player.yVel;
  var vy: number = uy + (player.yAcc * t);
  var starty: number = player.yPos;
  var endy: number = starty + ((uy * t) + (0.5 * t * t * player.yAcc ) );

  if (endy > 500) {
    var s: number = 500 - starty;
    vy = Math.sqrt(uy * uy * (2 * player.yAcc * s));
    var collisionTime: number = (vy - uy) / player.yAcc;
    endy = 500;
    vy *= -0.9;
  }

  player.xPos += player.xVel;
  player.yPos = endy;

  player.xVel += player.xAcc;
  player.yVel = vy;

}

function renderPlayer(player: Player) {
  var playerDiv: string = '';
  playerDiv += '<div id="playerDiv' + player.id + '" class="absolute" style="left: ' + player.xPos + 'px; top: ' + player.yPos + 'px;">' + player.name + '</div>';
  $('#content').append(playerDiv);
  //$('#playerDiv').animate({ 'left': player.xPos + 'px', 'top': player.yPos + 'px' });
}
