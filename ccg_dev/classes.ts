// Class definitions and interfaces

// PLayArea Class
class PlayArea {
  pos: Vector2D;
  width: number;
  height: number;
  containerID: string;
  constructor(properties: PlayAreaProps) {
    this.pos = properties.pos;
    this.width = properties.width;
    this.height = properties.height;
    this.containerID = properties.containerID;
  }
  generateHtml() {
    var html: string = '';
    html += '';
    html += '<div id="' + this.containerID + 'div" class="absolute" style="left: ' + 0 + 'px; top: ' + 0 + 'px;"><canvas id = "' + this.containerID + '" width = "' + this.width + '" height = "' + this.height+'";" ></div>';
    return html;
  }
}

interface PlayAreaProps {
  pos: Vector2D;
  width: number;
  height: number;
  containerID: string;
}

// Stats Class
class Stats {
  startTime: number;
  frameCounter: number;
  currentTime: number;
  fps: number;
  lastFrameTime: number;
  kills: number;
  playersAlive: number;
  bombsUsed: number;
  teamKillsA: number;
  teamKillsB: number;
  resetCountdown: number;
  constructor(properties: StatsProps) {
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
  }
}

interface StatsProps {
  startTime: number;
  //frameCounter: number;
  //currentTime: number;
  //fps: number;
}

// InfoWindow class
class InfoWindow {
  pos: Vector2D;
  visible: boolean;
  currentVisibility: boolean;
  constructor(properties: InfoWindowProps) {
    this.pos = properties.pos;
    this.visible = properties.visible;
    this.currentVisibility = properties.visible;
  }
}

interface InfoWindowProps {
  pos: Vector2D;
  visible: boolean;
}

// Entity Class
class Entity {
  id: number;
  pos: Vector2D;
  vel: Vector2D;
  acc: Vector2D;
  rotDegrees: number;
  isAlive: boolean;
  speed: number;

  constructor(properties: EntProps) {
    this.id = properties.id;
    this.pos = properties.pos;
    this.vel = { x: 0, y: 0 };
    this.acc = { x: 0, y: 0 };
    this.rotDegrees = 0;
    this.isAlive = true;
    this.speed = PHYSICS_MAXRUN;
  }

  show() {
  }

  hide() {
  }
  move(pos: Vector2D) {
    this.pos.x += pos.x;
    this.pos.y += pos.y;
  }
  moveTo(pos: Vector2D) {
    this.pos.x = pos.x;
    this.pos.y = pos.y;
  }
}

interface EntProps {
  id: number;
  pos: Vector2D;
}

class Prop extends Entity {
  iconID: number;
  constructor(properties: PropProps) {
    super(properties);
    this.iconID = properties.iconID;
  }
}

interface PropProps extends EntProps {
  iconID: number;
}

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
  constructor(properties: PlayerProps) {
    super(properties);
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
  }

  moveTowards(pos: Vector2D) {
    var towardsVector: Vector2D = getVectorAB(this.pos, pos);
    normalize(towardsVector);
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

class Bomb extends Entity {
  maxRadius: number;
  minRadius: number;
  radius: number;
  lifeTime: number;
  maxLifeTime: number;
  damage: number;
  constructor(properties: BombProps) {
    super(properties);
    this.maxRadius = properties.maxRadius;
    this.minRadius = properties.minRadius;
    this.radius = this.minRadius;
    this.lifeTime = 0;
    this.maxLifeTime = properties.maxLifeTime;
    this.damage = properties.damage;
  }
}

interface BombProps extends EntProps {
  maxRadius: number;
  minRadius: number;
  maxLifeTime: number;
  damage: number;
}

interface Vector2D {
  x: number;
  y: number;
}

interface DistanceObject {
  targetID: number;
  distance: number;
  vectorToOther: Vector2D;
  gforce: number;
}

interface Collision {
  sourceID: number;
  targetID: number;
}

interface Fight {
  targetID: number;
  targetHealth: number;
  targetDirection: Vector2D;
}



