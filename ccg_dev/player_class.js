var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
        var zeroVector = new Vector2D({ x: 0, y: 0 });
        this.fight = { targetID: -1, targetDirection: zeroVector, targetHealth: 100 };
        this.isFighting = false;
        this.team = properties.team;
        this.damage = properties.damage;
        this.attackChance = properties.attackChance;
        this.attackers = 0;
        this.destination = new Vector2D({ x: 0, y: 0 });
        this.isMoving = false;
        this.isSelected = false;
        this.history = [];
        this.waypoints = [];
    }
    Player.prototype.moveTowards = function (pos) {
        var towardsVector = getVectorAB(this.pos, pos);
        towardsVector.normalize();
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
    Player.prototype.addWaypoint = function (x, y) {
        // first/next waypoint is the last element in the array
        var waypoint = new Vector2D({ x: x, y: y });
        this.waypoints.push(waypoint);
    };
    Player.prototype.emptyWaypoints = function () {
        this.waypoints = [];
    };
    Player.prototype.removeWaypointAtPos = function (x, y) {
        for (var i = 0; i < this.waypoints.length; i++) {
            if (this.waypoints[i].x == x && this.waypoints[i].y == y) {
                this.waypoints.splice(i, 1);
                return;
            }
        }
    };
    Player.prototype.setWaypoints = function (target) {
        var waypoints = getWaypoints(this.pos.x, this.pos.y, target.x, target.y);
        this.addWaypoint(target.x, target.y);
        for (var i = 0; i < waypoints.length; i++) {
            var x = gVG.nodes[waypoints[i]].pos.x;
            var y = gVG.nodes[waypoints[i]].pos.y;
            this.addWaypoint(x, y);
        }
    };
    return Player;
})(Entity);
//# sourceMappingURL=player_class.js.map
