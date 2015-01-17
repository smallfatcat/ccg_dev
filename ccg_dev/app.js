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
var PHYSICS_MAXACC = 2000;
var PHYSICS_MINDIST = 2;
var MAX_BALLS = 50;
var ELASTICITY_NORMAL = 1;

//var GRAVITY_CONSTANT: number = 0.0000000000667384;
var GRAVITY_CONSTANT = 0.06;
var MASS_PLAYER = 0.01;
var MAX_WIDTH = 800;
var MAX_HEIGHT = 800;
var INDENT = 100;

// Global Arrays
var gEntities = [];
var gBombs = [];
var gCollisions = [];

// Global objects
var g_pointer;
var g_playArea;
var gStats;
var gInfoWindow;

// Flags
var gPause = false;
var gPause_released = true;
var gPlayAreaCanvasCreated = false;
var gApproachTimerFlag = false;
var gReset = false;

// Set up pointer
g_pointer = new Entity({ id: 0, pos: { x: 0, y: 0 }, iconID: 2, name: 'Pointer' });

// Set up playing area canvas
g_playArea = new PlayArea({ pos: { x: 0, y: 0 }, width: 800, height: 800, containerID: 'playAreaCanvas' });

// Initialize
init();

function init() {
    // Set up stats
    var d = new Date();
    gStats = new Stats({ startTime: d.getTime() });
    gEntities = [];

    for (var i = 0; i < MAX_BALLS; i++) {
        var ball = new Player({ id: i, pos: { x: (Math.random() * (MAX_WIDTH - (INDENT * 2))) + INDENT, y: (Math.random() * (MAX_HEIGHT - (INDENT * 2))) + INDENT }, iconID: 1, name: String(i), mass: MASS_PLAYER, collisionRadius: 16 });
        if (i < MAX_BALLS / 2) {
            ball.team = 1;
        }
        gEntities.push(ball);
    }
    makeAllThingsApproachEnemies();
    setTimeout(setApproachTimerFlag, 1000);
}

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
