// Physics and game logic
// Main physics loop
function physics() {
    // Check if game is paused
    if (!gPause) {
        // Check for end of game
        if (gStats.playersMoving == 0) {
            if (!gReset) {
                gReset = true;
                setTimeout(reset, 1000);
            }
        }
        calcPlayerPhysics();
        calcBombPhysics();
        if (gApproachTimerFlag) {
            //makeAllThingsApproachEnemies();
            //gApproachTimerFlag = false;
            //setTimeout(setApproachTimerFlag, 1000);
        }
    }

    // Call the physics loop again in PHYSICS_TICK milliseconds
    setTimeout(physics, PHYSICS_TICK);

    // Render Scene
    //render();
    renderPlayAreaPixi();

    // Modify Stats
    updateStats();
}

function calcPlayerPhysics() {
    for (var i = 0; i < MAX_PLAYERS; i++) {
        if (gPlayers[i].isAlive) {
            // Do physics for all test objects
            physicsPlayer(gPlayers[i]);
        }
    }
    /*
    // calculate collisions and store them in global array
    gCollisions = doCollisionChecks();
    
    // Iterate through collisions array
    for (var i: number = 0; i < gCollisions.length; i++) {
    // If entity is in fight mode, check fight priority
    var source: Player = gPlayers[gCollisions[i].sourceID];
    var target: Player = gPlayers[gCollisions[i].targetID];
    setFighting(source, target);
    }
    
    // Perform Fights
    performFights();
    */
}

// Do physics for player object
function physicsPlayer(player) {
    // Equations
    // v^2 = u^2 + 2as // s = u*t + 0.5 * a * t^2 // v = u + a*t
    // t is the time elapsed in this tick
    var t = PHYSICS_TICK / 1000;

    // u is the initial velocity, v final velocity, start is the initial coords, end is the final coords
    // Set initial velocity
    var u = player.vel;

    // calculate final velocity
    var v = calcVelocity(u, player.acc, t);

    // Set initital coords
    var start = player.pos;

    // Calculate final coords
    var end = calcFinalCoords(start, u, player.acc, t);

    // Store new values
    player.pos = end;
    player.vel = v;

    // if there is no velocity to establish a direction
    if (!(player.vel.x == 0) && !(player.vel.y == 0)) {
        // Calculate new direction angle
        var rotRadians = Math.atan2(player.vel.y, player.vel.x);
        player.rotDegrees = ((rotRadians / (Math.PI * 2)) * 360) + 90;
    }

    // Reset distance info
    var zeroAcc = new Vector2D({ x: 0, y: 0 });
    player.acc = zeroAcc;
    player.distances = [];

    // If player is moving then navigate
    if (player.isMoving) {
        navigatePlayer(player);
    }

    if (player.history.length == 0) {
        var historyPos = new Vector2D({ x: player.pos.x, y: player.pos.y });
        player.history.push(historyPos);
    }

    if (gStats.frameCounter % (Math.round(1 / t / 10)) == 0) {
        var historyPos = new Vector2D({ x: player.pos.x, y: player.pos.y });
        if (player.pos.x != player.history[player.history.length - 1].x && player.pos.y != player.history[player.history.length - 1].y) {
            player.history.push(historyPos);
        }
    }
}
//# sourceMappingURL=physics.js.map
