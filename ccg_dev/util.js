﻿function reset() {
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
        var axis = new Vector2D(axes1[i]);

        // project both shapes onto the axis
        var p1 = new Projection(shape1.project(axis));
        var p2 = new Projection(shape2.project(axis));

        // do the projections overlap?
        if (!p1.overlap(p2)) {
            // then we can guarantee that the shapes do not overlap
            return false;
        }
    }

    for (var i = 0; i < axes2.length; i++) {
        var axis = new Vector2D(axes2[i]);

        // project both shapes onto the axis
        var p1 = new Projection(shape1.project(axis));
        var p2 = new Projection(shape2.project(axis));

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
function LineCollision(A1, A2, B1, B2) {
    var returnValue;
    var isColliding = false;
    var out = 0;
    var intersection = new Vector2D({ x: 0, y: 0 });
    var a = new Vector2D(A2.subtract(A1));
    var b = new Vector2D(B2.subtract(B1));

    var f = a.perp().dot(b);
    if (f == 0) {
        // lines are parallel
        return { isColliding: false, intersection: intersection };
    }

    var c = new Vector2D(B2.subtract(A2));
    var aa = a.perp().dot(c);
    var bb = b.perp().dot(c);

    if (f < 0) {
        if (aa > 0)
            return { isColliding: false, intersection: intersection };
        if (bb > 0)
            return { isColliding: false, intersection: intersection };
        if (aa < f)
            return { isColliding: false, intersection: intersection };
        if (bb < f)
            return { isColliding: false, intersection: intersection };
    } else {
        if (aa < 0)
            return { isColliding: false, intersection: intersection };
        if (bb < 0)
            return { isColliding: false, intersection: intersection };
        if (aa > f)
            return { isColliding: false, intersection: intersection };
        if (bb > f)
            return { isColliding: false, intersection: intersection };
    }
    out = 1.0 - (aa / f);
    intersection = B2.subtract(B1).multiply(out).add(B1);
    return { isColliding: true, intersection: intersection };
}

function isVisible(A1, A2) {
    for (var i = 0; i < gEdges.length; i++) {
        var result = LineCollision(A1, A2, gEdges[i].A1, gEdges[i].A2);

        // if collision
        if (result.isColliding) {
            return false;
        }
    }

    // if we found no collisions
    return true;
}

function buildVG() {
    var VG = new VisGraph();
    for (var i = 0; i < gScenery.length; i++) {
        for (var n = 0; n < gScenery[i].nodes.length; n++) {
            var node = new VGnode({
                id: VG.nodes.length,
                pos: gScenery[i].nodes[n]
            });
            VG.addNode(node);
        }
    }

    for (var i = 0; i < VG.nodes.length; i++) {
        var thisNode = VG.nodes[i];
        for (var j = i + 1; j < VG.nodes.length; j++) {
            var otherNode = VG.nodes[j];

            // Check for visibility
            if (isVisible(thisNode.pos, otherNode.pos)) {
                var distance = getDistance(thisNode.pos, otherNode.pos);
                var thisNodeEntry = new VGnodeEntry({
                    id: otherNode.id,
                    distance: distance
                });
                var otherNodeEntry = new VGnodeEntry({
                    id: thisNode.id,
                    distance: distance
                });
                thisNode.addVisible(thisNodeEntry);
                otherNode.addVisible(otherNodeEntry);
                console.log(thisNode.id + ' is visible from ' + otherNode.id + ' ax: ' + thisNode.pos.x + ' ay: ' + thisNode.pos.y + ' bx: ' + otherNode.pos.x + ' by: ' + otherNode.pos.y);
            } else {
                console.log(thisNode.id + ' is not visible from ' + otherNode.id + ' ax: ' + thisNode.pos.x + ' ay: ' + thisNode.pos.y + ' bx: ' + otherNode.pos.x + ' by: ' + otherNode.pos.y);
            }
        }
    }
    return VG;
}

function addNewTarget(x, y) {
    var targetPos = new Vector2D({ x: x, y: y });
    var target = new VGnode({ id: gVG.nodes.length, pos: targetPos });
    gVG.addNode(target);

    var thisNode = gVG.nodes[gVG.nodes.length - 1];
    for (var i = 0; i < gVG.nodes.length - 1; i++) {
        var otherNode = gVG.nodes[i];

        // Check for visibility
        if (isVisible(thisNode.pos, otherNode.pos)) {
            var distance = getDistance(thisNode.pos, otherNode.pos);
            var thisNodeEntry = new VGnodeEntry({
                id: otherNode.id,
                distance: distance
            });
            var otherNodeEntry = new VGnodeEntry({
                id: thisNode.id,
                distance: distance
            });
            thisNode.addVisible(thisNodeEntry);
            otherNode.addVisible(otherNodeEntry);
            console.log(thisNode.id + ' is visible from ' + otherNode.id + ' ax: ' + thisNode.pos.x + ' ay: ' + thisNode.pos.y + ' bx: ' + otherNode.pos.x + ' by: ' + otherNode.pos.y);
        } else {
            console.log(thisNode.id + ' is not visible from ' + otherNode.id + ' ax: ' + thisNode.pos.x + ' ay: ' + thisNode.pos.y + ' bx: ' + otherNode.pos.x + ' by: ' + otherNode.pos.y);
        }
    }
}

function addNewSource(x, y) {
    addNewTarget(x, y);
}

function buildEdges() {
    var edges = [];
    for (var i = 0; i < gScenery.length; i++) {
        for (var e = 0; e < gScenery[i].edges.length; e++) {
            var edge = gScenery[i].edges[e];
            edges.push(edge);
        }
    }
    return edges;
}

/*
1  function Dijkstra(Graph, source):
2
3      dist[source] ← 0                       // Distance from source to source
4      prev[source] ← undefined               // Previous node in optimal path initialization
5
6      for each vertex v in Graph:  // Initialization
7          if v ≠ source            // Where v has not yet been removed from Q (unvisited nodes)
8              dist[v] ← infinity             // Unknown distance function from source to v
9              prev[v] ← undefined            // Previous node in optimal path from source
10          end if
11          add v to Q                     // All nodes initially in Q (unvisited nodes)
12      end for
13
14      while Q is not empty:
15          u ← vertex in Q with min dist[u]  // Source node in first case
16          remove u from Q
17
18          for each neighbor v of u:           // where v has not yet been removed from Q.
19              alt ← dist[u] + length(u, v)
20              if alt < dist[v]:               // A shorter path to v has been found
21                  dist[v] ← alt
22                  prev[v] ← u
23              end if
24          end for
25      end while
26
27      return dist[], prev[]
28
29  end function
*/
function Dijkstra() {
    // Assumes the source is the last item in gVG and the target is penultimate item
    var finalVG = new VisGraph();
    var Q = new VisGraph();
    var sourceID = gVG.nodes[gVG.nodes.length - 1].id;
    var targetID = gVG.nodes[gVG.nodes.length - 2].id;
    gVG.nodes[sourceID].distanceFromSource = 0;

    for (var i = 0; i < gVG.nodes.length; i++) {
        var v = gVG.nodes[i];
        if (v.id != sourceID) {
            v.distanceFromSource = Infinity;
            v.prev = -1;
        } else {
        }
        Q.nodes.push(v);
    }

    while (Q.nodes.length > 0) {
        var u = Q.nodes.splice(getMinDistanceNodeID(Q), 1)[0];

        for (i = 0; i < u.visibleNodes.length; i++) {
            var vID = getIDinQ(Q, u.visibleNodes[i].id);
            if (vID > -1) {
                var v = Q.nodes[vID];
                var alt = u.distanceFromSource + u.visibleNodes[i].distance;
                if (alt < v.distanceFromSource) {
                    v.distanceFromSource = alt;
                    v.prev = u.id;
                }
            }
        }
        finalVG.nodes.push(u);
    }
    finalVG.nodes.sort(function (a, b) {
        return a.id - b.id;
    });
    return finalVG;
}

function getMinDistanceNodeID(Q) {
    var minDistance = Infinity;
    var minID = -1;
    for (var i = 0; i < Q.nodes.length; i++) {
        if (Q.nodes[i].distanceFromSource < minDistance) {
            minDistance = Q.nodes[i].distanceFromSource;
            minID = i;
        }
    }
    return minID;
}

function getIDinQ(Q, id) {
    for (var i = 0; i < Q.nodes.length; i++) {
        if (Q.nodes[i].id == id) {
            return i;
        }
    }
    return -1;
}

function getWaypoints(sx, sy, tx, ty) {
    addNewTarget(tx, ty);
    var targetID = gVG.nodes.length - 1;
    addNewSource(sx, sy);
    var sourceID = gVG.nodes.length - 1;

    var VG = Dijkstra();
    var waypoints = [];
    var nextID = VG.nodes[targetID].prev;
    while (nextID != sourceID) {
        waypoints.push(VG.nodes[nextID].id);
        nextID = VG.nodes[nextID].prev;
    }

    //waypoints.push(sourceID);
    gVG.removeNode(sourceID);
    gVG.removeNode(targetID);

    return waypoints;
}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
//# sourceMappingURL=util.js.map
