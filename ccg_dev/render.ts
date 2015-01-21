﻿// Rendering Functions

function renderPlayAreaPixi() {
  if (!gPlayAreaCanvasCreated) {
    // create an array of assets to load
    var assetsToLoader = ["spritesheet.json"];

    // create a new loader
    loader = new PIXI.AssetLoader(assetsToLoader);

    // use callback
    loader.onComplete = onAssetsLoaded

	  //begin load
	  loader.load();
    
    // create an new instance of a pixi stage
    stage = new PIXI.Stage(0xFFFFFF);

    // create a renderer instance.
    renderer = PIXI.autoDetectRenderer(800, 800);

    // add the renderer view element to the DOM

    $('#content').empty();
    $('#content').append(renderer.view);

    
    var html: string = '';
    var infoWindowPos: Vector2D = new Vector2D({ x: 800, y: 0 });
    gInfoWindow = new InfoWindow({ pos: infoWindowPos, visible: true });
    html += '<div id="infowindow" class="infowindow" style="left: ' + gInfoWindow.pos.x + 'px; top: ' + gInfoWindow.pos.y + 'px;"><div id="IWmain"></div><div id="IWsub"></div></div > ';
    // write scene to html
    $('#content').append(html);
    gPlayAreaCanvasCreated = true;

    // create a texture from an image path
    textures[0] = PIXI.Texture.fromImage("man_red.png");
    textures[1] = PIXI.Texture.fromImage("man_green.png");
    textures[2] = PIXI.Texture.fromImage("level_1.png");

    var levelSprite = new PIXI.Sprite(textures[2]);
    // center the sprites anchor point
    levelSprite.anchor.x = 0.5;
    levelSprite.anchor.y = 0.5;

    // move the sprite t the center of the screen
    levelSprite.position.x = 400;
    levelSprite.position.y = 400;
    stage.addChild(levelSprite);

    gfxObject = new PIXI.Graphics();
    stage.addChild(gfxObject);

    /*
    var container = new PIXI.SpriteBatch();
    stage.addChild(container);
    
    for (var i = 0; i < MAX_PLAYERS; i++) {
      // create a new Sprite using the texture
      var sprite = new PIXI.Sprite(textures[gPlayers[i].team]);

      // center the sprites anchor point
      sprite.anchor.x = 0.5;
      sprite.anchor.y = 0.5;

      // move the sprite t the center of the screen
      sprite.position.x = gPlayers[i].pos.x;
      sprite.position.y = gPlayers[i].pos.y;

      container.addChild(sprite);
      gSprites.push(sprite);
    }
    */
  }

  // Show or hide infoWindow
  if (gInfoWindow.visible && !gInfoWindow.currentVisibility) {
    $('#infowindow').show();
    gInfoWindow.currentVisibility = true;
  }
  if (!gInfoWindow.visible && gInfoWindow.currentVisibility) {
    $('#infowindow').hide();
    gInfoWindow.currentVisibility = false;
  }

  updateInfoWindow();

  requestAnimFrame(animate);


}

function animate() {
  gfxObject.clear();
  //requestAnimationFrame(animate);
  var nextFrameID = nextFrame();
  if (gSprites.length > 0) {
    for (var i = 0; i < MAX_PLAYERS; i++) {
      gSprites[i].position.x = gPlayers[i].pos.x;
      gSprites[i].position.y = gPlayers[i].pos.y;
      var angleToDest = gPlayers[i].pos.getAngleTo(gPlayers[i].destination) + (Math.PI / 2);
      gSprites[i].rotation = angleToDest;
      gfxObject.lineStyle(2, 0x000000, 1);
      if (!gPause) {
        if (gPlayers[i].isMoving) {
          gSprites[i].gotoAndStop(nextFrameID);
          gfxObject.drawCircle(gPlayers[i].destination.x, gPlayers[i].destination.y, gPlayers[i].collisionRadius);
        }
        else {
          gSprites[i].gotoAndStop(0);
        }
      }
      else {
        gSprites[i].stop();
      }

      if (gPlayers[i].isSelected) {
        gfxObject.drawRect(gPlayers[i].pos.x - gPlayers[i].collisionRadius - 2, gPlayers[i].pos.y - gPlayers[i].collisionRadius - 2, (gPlayers[i].collisionRadius * 2) + 4, (gPlayers[i].collisionRadius * 2) + 4);
      }
      /*
      gfxObject.lineStyle(2, 0x000044, 0.2);
      for (var j = 1; j < gPlayers[i].history.length; j++) {
        if (j == 1) {
          gfxObject.moveTo(gPlayers[i].history[0].x, gPlayers[i].history[0].y);
        }
        gfxObject.lineTo(gPlayers[i].history[j].x, gPlayers[i].history[j].y);
      }
      */
    }
  }
  // Draw selection box
  if (gPointer.mode == 'drag') {
    gfxObject.drawRect(gPointer.startDrag.x, gPointer.startDrag.y, gPointer.endDrag.x - gPointer.startDrag.x, gPointer.endDrag.y - gPointer.startDrag.y);
  }

  // render the stage   
  renderer.render(stage);
}

function onAssetsLoaded() {
  // create an array to store the textures
  var animationTextures = [];

  for (var i = 0; i < 3; i++) {
    var texture = PIXI.Texture.fromFrame(String(i));
    animationTextures.push(texture);
  };

  // create a texture from an image path

  for (var i = 0; i < gPlayers.length; i++) {
    // create a MovieClip
    var playerAnimation = new PIXI.MovieClip(animationTextures);


    playerAnimation.position.x = gPlayers[i].pos.x;
    playerAnimation.position.y = gPlayers[i].pos.y;
    playerAnimation.anchor.x = 0.5;
    playerAnimation.anchor.y = 0.5;

    var angleToDest = gPlayers[i].pos.getAngleTo(gPlayers[i].destination);

    playerAnimation.rotation = angleToDest;
    //playerAnimation.scale.x = playerAnimation.scale.y = 0.75 + Math.random() * 0.5
    playerAnimation.animationSpeed = 0.1;
    playerAnimation.gotoAndStop(0);

    stage.addChild(playerAnimation);
    gSprites.push(playerAnimation);
  }

  // start animating
  requestAnimFrame(animate);


}

function renderPlayArea() {
  // If this is the first time, create the canvas and write it to the page
  if (!gPlayAreaCanvasCreated) {
    $('#content').empty();
    var html: string = gPlayArea.generateHtml();
    var infoWindowPos: Vector2D = new Vector2D({ x: 800, y: 0 });
    gInfoWindow = new InfoWindow({ pos: infoWindowPos, visible: true});
    html += '<div id="infowindow" class="infowindow" style="left: ' + gInfoWindow.pos.x + 'px; top: ' + gInfoWindow.pos.y + 'px;"><div id="IWmain"></div><div id="IWsub"></div></div > ';
    // write scene to html
    $('#content').append(html);
    gPlayAreaCanvasCreated = true;
  }

  // Show or hide infoWindow
  if (gInfoWindow.visible && !gInfoWindow.currentVisibility) {
    $('#infowindow').show();
    gInfoWindow.currentVisibility = true;
  }
  if (!gInfoWindow.visible && gInfoWindow.currentVisibility) {
    $('#infowindow').hide();
    gInfoWindow.currentVisibility = false;
  }

  updateInfoWindow();

  // Use canvas

  var c = <HTMLCanvasElement> document.getElementById(gPlayArea.containerID);
  var ctx = c.getContext("2d");

  // Clear the Play Area Canvas
  ctx.clearRect(0, 0, gPlayArea.width, gPlayArea.height);

  // Each Alive entity
  for (var i = 0; i < MAX_PLAYERS; i++) {
    if (gPlayers[i].isAlive) {
      //drawFilledCircle(ctx, gPlayers[i].pos.x, gPlayers[i].pos.y, gPlayers[i].collisionRadius, gPlayers[i].team == 0 ? 'red' : 'blue');
      //drawCircle(ctx, gPlayers[i].destination.x, gPlayers[i].destination.y, gPlayers[i].collisionRadius);
      drawImage(ctx, gPlayers[i].pos.x, gPlayers[i].pos.y, gPlayers[i].rotDegrees, 16, gPlayers[i].team == 0 ? 'man_red':'man_green');
      if (gPlayers[i].isFighting) {
        drawFilledRectangle(ctx, gPlayers[i].pos.x - 12, gPlayers[i].pos.y - 24, (24 / 100) * gPlayers[i].health, 4, 'yellow');
      }
      if (gPlayers[i].isSelected) {
        drawRectangle(ctx, gPlayers[i].pos.x - gPlayers[i].collisionRadius - 2, gPlayers[i].pos.y - gPlayers[i].collisionRadius - 2, (gPlayers[i].collisionRadius*2) + 4, (gPlayers[i].collisionRadius*2) + 4);
      }
    }
    else {
      drawFilledCircle(ctx, gPlayers[i].pos.x, gPlayers[i].pos.y, 5, gPlayers[i].team == 0 ? 'red' : 'blue');
    }
  }

  // Draw selection box
  if (gPointer.mode == 'drag') {
    drawRectangle(ctx, gPointer.startDrag.x, gPointer.startDrag.y, gPointer.endDrag.x - gPointer.startDrag.x, gPointer.endDrag.y - gPointer.startDrag.y);
  }

  // Each Bomb
  for (i = 0; i < gBombs.length; i++) {
    if (gBombs[i].isAlive) {
      drawFilledCircle(ctx, gBombs[i].pos.x, gBombs[i].pos.y, gBombs[i].radius, 'red');
    }
  }

}

function updateInfoWindow() {
  var html: string = '';
  html += 'startTime: ' + gStats.startTime;
  html += '<br>frameCounter: ' + gStats.frameCounter;
  html += '<br>currentTime: ' + gStats.currentTime;
  html += '<br>fps: ' + gStats.fps;
  html += '<br>lastFrameTime: ' + gStats.lastFrameTime;
  //html += '<br>kills: ' + gStats.kills;
  //html += '<br>teamKillsA: ' + gStats.teamKillsA;
  //html += '<br>teamKillsB: ' + gStats.teamKillsB;
  html += '<br>playersAlive: ' + gStats.playersAlive;
  //html += '<br>bombsUsed: ' + gStats.bombsUsed;
  html += '<br>playersMoving: ' + gStats.playersMoving;
  html += '<br>playersSelected: ' + gSelectedPlayerIDs.length;
  if (gPause) {
    html += '<br><br>GAME PAUSED';
  }
  if (gReset) {
    html += '<br><br>Reset in ' + gStats.resetCountdown + (gStats.resetCountdown == 1 ? ' second':' seconds');
  }
  var htmlSub: string = '<input type="button" id="resetBut" value="Reset"></input>';

  $('#IWmain').empty();
  $('#IWmain').append(html);
  $('#IWsub').empty();
  $('#IWsub').append(htmlSub);
  $('#resetBut').mousedown(function () {
    init();
  });
}


function drawFilledCircle(ctx, x: number, y: number, radius: number, color: string) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
}

function drawCircle(ctx, x: number, y: number, radius: number) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();
}

function drawRectangle(ctx, x: number, y: number, width: number, height: number) {
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';
  ctx.stroke();
}

function drawFilledRectangle(ctx, x: number, y: number, width: number, height: number, color: string) {
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';
  ctx.stroke();
}

function drawImage(ctx, x: number, y: number, a: number, width: number, imgID: string) {
  var image = document.getElementById(imgID);

  ctx.translate(x, y);
  ctx.rotate(a * Math.PI / 180);
  //ctx.fillRect(-50, -50, 100, 100);
  ctx.drawImage(image, width / -2, width / -2);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function nextFrame() {

  if(gStats.frameCounter%10 == 0) {
    gPlayerAnimationIndex++;
    if (gPlayerAnimationIndex > 4) {
      gPlayerAnimationIndex = 0;
    }
  }
  return gPlayerAnimationSequence[gPlayerAnimationIndex];
}