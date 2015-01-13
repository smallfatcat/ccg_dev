var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PHYSICS_TICK = 33;
var PHYSICS_GRAVITY = 9.8;

var Entity = (function () {
    function Entity(properties) {
        this.id = properties.id;
        this.xPos = properties.xPos;
        this.yPos = properties.yPos;
        this.xVel = 0;
        this.yVel = 0;
        this.xAcc = 0;
        this.yAcc = PHYSICS_GRAVITY;
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

var g_player1 = new Player({ id: 1, xPos: 10, yPos: 20, iconID: 1, name: 'David' });
var g_player2 = new Player({ id: 2, xPos: 10, yPos: 50, iconID: 2, name: 'Gary' });

window.onload = function () {
    render();
    setTimeout(physics, PHYSICS_TICK);
};

function render() {
    $('#content').empty();
    renderPlayer(g_player1);
    renderPlayer(g_player2);
}

function physics() {
    physicsPlayer(g_player1);
    physicsPlayer(g_player2);
    setTimeout(physics, PHYSICS_TICK);
    render();
}

function physicsPlayer(player) {
    // v^2 = u^2 + 2as
    // s = u*t + 0.5 * a * t^2
    // v = u + a*t
    var t = PHYSICS_TICK / 1000;

    var uy = player.yVel;
    var vy = uy + (player.yAcc * t);
    var starty = player.yPos;
    var endy = starty + ((uy * t) + (0.5 * t * t * player.yAcc));

    if (endy > 500) {
        var s = 500 - starty;
        vy = Math.sqrt(uy * uy * (2 * player.yAcc * s));
        var collisionTime = (vy - uy) / player.yAcc;
        endy = 500;
        vy *= -0.9;
    }

    player.xPos += player.xVel;
    player.yPos = endy;

    player.xVel += player.xAcc;
    player.yVel = vy;
}

function renderPlayer(player) {
    var playerDiv = '';
    playerDiv += '<div id="playerDiv' + player.id + '" class="absolute" style="left: ' + player.xPos + 'px; top: ' + player.yPos + 'px;">' + player.name + '</div>';
    $('#content').append(playerDiv);
    //$('#playerDiv').animate({ 'left': player.xPos + 'px', 'top': player.yPos + 'px' });
}
//# sourceMappingURL=app.js.map
