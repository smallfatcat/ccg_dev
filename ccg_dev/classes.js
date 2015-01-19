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
        this.vel = { x: 0, y: 0 };
        this.acc = { x: 0, y: 0 };
        this.rotDegrees = 0;
        this.isAlive = true;
        this.speed = PHYSICS_MAXRUN;
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

var Player = (function (_super) {
    __extends(Player, _super);
    function Player(properties) {
        _super.call(this, properties);
        this.distances = [];
        this.name = properties.name;
        this.iconID = properties.iconID;
        this.mass = properties.mass;
        this.collisionRadius = properties.collisionRadius;
        this.health = properties.health;
        this.fight = { targetID: -1, targetDirection: { x: 0, y: 0 }, targetHealth: 100 };
        this.isFighting = false;
        this.team = properties.team;
        this.damage = properties.damage;
        this.attackChance = properties.attackChance;
        this.attackers = 0;
        this.destination = { x: 0, y: 0 };
        this.isMoving = false;
    }
    Player.prototype.moveTowards = function (pos) {
        var towardsVector = getVectorAB(this.pos, pos);
        normalize(towardsVector);
        this.vel.x = towardsVector.x * this.speed;
        this.vel.y = towardsVector.y * this.speed;
    };

    Player.prototype.pointAt = function (pos) {
        var towardsVector = getVectorAB(this.pos, pos);
        var rotRadians = Math.atan2(towardsVector.y, towardsVector.x);
        this.rotDegrees = ((rotRadians / (Math.PI * 2)) * 360) + 90;
    };

    Player.prototype.moveForward = function () {
        var rotRadians = ((this.rotDegrees - 90) / 360) * (Math.PI * 2);
        this.vel.x = Math.cos(rotRadians) * this.speed;
        this.vel.y = Math.sin(rotRadians) * this.speed;
    };

    Player.prototype.stop = function () {
        this.vel.x = 0;
        this.vel.y = 0;
    };
    return Player;
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
//# sourceMappingURL=classes.js.map
