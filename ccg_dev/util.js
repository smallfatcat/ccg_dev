function reset() {
    gStats.resetCountdown--;
    if (gStats.resetCountdown == 0) {
        init();
        gStats.resetCountdown = 5;
        gReset = false;
    } else {
        setTimeout(reset, 1000);
    }
}

function calculateAngle(a, b) {
    var angle;
    angle = Math.atan2(b.y, b.x) - Math.atan2(a.y, a.x);

    //console.log('Angle: ' + angle + ' a: ' + Math.atan2(a.y, a.x) + ' b: ' + Math.atan2(b.y, b.x));
    return angle;
}

function dot(a, b) {
    var dotProduct = (a.x * b.x) + (a.y * b.y);
    return dotProduct;
}

function mag(a) {
    var magnitude = Math.sqrt((a.x * a.x) + (a.y * a.y));
    return magnitude;
}

function calcVelocity(u, acc, t) {
    var v = new Vector2D({ x: 0, y: 0 });
    v.x = u.x + (acc.x * t);
    v.y = u.y + (acc.y * t);
    return v;
}

function calcFinalCoords(start, u, acc, t) {
    var end = new Vector2D({ x: 0, y: 0 });
    end.x = start.x + ((u.x * t) + (0.5 * t * t * acc.x));
    end.y = start.y + ((u.y * t) + (0.5 * t * t * acc.y));
    return end;
}

function getDistance(a, b) {
    var x = b.x - a.x;
    var y = b.y - a.y;
    var distance = Math.sqrt((x * x) + (y * y));
    return distance;
}

function getVectorAB(A, B) {
    var AB = new Vector2D({ x: B.x - A.x, y: B.y - A.y });
    return AB;
}

function degToRad(d) {
    var r = (d / 360) * Math.PI * 2;
    return r;
}

function rectCollide(rect1, rect2) {
    var collided = false;
    if (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.height + rect1.y > rect2.y) {
        // collision detected!
        collided = true;
    }
    return collided;
}

function getPlayerRect(player) {
    var playerRect = new Rect({
        x: player.pos.x - player.collisionRadius,
        y: player.pos.y - player.collisionRadius,
        width: player.collisionRadius * 2,
        height: player.collisionRadius * 2
    });
    return playerRect;
}

function checkSATcollision(shape1, shape2) {
    var axes1 = shape1.getAxes();
    var axes2 = shape2.getAxes();

    for (var i = 0; i < axes1.length; i++) {
        var axis = axes1[i];

        // project both shapes onto the axis
        var p1 = shape1.project(axis);
        var p2 = shape2.project(axis);

        // do the projections overlap?
        if (!p1.overlap(p2)) {
            // then we can guarantee that the shapes do not overlap
            return false;
        }
    }

    for (var i = 0; i < axes2.length; i++) {
        var axis = axes2[i];

        // project both shapes onto the axis
        var p1 = shape1.project(axis);
        var p2 = shape2.project(axis);

        // do the projections overlap?
        if (!p1.overlap(p2)) {
            // then we can guarantee that the shapes do not overlap
            return false;
        }
    }

    // if we get here then we know that every axis had overlap on it
    // so we can guarantee an intersection
    return true;
}
//# sourceMappingURL=util.js.map
