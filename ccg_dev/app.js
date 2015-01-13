var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PHYSICS_TICK = 33;
var PHYSICS_GRAVITY = 98;
var MAX_BALLS = 100;

var Entity = (function () {
    function Entity(properties) {
        this.id = properties.id;
        this.xPos = properties.xPos;
        this.yPos = properties.yPos;
        this.xVel = 150;
        this.yVel = -100;
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

//var g_player1 = new Player({ id: 1, xPos: 100, yPos: 100, iconID: 1, name: 'David' });
//var g_player2 = new Player({ id: 2, xPos: 200, yPos: 250, iconID: 2, name: 'Gary' });
var g_entities = [];

for (var i = 0; i < MAX_BALLS; i++) {
    var ball = new Player({ id: i, xPos: Math.random() * 400, yPos: Math.random() * 700, iconID: 1, name: String(i) });
    ball.xVel = (Math.random() * 300) - 50;
    ball.yVel = (Math.random() * 300) - 50;
    g_entities.push(ball);
}

window.onload = function () {
    render();
    setTimeout(physics, PHYSICS_TICK);
};

function render() {
    $('#content').empty();
    for (var i = 0; i < MAX_BALLS; i++) {
        renderPlayer(g_entities[i]);
    }
}

function physics() {
    for (var i = 0; i < MAX_BALLS; i++) {
        physicsPlayer(g_entities[i]);
    }
    setTimeout(physics, PHYSICS_TICK);
    render();
}

function physicsPlayer(player) {
    // v^2 = u^2 + 2as
    // s = u*t + 0.5 * a * t^2
    // v = u + a*t
    var t = PHYSICS_TICK / 1000;

    var ux = player.xVel;
    var uy = player.yVel;
    var vx = ux + (player.xAcc * t);
    var vy = uy + (player.yAcc * t);
    var startx = player.xPos;
    var starty = player.yPos;
    var endx = startx + ((ux * t) + (0.5 * t * t * player.xAcc));
    var endy = starty + ((uy * t) + (0.5 * t * t * player.yAcc));

    var collided;

    collided = collide(t, ux, vx, startx, endx, 800, player.xAcc, 1, 0.9);
    endx = collided.end;
    vx = collided.v;
    if (collided.touched) {
        vy *= 0.99;
    }

    collided = collide(t, ux, vx, startx, endx, 0, player.xAcc, -1, 0.9);
    endx = collided.end;
    vx = collided.v;
    if (collided.touched) {
        vy *= 0.99;
    }

    collided = collide(t, uy, vy, starty, endy, 800, player.yAcc, 1, 0.9);
    endy = collided.end;
    vy = collided.v;
    if (collided.touched) {
        vx *= 0.99;
    }

    collided = collide(t, uy, vy, starty, endy, 0, player.yAcc, -1, 0.9);
    endy = collided.end;
    vy = collided.v;
    if (collided.touched) {
        vx *= 0.99;
    }

    player.xPos = endx;
    player.yPos = endy;

    player.xVel = vx;
    player.yVel = vy;
}

function collide(t, u, v, start, end, limit, acc, direction, elasticity) {
    var touched = false;
    if ((end > limit && direction == 1) || (end < limit && direction == -1)) {
        touched = true;
        var s = (limit - start) * direction;
        v = Math.sqrt(u * u + (2 * acc * s)) * direction;
        var collisionTime = acc > 0 ? (v - u) / acc : s / u;
        var remainingtime = t - collisionTime;
        v *= -1 * elasticity;
        if ((v < -0.01 && direction == 1) || (v > 0.01 && direction == -1)) {
            u = v;
            start = limit;
            end = start + ((u * remainingtime) + (0.5 * remainingtime * remainingtime * acc));
            v = u + (acc * remainingtime);
            //end = 500;
        } else {
            end = limit;
            v = 0;
        }
    }
    return { 'end': end, 'v': v, 'touched': touched };
}

function renderPlayer(player) {
    var playerDiv = '';

    //playerDiv += '<div id="playerDiv' + player.id + '" class="absolute" style="left: ' + player.xPos + 'px; top: ' + player.yPos + 'px;">' + player.name + ' x: ' + player.xPos + ' y: ' + player.yPos + '</div>';
    playerDiv += '<div id="playerDiv' + player.id + '" class="absolute" style="left: ' + player.xPos + 'px; top: ' + player.yPos + 'px;">' + player.name + '</div>';

    $('#content').append(playerDiv);
    //$('#playerDiv').animate({ 'left': player.xPos + 'px', 'top': player.yPos + 'px' });
}
//# sourceMappingURL=app.js.map
