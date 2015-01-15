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
var PHYSICS_TICK = 15;
var PHYSICS_GRAVITY = 0;
var PHYSICS_FRICTION = 1;
var PHYSICS_MAXRUN = 20;
var MAX_BALLS = 50;
var ELASTICITY_NORMAL = 1;

//var GRAVITY_CONSTANT: number = 0.0000000000667384;
var GRAVITY_CONSTANT = 6;
var MASS_PLAYER = 100;
var MAX_WIDTH = 800;
var MAX_HEIGHT = 800;

// Global Arrays
var gEntities = [];
var gBombs = [];

// Flags
var gPause = false;
var gPause_released = true;
var gPlayAreaCanvasCreated = false;

// Set up stats
// get starting time
var d = new Date();
var gStats = new Stats({ startTime: d.getTime() });

for (var i = 0; i < MAX_BALLS; i++) {
    var ball = new Player({ id: i, pos: { x: (Math.random() * MAX_WIDTH) + 20, y: (Math.random() * MAX_HEIGHT) - 20 }, iconID: 1, name: String(i), mass: MASS_PLAYER });

    ball.vel.x = (Math.random() * PHYSICS_MAXRUN) - (PHYSICS_MAXRUN / 2);
    ball.vel.y = (Math.random() * PHYSICS_MAXRUN) - (PHYSICS_MAXRUN / 2);
    ball.rotDegrees = (Math.random() * 360);
    gEntities.push(ball);
}

// Set up pointer
var g_pointer = new Entity({ id: i, pos: { x: 0, y: 0 }, iconID: 2, name: 'Pointer' });

// Set up playing area canvas
var g_playArea = new PlayArea({ pos: { x: 0, y: 0 }, width: 800, height: 800, containerID: 'playAreaCanvas' });

// On window loaded run main program
window.onload = function () {
    // Set up event listeners for keyboard and mouse
    $(document).on("keydown", function (event) {
        keyDown(event);
    });
    $(document).on("mousedown", function (event) {
        mouseDown(event);
    });
    $(document).keyup(function (event) {
        keyUp(event);
    });

    // Render scene
    //render();
    renderPlayArea();

    // Start physics processing
    setTimeout(physics, PHYSICS_TICK);
};
//# sourceMappingURL=app.js.map
