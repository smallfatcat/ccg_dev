// Main program

// Crowd Control Game
// Authored by David Imrie
// January 2015

// Reference files

/// <reference path="classes.ts" />
/// <reference path="render.ts" />
/// <reference path="physics.ts" />
/// <reference path="jquery.d.ts" />

// Constants
var PHYSICS_TICK: number = 15;
var PHYSICS_GRAVITY: number = 0;
var PHYSICS_FRICTION: number = 1;
var PHYSICS_MAXRUN: number = 20;
var PHYSICS_MAXACC: number = 2000;
var PHYSICS_MINDIST: number = 2;
var MAX_BALLS: number = 50;
var ELASTICITY_NORMAL: number = 1;
//var GRAVITY_CONSTANT: number = 0.0000000000667384;
var GRAVITY_CONSTANT: number = 0.06;
var MASS_PLAYER: number = 0.01;
var MAX_WIDTH: number = 800;
var MAX_HEIGHT: number = 800;
var INDENT: number = 100;


// Global Arrays
var gEntities: Player[] = [];
var gBombs: Bomb[] = [];
var gCollisions: Collision[] = [];

// Global objects
var g_pointer: Entity;
var g_playArea: PlayArea;
var gStats: Stats;
var gInfoWindow: InfoWindow;

// Flags
var gPause: boolean = false;
var gPause_released: boolean = true;
var gPlayAreaCanvasCreated: boolean = false;
var gApproachTimerFlag: boolean = false;
var gReset: boolean = false;


// Set up pointer
g_pointer = new Entity({ id: 0, pos: { x: 0, y: 0 }, iconID: 2, name: 'Pointer' });

// Set up playing area canvas
g_playArea = new PlayArea({ pos: {x: 0, y: 0 }, width: 800, height: 800, containerID: 'playAreaCanvas' });

// Initialize
init();

function init() {
  // Set up stats
  var d = new Date();
  gStats = new Stats({ startTime: d.getTime() });
  gEntities = [];
  // Set up some test objects
  for (var i = 0; i < MAX_BALLS; i++) {
    var ball: Player = new Player({ id: i, pos: { x: (Math.random() * (MAX_WIDTH - (INDENT * 2))) + INDENT, y: (Math.random() * (MAX_HEIGHT - (INDENT * 2))) + INDENT }, iconID: 1, name: String(i), mass: MASS_PLAYER, collisionRadius: 16 });
    if (i < MAX_BALLS / 2) {
      ball.team = 1;
    }
    gEntities.push(ball);
  }
  makeAllThingsApproachEnemies();
  setTimeout(setApproachTimerFlag, 1000);
}

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
