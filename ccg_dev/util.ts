﻿function reset() {
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

function rectCollide(rect1: Rect, rect2: Rect) {
  var collided: boolean = false;
  if (rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.height + rect1.y > rect2.y) {
    // collision detected!
    collided = true;
  }
  return collided;
}

function getPlayerRect(player: Player) {
  var playerRect: Rect = new Rect({
    x: player.pos.x-player.collisionRadius,
    y: player.pos.y - player.collisionRadius,
    width: player.collisionRadius * 2,
    height: player.collisionRadius * 2
  })
  return playerRect;
}

function checkSATcollision(shape1: Shape, shape2: Shape) {
  var axes1: Vector2D[] = shape1.getAxes();
  var axes2: Vector2D[] = shape2.getAxes();
  // loop over the axes1
  for (var i = 0; i < axes1.length; i++) {
    var axis: Vector2D = new Vector2D( axes1[i]);
    // project both shapes onto the axis
    var p1: Projection = new Projection(shape1.project(axis));
    var p2: Projection = new Projection(shape2.project(axis));
    // do the projections overlap?
    if (!p1.overlap(p2)) {
      // then we can guarantee that the shapes do not overlap
      return false;
    }
  }
  // loop over the axes2
  for (var i = 0; i < axes2.length; i++) {
    var axis: Vector2D = new Vector2D(axes2[i]);
    // project both shapes onto the axis
    var p1: Projection = new Projection(shape1.project(axis));
    var p2: Projection = new Projection(shape2.project(axis));
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

/*
var t1 = new Shape({
  vertices: [
  { x: gRects[0].x, y: gRects[0].y},
  { x: gRects[0].x + gRects[0].width, y: gRects[0].y},
  { x: gRects[0].x + gRects[0].width, y: gRects[0].y + gRects[0].height}, 
  { x: gRects[0].x, y:gRects[0].y + gRects[0].height }
] });

*/

//inline double Dot(const Point & a,const Point & b) { return (a.x * b.x) + (a.y * b.y); }
//inline double PerpDot(const Point & a,const Point & b) { return (a.y * b.x) - (a.x * b.y); }

function LineCollision(A1: Vector2D, A2: Vector2D, B1: Vector2D, B2: Vector2D){
  var returnValue: LineCollisonResult;
  var isColliding: boolean = false;
  var out: number = 0;
  var intersection: Vector2D = new Vector2D({x: 0, y: 0});
  var a: Vector2D = new Vector2D(A2.subtract(A1));
  var b: Vector2D = new Vector2D(B2.subtract(B1));
  
  var f: number = a.perp().dot(b);
  if (f == 0) {
    // lines are parallel
    return { isColliding: false, intersection: intersection};
  }
    
  var c: Vector2D = new Vector2D(B2.subtract(A2));
  var aa: number = a.perp().dot(c);
  var bb: number = b.perp().dot(c);

  if (f < 0) {
    if (aa > 0) return { isColliding: false, intersection: intersection };
    if (bb > 0) return { isColliding: false, intersection: intersection };
    if (aa < f) return { isColliding: false, intersection: intersection };
    if (bb < f) return { isColliding: false, intersection: intersection };
  }
  else {
  if (aa < 0) return { isColliding: false, intersection: intersection };
  if (bb < 0) return { isColliding: false, intersection: intersection };
  if (aa > f) return { isColliding: false, intersection: intersection };
  if (bb > f) return { isColliding: false, intersection: intersection };
  }
  out = 1.0 - (aa / f);
  intersection = B2.subtract(B1).multiply(out).add(B1);
  return { isColliding: true, intersection: intersection };
}

function isVisible(A1: Vector2D, A2: Vector2D) {
  // check line collision for A1, A2 between B1, B2 from each edge
    // if collision is on the end of the edge, allow it
    // else
    return false;
  // if we found no collisions
  return true;
}