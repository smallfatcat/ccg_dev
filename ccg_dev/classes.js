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
        this.playersAlive = MAX_BALLS;
        this.bombsUsed = 0;
    }
    return Stats;
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
    }
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
