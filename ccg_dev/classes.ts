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
    this.xVel = 150;
    this.yVel = -100;
    this.xAcc = 0;
    this.yAcc = PHYSICS_GRAVITY;
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