// Physics and game logic

// Main physics loop
function physics() {
  // Check if game is paused
  if (!gPause) {
    // Check for end of game
    if (gStats.playersMoving == 0 ) {
      if(!gReset) {
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
  renderPlayArea();

  // Modify Stats
  updateStats();

}

function calcPlayerPhysics() {
  // Loop through all test objects
  for (var i = 0; i < MAX_PLAYERS; i++) {
    if (gEntities[i].isAlive) {
      // Do physics for all test objects 
      physicsPlayer(gEntities[i]);
    }
  }
  /*
  // calculate collisions and store them in global array
  gCollisions = doCollisionChecks();

  // Iterate through collisions array
  for (var i: number = 0; i < gCollisions.length; i++) {
    // If entity is in fight mode, check fight priority
    var source: Player = gEntities[gCollisions[i].sourceID];
    var target: Player = gEntities[gCollisions[i].targetID];
    setFighting(source, target);
  }

  // Perform Fights
  performFights();
*/
}

// Do physics for player object
function physicsPlayer(player: Player) {
  // Equations
  // v^2 = u^2 + 2as // s = u*t + 0.5 * a * t^2 // v = u + a*t

  // t is the time elapsed in this tick
  var t: number = PHYSICS_TICK / 1000;

  // u is the initial velocity, v final velocity, start is the initial coords, end is the final coords
  // Set initial velocity
  var u: Vector2D = player.vel;
  // calculate final velocity
  var v: Vector2D = calcVelocity(u, player.acc, t);
  // Set initital coords 
  var start: Vector2D = player.pos;
  // Calculate final coords
  var end: Vector2D = calcFinalCoords(start, u, player.acc, t);

  // Store new values
  player.pos = end;
  player.vel = v;

  // if there is no velocity to establish a direction
  if (!(player.vel.x == 0) && !(player.vel.y == 0)) {
    // Calculate new direction angle
    var rotRadians: number = Math.atan2(player.vel.y, player.vel.x);
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
}

