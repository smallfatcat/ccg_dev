// Rendering Functions
function renderPlayAreaPixi() {
    if (!gPlayAreaCanvasCreated) {
        // create an array of assets to load
        var assetsToLoader = ["spritesheet.json", "explosion.json"];

        // create a new loader
        loader = new PIXI.AssetLoader(assetsToLoader);

        // use callback
        loader.onComplete = onAssetsLoaded;

        //begin load
        loader.load();

        // create an new instance of a pixi stage
        stage = new PIXI.Stage(0xFFFFFF);

        // create a renderer instance.
        renderer = PIXI.autoDetectRenderer(800, 800);

        // add the renderer view element to the DOM
        $('#content').empty();
        $('#content').append(renderer.view);

        var html = '';
        var infoWindowPos = new Vector2D({ x: 800, y: 0 });
        gInfoWindow = new InfoWindow({ pos: infoWindowPos, visible: true });
        html += '<div id="infowindow" class="infowindow" style="left: ' + gInfoWindow.pos.x + 'px; top: ' + gInfoWindow.pos.y + 'px;"><div id="IWmain"></div><div id="IWsub"></div></div > ';

        // write scene to html
        $('#content').append(html);
        gPlayAreaCanvasCreated = true;

        // create a texture from an image path
        textures[0] = PIXI.Texture.fromImage("level_1.png");
        textures[1] = PIXI.Texture.fromImage("police_car.png");

        // create a level sprite
        var levelSprite = new PIXI.Sprite(textures[0]);

        // center the sprites anchor point
        levelSprite.anchor.x = 0.5;
        levelSprite.anchor.y = 0.5;

        // move the level sprite to the center of the screen
        levelSprite.position.x = 400;
        levelSprite.position.y = 400;
        stage.addChild(levelSprite);

        // create a new gfx object
        gfxObject = new PIXI.Graphics();
        stage.addChild(gfxObject);

        // create a new car using the texture
        var car = new PIXI.Sprite(textures[1]);

        // center the cars anchor point
        car.anchor.x = 0.5;
        car.anchor.y = 0.5;

        // move the car sprite to the center of the screen
        car.position.x = 500;
        car.position.y = 300;
        car.rotation = Math.PI / 4;
        gCar = car;
        stage.addChild(car);
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
    if (!gPause) {
        gExplosions[0].play();
        if (gExplosions[0].currentFrame == gExplosions[0].textures.length - 1) {
            gExplosions[0].position.x = Math.random() * 800;
            gExplosions[0].position.y = Math.random() * 800;
            gExplosions[0].rotation = Math.random() * Math.PI * 2;
        }
    } else {
        gExplosions[0].stop();
    }
    if (gSprites.length > 0) {
        for (var i = 0; i < gSprites.length; i++) {
            gSprites[i].position.x = gPlayers[i].pos.x;
            gSprites[i].position.y = gPlayers[i].pos.y;
            var angleToDest = gPlayers[i].pos.getAngleTo(gPlayers[i].destination) + (Math.PI / 2);
            gSprites[i].rotation = angleToDest;
            gfxObject.lineStyle(2, 0x000000, 0.2);
            if (!gPause) {
                if (gPlayers[i].isMoving) {
                    gSprites[i].gotoAndStop(nextFrameID);
                    if (gNavHUD) {
                        gfxObject.drawCircle(gPlayers[i].destination.x, gPlayers[i].destination.y, gPlayers[i].collisionRadius);
                    }
                } else {
                    gSprites[i].gotoAndStop(0);
                }
            } else {
                gSprites[i].stop();
            }

            if (gPlayers[i].isSelected) {
                gfxObject.drawRect(gPlayers[i].pos.x - gPlayers[i].collisionRadius - 2, gPlayers[i].pos.y - gPlayers[i].collisionRadius - 2, (gPlayers[i].collisionRadius * 2) + 4, (gPlayers[i].collisionRadius * 2) + 4);
            }

            if (gNavHUD) {
                if (gPlayers[i].waypoints.length > 0) {
                    gfxObject.lineStyle(4, 0x0000FF, 0.2);
                    gfxObject.moveTo(gPlayers[i].pos.x, gPlayers[i].pos.y);
                    for (var j = gPlayers[i].waypoints.length - 1; j > -1; j--) {
                        gfxObject.lineTo(gPlayers[i].waypoints[j].x, gPlayers[i].waypoints[j].y);
                    }
                }
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
    gfxObject.lineStyle(2, 0x000000, 0.2);
    if (gPointer.mode == 'drag') {
        gfxObject.drawRect(gPointer.startDrag.x, gPointer.startDrag.y, gPointer.endDrag.x - gPointer.startDrag.x, gPointer.endDrag.y - gPointer.startDrag.y);
    }
    for (var i = 0; i < gScenery.length; i++) {
        gfxObject.drawRect(gScenery[i].rect.x, gScenery[i].rect.y, gScenery[i].rect.width, gScenery[i].rect.height);
    }
    if (gNavHUD) {
        for (var i = 0; i < gVG.nodes.length; i++) {
            gfxObject.lineStyle(2, 0x000000, 0.2);
            gfxObject.drawCircle(gVG.nodes[i].pos.x, gVG.nodes[i].pos.y, 8);
            gfxObject.lineStyle(1, 0xaa0000, 0.2);
            for (var j = 0; j < gVG.nodes[i].visibleNodes.length; j++) {
                gfxObject.moveTo(gVG.nodes[i].pos.x, gVG.nodes[i].pos.y);
                gfxObject.lineTo(gVG.nodes[gVG.nodes[i].visibleNodes[j].id].pos.x, gVG.nodes[gVG.nodes[i].visibleNodes[j].id].pos.y);
            }
        }
    }

    // render the stage
    renderer.render(stage);
}

function onAssetsLoaded() {
    // create an array to store the textures
    var blue_brown = [];

    for (var i = 0; i < 4; i++) {
        var texture = PIXI.Texture.fromFrame('blue_brown_' + gPlayerAnimationSequence[i] + '.png');
        blue_brown.push(texture);
    }
    ;

    var blue_ginger = [];

    for (var i = 0; i < 4; i++) {
        var texture = PIXI.Texture.fromFrame('blue_ginger_' + gPlayerAnimationSequence[i] + '.png');
        blue_ginger.push(texture);
    }
    ;

    var red_brown = [];

    for (var i = 0; i < 4; i++) {
        var texture = PIXI.Texture.fromFrame('red_brown_' + gPlayerAnimationSequence[i] + '.png');
        red_brown.push(texture);
    }
    ;

    var purple_brown = [];

    for (var i = 0; i < 4; i++) {
        var texture = PIXI.Texture.fromFrame('purple_brown_' + gPlayerAnimationSequence[i] + '.png');
        purple_brown.push(texture);
    }
    ;

    var foot1_brown = [];

    for (var i = 0; i < 4; i++) {
        var texture = PIXI.Texture.fromFrame('foot1_brown_' + gPlayerAnimationSequence[i] + '.png');
        foot1_brown.push(texture);
    }
    ;

    var foot2_brown = [];

    for (var i = 0; i < 4; i++) {
        var texture = PIXI.Texture.fromFrame('foot2_brown_' + gPlayerAnimationSequence[i] + '.png');
        foot2_brown.push(texture);
    }
    ;

    var foot2_fat_brown = [];

    for (var i = 0; i < 4; i++) {
        var texture = PIXI.Texture.fromFrame('foot2_fat_brown_' + gPlayerAnimationSequence[i] + '.png');
        foot2_fat_brown.push(texture);
    }
    ;

    var explosion = [];

    for (var i = 1; i < 45; i++) {
        var texture = PIXI.Texture.fromFrame('Explosion4_' + pad(String(i), 3) + '.png');
        explosion.push(texture);
    }

    var explosionAnimation = new PIXI.MovieClip(explosion);
    explosionAnimation.position.x = 300;
    explosionAnimation.position.y = 300;
    explosionAnimation.anchor.x = 0.5;
    explosionAnimation.anchor.y = 0.5;

    explosionAnimation.gotoAndPlay(0);
    gExplosions.push(explosionAnimation);

    for (var i = 0; i < gPlayers.length; i++) {
        // create a MovieClip
        var playerAnimation;
        if (gPlayers[i].team == 0) {
            //playerAnimation = new PIXI.MovieClip(foot1_brown);
            if (Math.random() < 0.5) {
                playerAnimation = new PIXI.MovieClip(blue_brown);
            } else {
                playerAnimation = new PIXI.MovieClip(blue_ginger);
            }
        } else {
            if (Math.random() < 0.9) {
                playerAnimation = new PIXI.MovieClip(red_brown);
            } else {
                playerAnimation = new PIXI.MovieClip(purple_brown);
            }
        }

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

    stage.addChild(explosionAnimation);

    // start animating
    requestAnimFrame(animate);
}

function nextFrame() {
    if (gStats.frameCounter % 5 == 0) {
        gPlayerAnimationIndex++;
        if (gPlayerAnimationIndex > 4) {
            gPlayerAnimationIndex = 0;
        }
    }
    return gPlayerAnimationIndex;
}
//# sourceMappingURL=render.js.map
