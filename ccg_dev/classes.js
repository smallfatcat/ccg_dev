// Class definitions and interfaces
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// PLayArea Class
var PlayArea = (function () {
    function PlayArea(properties) {
        this.pos = properties.pos;
        this.width = properties.width;
        this.height = properties.height;
        this.containerID = properties.containerID;
    }
    PlayArea.prototype.generateHtml = function () {
        var html = '';
        html += '';
        html += '<div id="' + this.containerID + 'div" class="absolute" style="left: ' + 0 + 'px; top: ' + 0 + 'px;"><canvas id = "' + this.containerID + '" width = "' + this.width + '" height = "' + this.height + '";" ></div>';
        return html;
    };
    return PlayArea;
})();

var Vector2D = (function () {
    function Vector2D(properties) {
        this.x = properties.x;
        this.y = properties.y;
    }
    // Methods
    Vector2D.prototype.normalize = function () {
        var distance = Math.sqrt((this.x * this.x) + (this.y * this.y));
        this.x = this.x / distance;
        this.y = this.y / distance;
        return this;
    };

    Vector2D.prototype.getNormalized = function () {
        var distance = Math.sqrt((this.x * this.x) + (this.y * this.y));
        var x = this.x / distance;
        var y = this.y / distance;
        var normalizedVector = new Vector2D({ x: x, y: y });
        return normalizedVector;
    };

    Vector2D.prototype.getDistance = function (b) {
        var x = b.x - this.x;
        var y = b.y - this.y;
        var distance = Math.sqrt((x * x) + (y * y));
        return distance;
    };

    Vector2D.prototype.getLength = function () {
        var length = Math.sqrt((this.x * this.x) + (this.y * this.y));
        return length;
    };

    Vector2D.prototype.getVectorTo = function (B) {
        var x = B.x - this.x;
        var y = B.y - this.y;
        var AB = new Vector2D({ x: x, y: x });
        return AB;
    };

    Vector2D.prototype.getAngleTo = function (B) {
        var angleToB = Math.atan2(B.y - this.y, B.x - this.x);
        return angleToB;
    };

    Vector2D.prototype.getAngle = function () {
        var angle = Math.atan2(this.y, this.x);
        return angle;
    };

    Vector2D.prototype.getAngleBetween = function (B) {
        var angleToA = Math.atan2(this.y, this.x);
        var angleToB = Math.atan2(B.y, B.x);
        var angleAB = angleToB - angleToA;
        return angleAB;
    };
    Vector2D.prototype.subtract = function (B) {
        var result = new Vector2D({ x: 0, y: 0 });
        result.x = this.x - B.x;
        result.y = this.y - B.y;
        return result;
    };
    Vector2D.prototype.add = function (B) {
        var result = new Vector2D({ x: 0, y: 0 });
        result.x = this.x + B.x;
        result.y = this.y + B.y;
        return result;
    };
    Vector2D.prototype.multiply = function (n) {
        var result = new Vector2D({ x: 0, y: 0 });
        result.x = this.x * n;
        result.y = this.y * n;
        return result;
    };
    Vector2D.prototype.perp = function () {
        // the perp method is just (x, y) => (-y, x) or (y, -x)
        var result = new Vector2D({ x: 0, y: 0 });
        result.x = -1 * this.y;
        result.y = 1 * this.x;
        return result;
    };
    Vector2D.prototype.dot = function (B) {
        var n = (this.x * B.x) + (this.y * B.y);
        return n;
    };
    return Vector2D;
})();

// Stats Class
var Stats = (function () {
    function Stats(properties) {
        this.startTime = properties.startTime;
        this.frameCounter = 0;
        this.currentTime = properties.startTime;
        this.fps = 0;
        this.lastFrameTime = 0;
        this.kills = 0;
        this.playersAlive = MAX_PLAYERS;
        this.bombsUsed = 0;
        this.teamKillsA = 0;
        this.teamKillsB = 0;
        this.resetCountdown = 5;
        this.playersMoving = 0;
    }
    return Stats;
})();

// InfoWindow class
var InfoWindow = (function () {
    function InfoWindow(properties) {
        this.pos = properties.pos;
        this.visible = properties.visible;
        this.currentVisibility = properties.visible;
    }
    return InfoWindow;
})();

// Entity Class
var Entity = (function () {
    function Entity(properties) {
        this.id = properties.id;
        this.pos = properties.pos;
        this.vel = new Vector2D({ x: 0, y: 0 });
        this.acc = new Vector2D({ x: 0, y: 0 });
        this.rotDegrees = 0;
        this.isAlive = true;
        this.speed = PHYSICS_MAXSPEED;
    }
    Entity.prototype.show = function () {
    };

    Entity.prototype.hide = function () {
    };
    Entity.prototype.move = function (pos) {
        this.pos.x += pos.x;
        this.pos.y += pos.y;
    };
    Entity.prototype.moveTo = function (pos) {
        this.pos.x = pos.x;
        this.pos.y = pos.y;
    };
    return Entity;
})();

var Prop = (function (_super) {
    __extends(Prop, _super);
    function Prop(properties) {
        _super.call(this, properties);
        this.iconID = properties.iconID;
    }
    return Prop;
})(Entity);

var Bomb = (function (_super) {
    __extends(Bomb, _super);
    function Bomb(properties) {
        _super.call(this, properties);
        this.maxRadius = properties.maxRadius;
        this.minRadius = properties.minRadius;
        this.radius = this.minRadius;
        this.lifeTime = 0;
        this.maxLifeTime = properties.maxLifeTime;
        this.damage = properties.damage;
    }
    return Bomb;
})(Entity);

var Pointer = (function (_super) {
    __extends(Pointer, _super);
    function Pointer(properties) {
        _super.call(this, properties);
        this.mode = properties.mode;
        this.startDrag = new Vector2D({ x: 0, y: 0 });
        this.endDrag = new Vector2D({ x: 0, y: 0 });
    }
    return Pointer;
})(Entity);

var Rect = (function (_super) {
    __extends(Rect, _super);
    function Rect(properties) {
        _super.call(this, properties);
        this.width = properties.width;
        this.height = properties.height;
    }
    Rect.prototype.convertToShape = function () {
        var shape = new Shape({
            vertices: [
                new Vector2D({ x: this.x, y: this.y }),
                new Vector2D({ x: this.x, y: this.y + this.height }),
                new Vector2D({ x: this.x + this.width, y: this.y + this.height }),
                new Vector2D({ x: this.x + this.width, y: this.y })
            ]
        });
        return shape;
    };
    return Rect;
})(Vector2D);

var Shape = (function () {
    function Shape(properties) {
        this.vertices = properties.vertices;
    }
    Shape.prototype.getEdges = function () {
        var edges = [];
        for (var i = 0; i < this.vertices.length; i++) {
            var edge = new Edge({ A1: this.vertices[i], A2: this.vertices[i + 1 == this.vertices.length ? 0 : i + 1] });
            edges.push(edge);
        }
        return edges;
    };

    Shape.prototype.getAxes = function () {
        var axes = [];

        for (var i = 0; i < this.vertices.length; i++) {
            console.log(this.vertices[i + 1 == this.vertices.length ? 0 : i + 1]);

            // get the current vertex
            var p1 = new Vector2D(this.vertices[i]);

            // get the next vertex
            var p2 = new Vector2D(this.vertices[i + 1 == this.vertices.length ? 0 : i + 1]);

            // subtract the two to get the edge vector
            var edge = new Vector2D(p1.subtract(p2));

            // get either perpendicular vector
            var normal = new Vector2D(edge.perp());

            // the perp method is just (x, y) => (-y, x) or (y, -x)
            axes.push(normal);
        }
        return axes;
    };

    Shape.prototype.project = function (axis) {
        var min = axis.dot(this.vertices[0]);
        var max = min;
        for (var i = 1; i < this.vertices.length; i++) {
            // NOTE: the axis must be normalized to get accurate projections
            var p = axis.dot(this.vertices[i]);
            if (p < min) {
                min = p;
            } else if (p > max) {
                max = p;
            }
        }
        var proj = new Projection({ min: min, max: max });
        return proj;
    };
    return Shape;
})();

var Edge = (function () {
    function Edge(properties) {
        this.A1 = properties.A1;
        this.A2 = properties.A2;
    }
    return Edge;
})();

var Projection = (function () {
    function Projection(properties) {
        this.min = properties.min;
        this.max = properties.max;
    }
    Projection.prototype.overlap = function (p2) {
        var isOverlapping = false;
        if (this.max >= p2.min && this.max <= p2.max || this.min >= p2.min && this.min <= p2.max || p2.min >= this.min && p2.min <= this.max || p2.max >= this.min && p2.max <= this.max) {
            isOverlapping = true;
        }
        return isOverlapping;
    };
    return Projection;
})();

var VisGraph = (function () {
    function VisGraph() {
        this.nodes = [];
    }
    VisGraph.prototype.addNode = function (node) {
        var newNode = new VGnode(node);
        this.nodes.push(newNode);
    };
    VisGraph.prototype.removeNode = function (id) {
        for (var i = 0; i < this.nodes[id].visibleNodes.length; i++) {
            this.nodes[id].removeVisible(this.nodes[id].visibleNodes[i].id);
        }
        this.nodes.splice(id, 1);
    };
    return VisGraph;
})();

var VGnode = (function () {
    function VGnode(properties) {
        this.id = properties.id;
        this.visibleNodes = [];
        this.pos = properties.pos;
    }
    VGnode.prototype.addVisible = function (nodeEntry) {
        this.visibleNodes.push(nodeEntry);
    };
    VGnode.prototype.removeVisible = function (id) {
        for (var i = 0; i < this.visibleNodes.length; i++) {
            if (this.visibleNodes[i].id == id) {
                // remove this entry
                this.visibleNodes.splice(i, 1);
                return;
            }
        }
    };
    return VGnode;
})();

var VGnodeEntry = (function () {
    function VGnodeEntry(properties) {
        this.id = properties.id;
        this.distance = properties.distance;
    }
    return VGnodeEntry;
})();

var Scenery = (function () {
    function Scenery(properties) {
        this.rect = properties.rect;
        this.shape = this.rect.convertToShape();
        this.edges = this.shape.getEdges();
        var c = 8;
        var node0 = new Vector2D({ x: this.shape.vertices[0].x - c, y: this.shape.vertices[0].y - c });
        var node1 = new Vector2D({ x: this.shape.vertices[1].x - c, y: this.shape.vertices[1].y + c });
        var node2 = new Vector2D({ x: this.shape.vertices[2].x + c, y: this.shape.vertices[2].y + c });
        var node3 = new Vector2D({ x: this.shape.vertices[3].x + c, y: this.shape.vertices[3].y - c });
        this.nodes = [];
        this.nodes.push(node0);
        this.nodes.push(node1);
        this.nodes.push(node2);
        this.nodes.push(node3);
    }
    return Scenery;
})();
//# sourceMappingURL=classes.js.map
