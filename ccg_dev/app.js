﻿// Main program
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
var MAX_BALLS = 500;
var ELASTICITY_NORMAL = 1;

//var GRAVITY_CONSTANT: number = 0.0000000000667384;
var GRAVITY_CONSTANT = 0.006;
var MASS_PLAYER = 0.1;
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
    var ball = new Player({ id: i, pos: { x: (Math.random() * MAX_WIDTH) + 20, y: (Math.random() * MAX_HEIGHT) - 20 }, iconID: 1, name: String(i), mass: MASS_PLAYER, collisionRadius: 2 });

    ball.vel.x = (Math.random() * PHYSICS_MAXRUN) - (PHYSICS_MAXRUN / 2);
    ball.vel.y = (Math.random() * PHYSICS_MAXRUN) - (PHYSICS_MAXRUN / 2);
    ball.rotDegrees = (Math.random() * 360);
    gEntities.push(ball);
}
gEntities[0].pos = { x: 400, y: 400 };
gEntities[0].vel = { x: 0, y: 0 };
gEntities[0].mass = 400000;
gEntities[0].collisionRadius = 10;

gEntities[1].pos = { x: 400, y: 420 };
gEntities[1].vel = { x: 50, y: 0 };
gEntities[1].mass = 1000;
gEntities[1].collisionRadius = 3;

gEntities[2].pos = { x: 400, y: 500 };
gEntities[2].vel = { x: 40, y: 0 };
gEntities[2].mass = 1000;
gEntities[2].collisionRadius = 3;

gEntities[3].pos = { x: 400, y: 700 };
gEntities[3].vel = { x: 50, y: 0 };
gEntities[3].mass = 10000;
gEntities[3].collisionRadius = 5;

gEntities[4].pos = { x: 400, y: 710 };
gEntities[4].vel = { x: 57.6, y: 0 };
gEntities[4].mass = 1000;
gEntities[4].collisionRadius = 3;

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
