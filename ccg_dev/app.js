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
var PHYSICS_MAXRUN = 50;
var PHYSICS_MAXACC = 2000;
var PHYSICS_MINDIST = 2;
var MAX_BALLS = 250;
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

// Flags
var gPause = false;
var gPause_released = true;
var gPlayAreaCanvasCreated = false;
var gApproachTimerFlag = false;

// Set up stats
// get starting time
var d = new Date();
var gStats = new Stats({ startTime: d.getTime() });

for (var i = 0; i < MAX_BALLS; i++) {
    var ball = new Player({ id: i, pos: { x: (Math.random() * (MAX_WIDTH - (INDENT * 2))) + INDENT, y: (Math.random() * (MAX_HEIGHT - (INDENT * 2))) + INDENT }, iconID: 1, name: String(i), mass: MASS_PLAYER, collisionRadius: 16 });

    //ball.vel.x = (Math.random() * PHYSICS_MAXRUN) - (PHYSICS_MAXRUN/2);
    //ball.vel.y = (Math.random() * PHYSICS_MAXRUN) - (PHYSICS_MAXRUN / 2);
    //ball.mass = (Math.random() * 100) + 100;
    if (i < MAX_BALLS / 2) {
        ball.team = 1;
    }

    gEntities.push(ball);
}
makeAllThingsApproachEnemies();
setTimeout(setApproachTimerFlag, 1000);

/*
gEntities[0].pos = { x: 400, y: 400 };
gEntities[0].vel = { x: 0, y: 0 };
gEntities[0].mass = 4000000;
gEntities[0].collisionRadius = 16;
gEntities[1].pos = { x: 400, y: 457 };
gEntities[1].vel = { x: 64.88856, y: 0 };
gEntities[1].mass = 0.3;
gEntities[1].collisionRadius = 16;
gEntities[2].pos = { x: 400, y: 507 };
gEntities[2].vel = { x: 47.36, y: 0 };
gEntities[2].mass = 10;
gEntities[2].collisionRadius = 16;
gEntities[3].pos = { x: 400, y: 549 };
gEntities[3].vel = { x: 40.13, y: 0 };
gEntities[3].mass = 12;
gEntities[3].collisionRadius = 16;
gEntities[4].pos = { x: 400, y: 626 };
gEntities[4].vel = { x: 32.58, y: 0 };
gEntities[4].mass = 0.6;
gEntities[4].collisionRadius = 16;
*/
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
