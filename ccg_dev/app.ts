var PHYSICS_TICK: number = 10;
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
    this.xVel = 50;
    this.yVel = -50;
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


var g_player1 = new Player({ id: 1, xPos: 10, yPos: 0, iconID: 1, name: 'David' });
var g_player2 = new Player({ id: 2, xPos: 10, yPos: 250, iconID: 2, name: 'Gary' });

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

  var ux: number = player.xVel;
  var uy: number = player.yVel;
  var vx: number = ux + (player.xAcc * t);
  var vy: number = uy + (player.yAcc * t);
  var startx: number = player.xPos;
  var starty: number = player.yPos;
  var endx: number = startx + ((ux * t) + (0.5 * t * t * player.xAcc));
  var endy: number = starty + ((uy * t) + (0.5 * t * t * player.yAcc ) );

  if (endx > 800) {
    endx -= 800;
  }

  var collided = collide(t, uy, vy, starty, endy, 500, player.yAcc);
  endy = collided.end;
  vy = collided.v;
 
  player.xPos = endx;
  player.yPos = endy;

  player.xVel = vx;
  player.yVel = vy;

}

function collide(t: number, u: number, v: number, start: number, end: number, limit: number, acc: number) {
  if (end > limit) {
    var s: number = limit - start;
    v = Math.sqrt(u * u + (2 * acc * s));
    var collisionTime: number = (v - u) / acc;
    var remainingtime: number = t - collisionTime;
    v *= -0.8;
    if (v < -0.01) {
      u = v;
      start = limit;
      end = start + ((u * remainingtime) + (0.5 * remainingtime * remainingtime * acc));
      v = u + (acc * remainingtime);
      //end = 500;
    }
    else {
      end = 500;
      v = 0;
    }
  }
  return {'end': end, 'v': v}
}

function renderPlayer(player: Player) {
  var playerDiv: string = '';
  playerDiv += '<div id="playerDiv' + player.id + '" class="absolute" style="left: ' + player.xPos + 'px; top: ' + player.yPos + 'px;">' + player.name + ' x: ' + player.xPos + ' y: ' + player.yPos + '</div>';
  $('#content').append(playerDiv);
  //$('#playerDiv').animate({ 'left': player.xPos + 'px', 'top': player.yPos + 'px' });
}
