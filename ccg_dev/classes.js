﻿var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Entity = (function () {
    function Entity(properties) {
        this.id = properties.id;
        this.xPos = properties.xPos;
        this.yPos = properties.yPos;
        this.xVel = 0;
        this.yVel = 0;
        this.xAcc = 0;
        this.yAcc = 0;
        this.rotDegrees = 0;
    }
    Entity.prototype.show = function () {
    };

    Entity.prototype.hide = function () {
    };

    Entity.prototype.move = function (x, y) {
        this.xPos += x;
        this.yPos += y;
    };

    Entity.prototype.moveTo = function (x, y) {
        this.xPos = x;
        this.yPos = y;
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
        this.name = properties.name;
        this.iconID = properties.iconID;
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
        this.isAlive = true;
    }
    return Bomb;
})(Entity);
//# sourceMappingURL=classes.js.map
