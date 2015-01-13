var PHYSICS_TICK: number = 33;
var PHYSICS_GRAVITY: number = 98;
var MAX_BALLS: number = 100;

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
    this.xVel = 150;
    this.yVel = -100;
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


//var g_player1 = new Player({ id: 1, xPos: 100, yPos: 100, iconID: 1, name: 'David' });
//var g_player2 = new Player({ id: 2, xPos: 200, yPos: 250, iconID: 2, name: 'Gary' });
var g_entities = [];

for (var i = 0;i<MAX_BALLS; i++) {
  var ball: Player = new Player({ id: i, xPos: Math.random() * 400, yPos: Math.random() * 700, iconID: 1, name: String(i) });
  ball.xVel = (Math.random() * 300) - 50;
  ball.yVel = (Math.random() * 300) - 50;
  g_entities.push(ball);
}

window.onload = () => {
  render();
  setTimeout(physics, PHYSICS_TICK);
};

function render() {
  $('#content').empty();
  for (var i = 0; i < MAX_BALLS; i++) {
    renderPlayer(g_entities[i]);
  }
}

function physics() {
  for (var i = 0; i < MAX_BALLS; i++) {
    physicsPlayer(g_entities[i]);
  }
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

  var collided;

  collided = collide(t, ux, vx, startx, endx, 800, player.xAcc, 1, 0.9);
  endx = collided.end;
  vx = collided.v;
  if (collided.touched) {
    vy *= 0.99;
  }

  collided = collide(t, ux, vx, startx, endx, 0, player.xAcc, -1, 0.9);
  endx = collided.end;
  vx = collided.v;
  if (collided.touched) {
    vy *= 0.99;
  }

  collided = collide(t, uy, vy, starty, endy, 800, player.yAcc, 1, 0.9);
  endy = collided.end;
  vy = collided.v;
  if (collided.touched) {
    vx *= 0.99;
  }

  collided = collide(t, uy, vy, starty, endy, 0, player.yAcc, -1, 0.9);
  endy = collided.end;
  vy = collided.v;
  if (collided.touched) {
    vx *= 0.99;
  }
 
  player.xPos = endx;
  player.yPos = endy;

  player.xVel = vx;
  player.yVel = vy;

}

function collide(t: number, u: number, v: number, start: number, end: number, limit: number, acc: number, direction: number, elasticity: number) {
  var touched: boolean = false;
  if ((end > limit && direction == 1) || (end < limit && direction == -1)) {
    touched = true;
    var s: number = (limit - start) * direction;
    v = Math.sqrt(u * u + (2 * acc * s)) * direction;
    var collisionTime: number = acc > 0 ? (v - u) / acc : s / u;
    var remainingtime: number = t - collisionTime;
    v *= -1*elasticity;
    if ((v < -0.01 && direction == 1 )|| (v > 0.01 && direction == -1)) {
      u = v;
      start = limit;
      end = start + ((u * remainingtime) + (0.5 * remainingtime * remainingtime * acc));
      v = u + (acc * remainingtime);
      //end = 500;
    }
    else {
      end = limit;
      v = 0;
    }
  }
  return { 'end': end, 'v': v, 'touched': touched };
}

function renderPlayer(player: Player) {
  var playerDiv: string = '';
  //playerDiv += '<div id="playerDiv' + player.id + '" class="absolute" style="left: ' + player.xPos + 'px; top: ' + player.yPos + 'px;">' + player.name + ' x: ' + player.xPos + ' y: ' + player.yPos + '</div>';
  playerDiv += '<div id="playerDiv' + player.id + '" class="absolute" style="left: ' + player.xPos + 'px; top: ' + player.yPos + 'px;">' + player.name+'</div>';

  $('#content').append(playerDiv);
  //$('#playerDiv').animate({ 'left': player.xPos + 'px', 'top': player.yPos + 'px' });
}
