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
//# sourceMappingURL=util.js.map
