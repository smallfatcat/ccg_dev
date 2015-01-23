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
    return Rect;
})(Vector2D);
//# sourceMappingURL=classes.js.map
