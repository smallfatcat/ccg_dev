// Class definitions and interfaces

class Entity {
  id: number;
  xPos: number;
  yPos: number;

  xVel: number;
  yVel: number;

  xAcc: number;
  yAcc: number;

  rotDegrees: number;

  constructor(properties: EntProps) {
    this.id = properties.id;
    this.xPos = properties.xPos;
    this.yPos = properties.yPos;
    this.xVel = 0;
    this.yVel = 0;
    this.xAcc = 0;
    this.yAcc = 0;
    this.rotDegrees = 0;
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

class Prop extends Entity {
  iconID: number;
  constructor(properties: PropProps) {
    super(properties);
    this.iconID = properties.iconID;
  }
}

class Player extends Entity {
  iconID: number;
  name: string;
  constructor(properties: PlayerProps) {
    super(properties);
    this.name = properties.name;
    this.iconID = properties.iconID;
  }
}
class Bomb extends Entity {
  maxRadius: number;
  minRadius: number;
  radius: number;
  lifeTime: number;
  maxLifeTime: number;
  damage: number;
  isAlive: boolean;
  constructor(properties: BombProps) {
    super(properties);
    this.maxRadius = properties.maxRadius;
    this.minRadius = properties.minRadius;
    this.radius = this.minRadius;
    this.lifeTime = 0;
    this.maxLifeTime = properties.maxLifeTime;
    this.damage = properties.damage;
    this.isAlive = true;
  }
}

interface EntProps {
  id: number;
  xPos: number;
  yPos: number;
}

interface PropProps extends EntProps {
  iconID: number;
}

interface PlayerProps extends EntProps {
  iconID: number;
  name: string;
} 

interface BombProps extends EntProps {
  maxRadius: number;
  minRadius: number;
  maxLifeTime: number;
  damage: number;
}