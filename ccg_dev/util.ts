function reset() {
  gStats.resetCountdown--;
  if (gStats.resetCountdown == 0) {
    init();
    gStats.resetCountdown = 5;
    gReset = false;
  }
  else {
    setTimeout(reset, 1000);
  }
}

function calculateAngle(a: Vector2D, b: Vector2D) {
  var angle: number;
  angle = Math.atan2(b.y, b.x) - Math.atan2(a.y, a.x);
  //console.log('Angle: ' + angle + ' a: ' + Math.atan2(a.y, a.x) + ' b: ' + Math.atan2(b.y, b.x));
  return angle;
}

function dot(a: Vector2D, b: Vector2D) {
  var dotProduct: number = (a.x * b.x) + (a.y * b.y);
  return dotProduct;
}

function mag(a: Vector2D) {
  var magnitude: number = Math.sqrt((a.x * a.x) + (a.y * a.y));
  return magnitude;
}

function calcVelocity(u: Vector2D, acc: Vector2D, t: number) {
  var v: Vector2D = new Vector2D({ x: 0, y: 0 });
  v.x = u.x + (acc.x * t);
  v.y = u.y + (acc.y * t);
  return v;
}

function calcFinalCoords(start: Vector2D, u: Vector2D, acc: Vector2D, t: number) {
  var end: Vector2D = new Vector2D({ x: 0, y: 0 });
  end.x = start.x + ((u.x * t) + (0.5 * t * t * acc.x));
  end.y = start.y + ((u.y * t) + (0.5 * t * t * acc.y));
  return end;
} 

function getDistance(a: Vector2D, b: Vector2D) {
  var x: number = b.x - a.x;
  var y: number = b.y - a.y;
  var distance: number = Math.sqrt((x * x) + (y * y));
  return distance;
}

function getVectorAB(A: Vector2D, B: Vector2D) {
  var AB: Vector2D = new Vector2D({ x: B.x - A.x, y: B.y - A.y });
  return AB;
}

function degToRad(d: number) {
  var r: number = (d / 360) * Math.PI * 2; 
  return r;
}