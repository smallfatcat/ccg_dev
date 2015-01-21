// Main program
// Crowd Control Game
// Authored by David Imrie
// January 2015
// Reference files
/// <reference path="scripts/typings/pixi/pixi.d.ts" />
/// <reference path="classes.ts" />
/// <reference path="player_class.ts" />
/// <reference path="render.ts" />
/// <reference path="physics.ts" />
/// <reference path="ai.ts" />
/// <reference path="util.ts" />
/// <reference path="navigation.ts" />
/// <reference path="legacy.ts" />
/// <reference path="jquery.d.ts" />
// Constants
var PHYSICS_TICK = 16;
var PHYSICS_GRAVITY = 0;
var PHYSICS_FRICTION = 1;
var PHYSICS_MAXSPEED = 100;
var PHYSICS_MAXACC = 2000;
var PHYSICS_MINDIST = 2;
var MAX_TURN = 5;
var DETECT_RADIUS = 4;

var MAX_PLAYERS = 200;
var TEAM_A_PLAYERS = 100;
var TEAM_B_PLAYERS = 100;

var ELASTICITY_NORMAL = 1;

//var GRAVITY_CONSTANT: number = 0.0000000000667384;
var GRAVITY_CONSTANT = 0.06;
var MASS_PLAYER = 0.01;
var MAX_WIDTH = 800;
var MAX_HEIGHT = 800;
var INDENT = 100;

// Global Arrays
var gPlayers = [];
var gBombs = [];
var gCollisions = [];

// Global objects
var gPointer;
var gPlayArea;
var gStats;
var gInfoWindow;
var gSelectedPlayerIDs = [];

var gSprites = [];
var textures = [];
var stage;
var renderer;
var gfxObject;
var loader;

var gPlayerAnimationSequence = [0, 1, 0, 2];
var gPlayerAnimationIndex = 0;

// Flags
var gPause = false;
var gPause_released = true;
var gPlayAreaCanvasCreated = false;
var gApproachTimerFlag = false;
var gReset = false;

// Set up pointer
var pointerPos = new Vector2D({ x: 0, y: 0 });
gPointer = new Pointer({ id: 0, pos: pointerPos, mode: 'select' });

// Set up playing area canvas
var playAreaPos = new Vector2D({ x: 0, y: 0 });
gPlayArea = new PlayArea({ pos: playAreaPos, width: 800, height: 800, containerID: 'playAreaCanvas' });

// Initialize
init();

function init() {
    // Set up stats
    var d = new Date();
    gStats = new Stats({ startTime: d.getTime() });
    gPlayers = [];

    var posList = createNonCollidingVectors(MAX_PLAYERS, INDENT, MAX_WIDTH - INDENT, ((DETECT_RADIUS * 2) + 32));

    //var destList: Vector2D[] = createNonCollidingVectors(MAX_PLAYERS, INDENT, MAX_WIDTH - INDENT, ((DETECT_RADIUS * 2) + 32));
    //var posList: Vector2D[] = createGrid(20, 400, 100, ((DETECT_RADIUS * 2) + 16), 5);
    //posList = posList.concat(createGrid(20, 100, 100, ((DETECT_RADIUS * 2) + 16), 5));
    var destList = createGrid(50, 100, 100, ((DETECT_RADIUS * 2) + 16), 5);
    destList = destList.concat(createGrid(50, 400, 100, ((DETECT_RADIUS * 2) + 16), 5));

    for (var i = 0; i < MAX_PLAYERS; i++) {
        var player = new Player({
            id: i,
            pos: posList[i],
            iconID: 1,
            name: String(i),
            mass: MASS_PLAYER,
            collisionRadius: 8,
            health: 100,
            damage: 1,
            attackChance: 10,
            team: 0
        });
        if (i < TEAM_A_PLAYERS) {
            player.team = 1;
            player.damage = 1;
            //player.collisionRadius = 32;
        }
        var pointVector = new Vector2D({ x: (Math.random() * (MAX_WIDTH - (INDENT * 2))) + INDENT, y: (Math.random() * (MAX_HEIGHT - (INDENT * 2))) + INDENT });
        player.pointAt(pointVector);
        player.moveForward();

        //player.destination = {x: 400, y: 400};
        player.destination = destList[i];

        //player.destination = { x: (Math.random() * (MAX_WIDTH - (INDENT * 2))) + INDENT, y: (Math.random() * (MAX_HEIGHT - (INDENT * 2))) + INDENT };
        //player.destination = { x: (i < (MAX_PLAYERS / 2) ? ((i*64) + 100) : ((i-(MAX_PLAYERS/2))*64)+100), y: ((i < MAX_PLAYERS/2) ? 200 : 600) };
        player.isMoving = true;
        gStats.playersMoving++;
        gPlayers.push(player);
    }
    /*
    gPlayers[0].pos = { x: 200, y: 400 };
    gPlayers[0].pointAt({ x: 600, y: 400 });
    gPlayers[0].moveForward();
    gPlayers[0].destination = { x: 600, y: 400 };
    
    gPlayers[1].pos = { x: 600, y: 400 };
    gPlayers[1].pointAt({ x: 200, y: 400 });
    gPlayers[1].moveForward();
    gPlayers[1].destination = { x: 200, y: 400 };
    
    gPlayers[2].pos = { x: 400, y: 200 };
    gPlayers[2].pointAt({ x: 400, y: 600 });
    gPlayers[2].moveForward();
    gPlayers[2].destination = { x: 400, y: 600 };
    
    
    gPlayers[3].pos = { x: 400, y: 600 };
    gPlayers[3].pointAt({ x: 400, y: 200 });
    gPlayers[3].moveForward();
    gPlayers[3].destination = { x: 400, y: 200 };
    
    gPlayers[4].pos = { x: 600, y: 600 };
    gPlayers[4].pointAt({ x: 400, y: 200 });
    gPlayers[4].moveForward();
    gPlayers[4].destination = { x: 600, y: 600 };
    */
    //makeAllThingsApproachEnemies();
    //setTimeout(setApproachTimerFlag, 1000);
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
    renderPlayAreaPixi();

    // Start physics processing
    setTimeout(physics, PHYSICS_TICK);
};

function createNonCollidingVectors(n, min, max, spacing) {
    var vectorList = [];
    for (var i = 0; i < n; i++) {
        var candidateV = genRandomVector(min, max);
        var loopCount = 0;
        while (!checkIfSpaced(vectorList, spacing, candidateV) && loopCount < 1000) {
            candidateV = genRandomVector(min, max);
            loopCount++;
        }
        vectorList.push(candidateV);
    }

    return vectorList;
}

function createGrid(x, y, n, spacing, rows) {
    var vectorList = [];
    var rowLength = Math.ceil(n / rows);
    for (var row = 0; row < rows; row++) {
        for (var i = 0; i < rowLength; i++) {
            var newVector = new Vector2D({ x: 0, y: 0 });
            newVector.x = x + (i * spacing);
            newVector.y = y + (row * spacing);
            vectorList.push(newVector);
            if (vectorList.length == n) {
                return vectorList;
            }
        }
    }

    return vectorList;
}

function genRandomVector(min, max) {
    var v = new Vector2D({ x: randRange(min, max), y: randRange(min, max) });
    return v;
}

function randRange(min, max) {
    var rand = (Math.random() * (max - min)) + min;
    return rand;
}

function checkIfSpaced(vectorList, spacing, checkVector) {
    var isSpaced = true;
    for (var i = 0; i < vectorList.length; i++) {
        if (getDistance(checkVector, vectorList[i]) < spacing) {
            isSpaced = false;
            return isSpaced;
        }
    }
    return isSpaced;
}
//# sourceMappingURL=app.js.map
