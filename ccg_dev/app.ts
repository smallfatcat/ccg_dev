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
var MAX_TURN: number = 5;
var DETECT_RADIUS: number = 8;

var MAX_PLAYERS: number = 20;
var TEAM_A_PLAYERS: number = 10;
var TEAM_B_PLAYERS: number = 10;

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
  // Set up some players
  for (var i = 0; i < MAX_PLAYERS; i++) {
    var player: Player = new Player({
      id: i,
      pos: { x: (Math.random() * (MAX_WIDTH - (INDENT * 2))) + INDENT, y: (Math.random() * (MAX_HEIGHT - (INDENT * 2))) + INDENT },
      iconID: 1,
      name: String(i),
      mass: MASS_PLAYER,
      collisionRadius: 16,
      health: 100,
      damage: 1,
      attackChance: 10,
      team: 0
    });
    if (i < TEAM_A_PLAYERS) {
      player.team = 1;
      player.damage = 1;
    }
    player.pointAt({ x: (Math.random() * (MAX_WIDTH - (INDENT * 2))) + INDENT, y: (Math.random() * (MAX_HEIGHT - (INDENT * 2))) + INDENT });
    player.moveForward();
    //player.destination = { x: (Math.random() * (MAX_WIDTH - (INDENT * 2))) + INDENT, y: (Math.random() * (MAX_HEIGHT - (INDENT * 2))) + INDENT };
    player.destination = { x: (i < (MAX_PLAYERS / 2) ? ((i*64) + 100) : ((i-(MAX_PLAYERS/2))*64)+100), y: ((i < MAX_PLAYERS/2) ? 200 : 600) };
    gEntities.push(player);
  }
  
  /*
  gEntities[0].pos = { x: 200, y: 400 };
  gEntities[0].pointAt({ x: 600, y: 400 });
  gEntities[0].moveForward();
  gEntities[0].destination = { x: 600, y: 400 };

  gEntities[1].pos = { x: 600, y: 400 };
  gEntities[1].pointAt({ x: 200, y: 400 });
  gEntities[1].moveForward();
  gEntities[1].destination = { x: 200, y: 400 };

  gEntities[2].pos = { x: 400, y: 200 };
  gEntities[2].pointAt({ x: 400, y: 600 });
  gEntities[2].moveForward();
  gEntities[2].destination = { x: 400, y: 600 };
  

  gEntities[3].pos = { x: 400, y: 600 };
  gEntities[3].pointAt({ x: 400, y: 200 });
  gEntities[3].moveForward();
  gEntities[3].destination = { x: 400, y: 200 };

  gEntities[4].pos = { x: 600, y: 600 };
  gEntities[4].pointAt({ x: 400, y: 200 });
  gEntities[4].moveForward();
  gEntities[4].destination = { x: 600, y: 600 };
  */


  //makeAllThingsApproachEnemies();
  //setTimeout(setApproachTimerFlag, 1000);
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
