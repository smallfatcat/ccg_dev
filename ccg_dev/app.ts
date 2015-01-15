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
var PHYSICS_TICK: number = 33;
var PHYSICS_GRAVITY: number = 0;
var PHYSICS_FRICTION: number = 1;
var PHYSICS_MAXRUN: number = 300;
var MAX_BALLS: number = 50;
var ELASTICITY_NORMAL: number = 1;

var g_entities = [];
var g_bombs = [];
var g_pause: boolean = false;
var g_pause_released: boolean = true;

// Set up some test objects
for (var i = 0; i < MAX_BALLS; i++) {
  var ball: Player = new Player({ id: i, xPos: Math.random() * 400, yPos: Math.random() * 700, iconID: 1, name: String(i) });
  ball.xVel = (Math.random() * PHYSICS_MAXRUN) - (PHYSICS_MAXRUN/2);
  ball.yVel = (Math.random() * PHYSICS_MAXRUN) - (PHYSICS_MAXRUN/2);
  ball.rotDegrees = (Math.random() * 360);
  g_entities.push(ball);
}

// Set up pointer
var g_pointer: Entity = new Entity({ id: i, xPos: 0, yPos: 0, iconID: 2, name: 'Pointer' });

// On window loaded run main program
window.onload = () => {
  // Set up event listeners for keyboard and mouse
  $(document).on("keydown", function (event) { keyDown(event) });
  $(document).on("mousedown", function (event) { mouseDown(event) });
  $(document).keyup(function (event) { keyUp(event) });
  
  // Render scene
  render();

  // Start physics processing
  setTimeout(physics, PHYSICS_TICK);
};
