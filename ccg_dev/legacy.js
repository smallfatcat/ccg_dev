function doCollisionChecks() {
    var collisions = [];
    var players = [];
    players = gPlayers.slice(0);

    for (var i = 0; i < gPlayers.length; i++) {
        var source = players.pop();
        if (source.isAlive) {
            for (var j = 0; j < players.length; j++) {
                var target = players[j];
                if (target.isAlive && source.isAlive) {
                    //var distanceObject: DistanceObject = calcGravity(source, target);
                    //applyGravity(source, distanceObject);
                    //var invertedDistanceObject: DistanceObject = storeDistanceObject(source, target, distanceObject);
                    //applyGravity(target, invertedDistanceObject);
                    var isHit = checkRadiusCollision(source, target);
                    if (isHit) {
                        //combine(source, target);
                        var collision = { sourceID: source.id, targetID: target.id };
                        collisions.push(collision);
                    }
                }
            }
        }
    }
    return collisions;
}

function combine(source, target) {
    // Calculate initial momentum
    var momentum = new Vector2D({ x: 0, y: 0 });
    momentum.x = (source.vel.x * source.mass) + (target.vel.x * target.mass);
    momentum.y = (source.vel.y * source.mass) + (target.vel.y * target.mass);
    var newMass = source.mass + target.mass;
    if (target.mass <= source.mass) {
        // Kill Target
        target.isAlive = false;
        source.vel.x = momentum.x / newMass;
        source.vel.y = momentum.y / newMass;
    }
    if (target.mass > source.mass) {
        source.isAlive = false;
        target.vel.x = momentum.x / newMass;
        target.vel.y = momentum.y / newMass;
    }
}

function storeDistanceObject(source, target, distanceObject) {
    var vectorToOther = new Vector2D({ x: distanceObject.vectorToOther.x * -1, y: distanceObject.vectorToOther.y * -1 });
    var invertedDistanceObject = { targetID: source.id, vectorToOther: vectorToOther, gforce: distanceObject.gforce, distance: distanceObject.distance };
    source.distances.push(distanceObject);
    target.distances.push(invertedDistanceObject);
    return invertedDistanceObject;
}

function checkRadiusCollision(source, target) {
    var isHit = false;
    var d = getDistance(source.pos, target.pos);
    if (d <= source.collisionRadius + target.collisionRadius) {
        isHit = true;
    }
    return isHit;
}

function checkBombHit(bomb, player) {
    var isHit = false;
    var checkRadius = bomb.radius + 16;
    var distance = getDistance(bomb.pos, player.pos);
    if (distance <= checkRadius) {
        isHit = true;
    }
    return isHit;
}

function applyBombDamage(bomb) {
    for (var i = 0; i < gPlayers.length; i++) {
        if (gPlayers[i].isAlive) {
            if (checkBombHit(bomb, gPlayers[i])) {
                gPlayers[i].isAlive = false;
                gStats.kills++;
            }
        }
    }
}

function checkSideCollision(u, v, start, end, acc, t) {
    var collided;
    collided = collide(t, u.x, v.x, start.x, end.x, 800, acc.x, 1, ELASTICITY_NORMAL);
    end.x = collided.end;
    v.x = collided.v;
    if (collided.touched) {
        v.y *= PHYSICS_FRICTION;
    }

    collided = collide(t, u.x, v.x, start.x, end.x, 0, acc.x, -1, ELASTICITY_NORMAL);
    end.x = collided.end;
    v.x = collided.v;
    if (collided.touched) {
        v.y *= PHYSICS_FRICTION;
    }

    collided = collide(t, u.y, v.y, start.y, end.y, 800, acc.y, 1, ELASTICITY_NORMAL);
    end.y = collided.end;
    v.y = collided.v;
    if (collided.touched) {
        v.x *= PHYSICS_FRICTION;
    }

    collided = collide(t, u.y, v.y, start.y, end.y, 0, acc.y, -1, ELASTICITY_NORMAL);
    end.y = collided.end;
    v.y = collided.v;
    if (collided.touched) {
        v.x *= PHYSICS_FRICTION;
    }
    return { v: v, end: end };
}

// Check collision with the sides of the box
function collide(t, u, v, start, end, limit, acc, direction, elasticity) {
    // Set flag if the collision occured
    var touched = false;

    // if we crossed the boundary
    if ((end > limit && direction == 1) || (end < limit && direction == -1)) {
        // Mark flag that we crossed the boundary
        touched = true;

        // s is the amount we need to travel from start to the boundary
        var s = (limit - start) * direction;

        // v is the velocity when we reached the boundary
        v = Math.sqrt(u * u + (2 * acc * s)) * direction;

        // calculate the time at which we hit the boundary
        var collisionTime = acc > 0 ? (v - u) / acc : s / u;

        // calculate the remaining time in this tick after the collison
        var remainingtime = t - collisionTime;

        // reverse velocity and account for elasticity
        v *= -1 * elasticity;

        // if v is not very small
        if ((v < -0.1 && direction == 1) || (v > 0.1 && direction == -1)) {
            // Set initial u as v from the collision above
            u = v;

            // Set the start at the collision point
            start = limit;

            // calculate new final pos
            end = start + ((u * remainingtime) + (0.5 * remainingtime * remainingtime * acc));

            // calculate final velocity
            v = u + (acc * remainingtime);
        } else {
            // Set final pos on the boundary
            end = limit;

            // Zero out velocity
            v = 0;
        }
    }

    // return the final position, velocity, and if there was a collision with the boundary
    return { 'end': end, 'v': v, 'touched': touched };
}

function calcGravity(source, target) {
    var distanceToOther = getDistance(source.pos, target.pos);
    var vectorToOther = getVectorAB(source.pos, target.pos);
    vectorToOther.x /= distanceToOther;
    vectorToOther.y /= distanceToOther;

    //  Gravity experiment
    var totalCollisionRadius = source.collisionRadius + target.collisionRadius;
    if (distanceToOther < totalCollisionRadius) {
        distanceToOther = totalCollisionRadius;
    }
    var gravityForceX = GRAVITY_CONSTANT * (source.mass * target.mass / (distanceToOther * distanceToOther));
    return { targetID: target.id, distance: distanceToOther, vectorToOther: vectorToOther, gforce: gravityForceX };
}

function calcGravityForce(source, other) {
}

function applyGravity(player, distanceObject) {
    player.acc.x += distanceObject.vectorToOther.x * distanceObject.gforce / player.mass;
    player.acc.y += distanceObject.vectorToOther.y * distanceObject.gforce / player.mass;
    if (player.acc.x > PHYSICS_MAXACC) {
        player.acc.x = PHYSICS_MAXACC;
    }
    if (player.acc.x < -1 * PHYSICS_MAXACC) {
        player.acc.x = -1 * PHYSICS_MAXACC;
    }
    if (player.acc.y > PHYSICS_MAXACC) {
        player.acc.y = PHYSICS_MAXACC;
    }
    if (player.acc.y < -1 * PHYSICS_MAXACC) {
        player.acc.y = -1 * PHYSICS_MAXACC;
    }
}

function calcBombPhysics() {
    var aliveBombs = [];
    var newID = 0;

    for (var i = 0; i < gBombs.length; i++) {
        if (gBombs[i].isAlive) {
            // t is the time elapsed in this tick
            var t = PHYSICS_TICK / 1000;

            // increment lifetime
            gBombs[i].lifeTime += t;

            // If bombs new lifetime is over maxlife, kill it
            if (gBombs[i].lifeTime > gBombs[i].maxLifeTime) {
                gBombs[i].isAlive = false;
            } else {
                // increase the radius of the bomb
                var radiusIncrease = (gBombs[i].maxRadius - gBombs[i].minRadius) / gBombs[i].maxLifeTime * t;
                gBombs[i].radius += radiusIncrease;

                // check players for damage
                applyBombDamage(gBombs[i]);

                // keep this bomb in the global array, give it a new ID for the new array
                gBombs[i].id = newID;
                newID++;
                aliveBombs.push(gBombs[i]);
            }
        }
    }

    // overwrite bomb array removing dead bombs
    gBombs = aliveBombs;
}

function render() {
    $('#content').empty();

    // Set up
    var html = '';

    for (var i = 0; i < gPlayers.length; i++) {
        if (gPlayers[i].isAlive) {
            html += renderPlayer(gPlayers[i]);
        }
    }

    for (i = 0; i < gBombs.length; i++) {
        if (gBombs[i].isAlive) {
            html += '<div id="bombDiv' + gBombs[i].id + '" class="absolute" style="left: ' + (gBombs[i].pos.x - 150) + 'px; top: ' + (gBombs[i].pos.y - 150) + 'px;"><canvas id = "bomb' + gBombs[i].id + '" width = "300" height = "300";" ></div>';
        }
    }

    // Mouse pointer
    html += '<div id="mouseHit" class="absolute" style="left: ' + gPointer.pos.x + 'px; top: ' + gPointer.pos.y + 'px;"><img id="imouseHit" style="width: 32px;" src="crosshair.png"></div>';

    // write scene to html
    $('#content').append(html);

    for (i = 0; i < gBombs.length; i++) {
        if (gBombs[i].isAlive) {
            drawBomb(gBombs[i]);
        }
    }
    // rotate each test object
    //for (var i = 0; i < MAX_PLAYERS; i++) {
    //  $('#i' + i).rotate(gPlayers[i].rotDegrees);
    //}
}

function drawBomb(bomb) {
    var c = document.getElementById("bomb" + bomb.id);
    if (c == null) {
        console.log('break');
    }
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc(150, 150, bomb.radius, 0, 2 * Math.PI);
    ctx.stroke();
    //var img = document.getElementById("i0");
    //img.src = 'tile_grey_32.png';
    //ctx.drawImage(img, 0, 0);
}

function renderPlayer(player) {
    var playerDiv = '';

    //playerDiv += '<div id="playerDiv' + player.id + '" class="absolute" style="left: ' + player.pos.x + 'px; top: ' + player.pos.y + 'px;">' + player.name + ' x: ' + player.pos.x + ' y: ' + player.pos.y + '</div>';
    var imgSrc = '';

    //imgSrc = player.id < (MAX_PLAYERS / 2) ? 'ball.png' : 'ball_red.png';
    imgSrc = 'police.png';
    playerDiv += '<div id="playerDiv' + player.id + '" class="absolute" style="left: ' + player.pos.x + 'px; top: ' + player.pos.y + 'px;"><img id="i' + player.id + '" style="width: 32px;" src="' + imgSrc + '"></div>';

    return playerDiv;
    //$('#content').append(playerDiv);
    //$('#playerDiv').animate({ 'left': player.pos.x + 'px', 'top': player.pos.y + 'px' });
}

function renderPlayArea() {
    // If this is the first time, create the canvas and write it to the page
    if (!gPlayAreaCanvasCreated) {
        $('#content').empty();
        var html = gPlayArea.generateHtml();
        var infoWindowPos = new Vector2D({ x: 800, y: 0 });
        gInfoWindow = new InfoWindow({ pos: infoWindowPos, visible: true });
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
    var c = document.getElementById(gPlayArea.containerID);
    var ctx = c.getContext("2d");

    // Clear the Play Area Canvas
    ctx.clearRect(0, 0, gPlayArea.width, gPlayArea.height);

    for (var i = 0; i < gPlayers.length; i++) {
        if (gPlayers[i].isAlive) {
            //drawFilledCircle(ctx, gPlayers[i].pos.x, gPlayers[i].pos.y, gPlayers[i].collisionRadius, gPlayers[i].team == 0 ? 'red' : 'blue');
            //drawCircle(ctx, gPlayers[i].destination.x, gPlayers[i].destination.y, gPlayers[i].collisionRadius);
            drawImage(ctx, gPlayers[i].pos.x, gPlayers[i].pos.y, gPlayers[i].rotDegrees, 16, gPlayers[i].team == 0 ? 'man_red' : 'man_green');
            if (gPlayers[i].isFighting) {
                drawFilledRectangle(ctx, gPlayers[i].pos.x - 12, gPlayers[i].pos.y - 24, (24 / 100) * gPlayers[i].health, 4, 'yellow');
            }
            if (gPlayers[i].isSelected) {
                drawRectangle(ctx, gPlayers[i].pos.x - gPlayers[i].collisionRadius - 2, gPlayers[i].pos.y - gPlayers[i].collisionRadius - 2, (gPlayers[i].collisionRadius * 2) + 4, (gPlayers[i].collisionRadius * 2) + 4);
            }
        } else {
            drawFilledCircle(ctx, gPlayers[i].pos.x, gPlayers[i].pos.y, 5, gPlayers[i].team == 0 ? 'red' : 'blue');
        }
    }

    // Draw selection box
    if (gPointer.mode == 'drag') {
        drawRectangle(ctx, gPointer.startDrag.x, gPointer.startDrag.y, gPointer.endDrag.x - gPointer.startDrag.x, gPointer.endDrag.y - gPointer.startDrag.y);
    }

    for (i = 0; i < gBombs.length; i++) {
        if (gBombs[i].isAlive) {
            drawFilledCircle(ctx, gBombs[i].pos.x, gBombs[i].pos.y, gBombs[i].radius, 'red');
        }
    }
}

function drawFilledCircle(ctx, x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
}

function drawCircle(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawRectangle(ctx, x, y, width, height) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.stroke();
}

function drawFilledRectangle(ctx, x, y, width, height, color) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.stroke();
}

function drawImage(ctx, x, y, a, width, imgID) {
    var image = document.getElementById(imgID);

    ctx.translate(x, y);
    ctx.rotate(a * Math.PI / 180);

    //ctx.fillRect(-50, -50, 100, 100);
    ctx.drawImage(image, width / -2, width / -2);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}
//# sourceMappingURL=legacy.js.map
