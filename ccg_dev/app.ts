// Main program

// Crowd Control Game
// Authored by David Imrie
// January 2015

// Reference files

/// <reference path="classes.ts" />
/// <reference path="render.ts" />
/// <reference path="physics.ts" />
/// <reference path="jquery.d.ts" />

// Variables
var PHYSICS_TICK: number = 15;
var PHYSICS_GRAVITY: number = 0;
var PHYSICS_FRICTION: number = 1;
var PHYSICS_MAXRUN: number = 2;
var MAX_BALLS: number = 50;
var ELASTICITY_NORMAL: number = 1;
//var GRAVITY_CONSTANT: number = 0.0000000000667384;
var GRAVITY_CONSTANT: number = 6;
var MASS_PLAYER: number = 100;

var MAX_WIDTH: number = 800;
var MAX_HEIGHT: number = 800;

var g_entities = [];
var g_bombs = [];
var g_pause: boolean = false;
var g_pause_released: boolean = true;
var g_playAreaCanvasCreated: boolean = false;

// Set up stats
// get starting time
var d = new Date();
var g_stats: Stats = new Stats( { startTime: d.getTime() } );

// Set up some test objects
for (var i = 0; i < MAX_BALLS; i++) {
  var ball: Player = new Player({ id: i, xPos: (Math.random() * MAX_WIDTH) + 20, yPos: (Math.random() * MAX_HEIGHT) - 20, iconID: 1, name: String(i), mass: MASS_PLAYER });
  ball.xVel = (Math.random() * PHYSICS_MAXRUN) - (PHYSICS_MAXRUN/2);
  ball.yVel = (Math.random() * PHYSICS_MAXRUN) - (PHYSICS_MAXRUN/2);
  ball.rotDegrees = (Math.random() * 360);
  g_entities.push(ball);
}

// Set up pointer
var g_pointer: Entity = new Entity({ id: i, xPos: 0, yPos: 0, iconID: 2, name: 'Pointer' });

// Set up playing area canvas
var g_playArea: PlayArea = new PlayArea({ xPos: 0, yPos: 0, width: 800, height: 800, containerID: 'playAreaCanvas' });

// On window loaded run main program
window.onload = () => {
  // Set up event listeners for keyboard and mouse
  $(document).on("keydown", function (event) { keyDown(event) });
  $(document).on("mousedown", function (event) { mouseDown(event) });
  $(document).keyup(function (event) { keyUp(event) });



  // Render scene
  //render();
  renderPlayArea();
  // Start physics processing
  setTimeout(physics, PHYSICS_TICK);
};
