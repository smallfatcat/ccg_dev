/// <reference path="classes.ts" />
/// <reference path="render.ts" />
/// <reference path="physics.ts" />

var PHYSICS_TICK: number = 16;
var PHYSICS_GRAVITY: number = 0;
var PHYSICS_FRICTION: number = 1;
var PHYSICS_MAXRUN: number = 120;
var MAX_BALLS: number = 20;
var ELASTICITY_NORMAL: number = 1;

//var g_player1 = new Player({ id: 1, xPos: 100, yPos: 100, iconID: 1, name: 'David' });
//var g_player2 = new Player({ id: 2, xPos: 200, yPos: 250, iconID: 2, name: 'Gary' });
var g_entities = [];
var g_pause: boolean = false;
var g_pause_released: boolean = true;

for (var i = 0;i<MAX_BALLS; i++) {
  var ball: Player = new Player({ id: i, xPos: Math.random() * 400, yPos: Math.random() * 700, iconID: 1, name: String(i) });
  ball.xVel = (Math.random() * PHYSICS_MAXRUN) - (PHYSICS_MAXRUN/2);
  ball.yVel = (Math.random() * PHYSICS_MAXRUN) - (PHYSICS_MAXRUN/2);
  ball.rotDegrees = (Math.random() * 360);
  g_entities.push(ball);
}

var g_pointer: Entity = new Entity({ id: i, xPos: 0, yPos:0, iconID: 2, name: 'Pointer' });

window.onload = () => {
  render();
  setTimeout(physics, PHYSICS_TICK);

  $(document).on("keydown", function (event) { keyDown(event) } );
  $(document).on("mousedown", function (event) { mouseDown(event) } );
  $(document).keyup(function (event) { keyUp(event) } );
};
