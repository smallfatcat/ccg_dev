var __extends = this.__extends || function (d, b) {
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
        this.xVel = 150;
        this.yVel = -100;
        this.xAcc = 0;
        this.yAcc = PHYSICS_GRAVITY;
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
//# sourceMappingURL=classes.js.map
