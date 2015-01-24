class Player extends Entity {
  distances: DistanceObject[];
  iconID: number;
  name: string;
  mass: number;
  collisionRadius: number;
  health: number;
  damage: number;
  attackChance: number;
  fight: Fight;
  isFighting: boolean;
  team: number;
  attackers: number;
  destination: Vector2D;
  isMoving: boolean;
  isSelected: boolean;
  history: Vector2D[];
  waypoints: Vector2D[];
  constructor(properties: PlayerProps) {
    super(properties);
    this.distances = [];
    this.name = properties.name;
    this.iconID = properties.iconID;
    this.mass = properties.mass;
    this.collisionRadius = properties.collisionRadius;
    this.health = properties.health;
    var zeroVector: Vector2D = new Vector2D({ x: 0, y: 0 });
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

  moveTowards(pos: Vector2D) {
    var towardsVector: Vector2D = getVectorAB(this.pos, pos);
    towardsVector.normalize();
    this.vel.x = towardsVector.x * this.speed;
    this.vel.y = towardsVector.y * this.speed;
  }

  pointAt(pos: Vector2D) {
    var towardsVector: Vector2D = getVectorAB(this.pos, pos);
    var rotRadians: number = Math.atan2(towardsVector.y, towardsVector.x);
    this.rotDegrees = ((rotRadians / (Math.PI * 2)) * 360) + 90;
  }

  moveForward() {
    var rotRadians: number = ((this.rotDegrees - 90) / 360) * (Math.PI * 2);
    this.vel.x = Math.cos(rotRadians) * this.speed;
    this.vel.y = Math.sin(rotRadians) * this.speed;
  }

  stop() {
    this.vel.x = 0;
    this.vel.y = 0;
  }
  addWaypoint(x: number, y: number) {
    // first/next waypoint is the last element in the array
    var waypoint: Vector2D = new Vector2D({ x: x, y: y });
    this.waypoints.push(waypoint);
  }
  emptyWaypoints() {
    this.waypoints = [];
  }
  removeWaypointAtPos(x: number, y: number) {
    for (var i = 0; i < this.waypoints.length; i++) {
      if (this.waypoints[i].x == x && this.waypoints[i].y == y) {
        this.waypoints.splice(i, 1);
        return;
      }
    }
  }
  setWaypoints(target: Vector2D) {
    var waypoints: number[] = getWaypoints(this.pos.x, this.pos.y, target.x, target.y);
    this.addWaypoint(target.x, target.y);
    for (var i = 0; i < waypoints.length;i++) {
      var x: number = gVG.nodes[waypoints[i]].pos.x;
      var y: number = gVG.nodes[waypoints[i]].pos.y;
      this.addWaypoint(x, y);
    }
  }
}

interface PlayerProps extends EntProps {
  iconID: number;
  name: string;
  mass: number;
  collisionRadius: number;
  health: number;
  damage: number;
  attackChance: number;
  team: number;
}  