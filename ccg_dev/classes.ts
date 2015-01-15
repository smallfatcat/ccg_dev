// Class definitions and interfaces

// PLayArea Class
class PlayArea {
  xPos: number;
  yPos: number;
  width: number;
  height: number;
  containerID: string;
  constructor(properties: PlayAreaProps) {
    this.xPos = properties.xPos;
    this.yPos = properties.yPos;
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
  xPos: number;
  yPos: number;
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
  constructor(properties: StatsProps) {
    this.startTime = properties.startTime;
    this.frameCounter = 0;
    this.currentTime = properties.startTime;
    this.fps = 0;
    this.lastFrameTime = 0;
    this.kills = 0;
    this.playersAlive = MAX_BALLS;
    this.bombsUsed = 0;
  }
}

interface StatsProps {
  startTime: number;
  //frameCounter: number;
  //currentTime: number;
  //fps: number;
}

// Entity Class
class Entity {
  id: number;
  xPos: number;
  yPos: number;
  xVel: number;
  yVel: number;
  xAcc: number;
  yAcc: number;
  rotDegrees: number;
  isAlive: boolean;

  constructor(properties: EntProps) {
    this.id = properties.id;
    this.xPos = properties.xPos;
    this.yPos = properties.yPos;
    this.xVel = 0;
    this.yVel = 0;
    this.xAcc = 0;
    this.yAcc = 0;
    this.rotDegrees = 0;
    this.isAlive = true;
  }

  show() {
  }

  hide() {
  }
  move(x: number, y: number) {
    this.xPos += x;
    this.yPos += y;
  }
  moveTo(x: number, y: number) {
    this.xPos = x;
    this.yPos = y;
  }
}

interface EntProps {
  id: number;
  xPos: number;
  yPos: number;
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
  distances: number[];
  iconID: number;
  name: string;
  mass: number;
  constructor(properties: PlayerProps) {
    super(properties);
    this.distances = [];
    this.name = properties.name;
    this.iconID = properties.iconID;
    this.mass = properties.mass;
  }
}

interface PlayerProps extends EntProps {
  iconID: number;
  name: string;
  mass: number;
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




