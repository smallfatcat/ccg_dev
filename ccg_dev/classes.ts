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

class Vector2D {
  x: number;
  y: number;
  constructor(properties: Vector2DProps) {
    this.x = properties.x;
    this.y = properties.y;
  }
  // Methods
  normalize() {
    var distance: number = Math.sqrt((this.x * this.x) + (this.y * this.y));
    this.x = this.x / distance;
    this.y = this.y / distance;
    return this;
  }

  getNormalized() {
    var distance: number = Math.sqrt((this.x * this.x) + (this.y * this.y));
    var x: number = this.x / distance;
    var y: number = this.y / distance;
    var normalizedVector: Vector2D = new Vector2D({x: x, y: y});
    return normalizedVector;
  }

  getDistance(b: Vector2D) {
  var x: number = b.x - this.x;
  var y: number = b.y - this.y;
  var distance: number = Math.sqrt((x * x) + (y * y));
  return distance;
  }

  getLength() {
    var length: number = Math.sqrt((this.x * this.x) + (this.y * this.y));
    return length;
  }

  getVectorTo(B: Vector2D){
    var x: number = B.x - this.x;
    var y: number = B.y - this.y;
    var AB: Vector2D = new Vector2D({ x: x, y: x })
    return AB;
  }

  getAngleTo(B: Vector2D) {
    var angleToB: number = Math.atan2(B.y - this.y, B.x - this.x);
    return angleToB;
  }

  getAngle() {
    var angle: number = Math.atan2(this.y, this.x);
    return angle;
  }

  getAngleBetween(B: Vector2D) {
    var angleToA: number = Math.atan2(this.y, this.x);
    var angleToB: number = Math.atan2(B.y, B.x);
    var angleAB: number = angleToB - angleToA;
    return angleAB;
  }
  subtract(B: Vector2D) {
    var result: Vector2D = new Vector2D({ x: 0, y: 0 });
    result.x = this.x - B.x;
    result.y = this.y - B.y;
    return result;
  }
  add(B: Vector2D) {
    var result: Vector2D = new Vector2D({ x: 0, y: 0 });
    result.x = this.x + B.x;
    result.y = this.y + B.y;
    return result;
  }
  multiply(n: number) {
    var result: Vector2D = new Vector2D({ x: 0, y: 0 });
    result.x = this.x * n;
    result.y = this.y * n;
    return result;
  }
  perp() {
    // the perp method is just (x, y) => (-y, x) or (y, -x)
    var result: Vector2D = new Vector2D({ x: 0, y: 0 });
    result.x = -1 * this.y;
    result.y = 1 * this.x;
    return result;
  }
  dot(B: Vector2D) {
    var n: number = (this.x * B.x) + (this.y * B.y);
    return n;
  }
}

interface Vector2DProps {
  x: number;
  y: number;
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
  playersMoving: number;
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
    this.playersMoving = 0;
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
    this.vel = new Vector2D({ x: 0, y: 0 });
    this.acc = new Vector2D({ x: 0, y: 0 });
    this.rotDegrees = 0;
    this.isAlive = true;
    this.speed = PHYSICS_MAXSPEED;
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

class Pointer extends Entity {
  mode: string;
  startDrag: Vector2D;
  endDrag: Vector2D;
  constructor(properties: PointerProps) {
    super(properties);
    this.mode = properties.mode;
    this.startDrag = new Vector2D({ x: 0, y: 0 });
    this.endDrag = new Vector2D({ x: 0, y: 0 });
  }
}

interface PointerProps extends EntProps {
  mode: string;
}

class Rect extends Vector2D{
  width: number;
  height: number;
  constructor(properties: RectProps) {
    super(properties);
    this.width = properties.width;
    this.height = properties.height;
  }
  convertToShape() {
    var shape: Shape = new Shape({
      vertices: [
        new Vector2D({x: this.x, y: this.y}),
        new Vector2D({x: this.x, y: this.y + this.height}),
        new Vector2D({x: this.x + this.width, y: this.y + this.height}),
        new Vector2D({x: this.x + this.width, y: this.y})
      ]
    });
    return shape;
  }
}

interface RectProps extends Vector2DProps {
  width: number;
  height: number;
}

class Shape {
  vertices: Vector2D[];
  constructor(properties: ShapeProps) {
    this.vertices = properties.vertices;

  }

  getEdges() {
    var edges: Edge[] = [];
    for (var i = 0; i < this.vertices.length; i++) {
      var edge: Edge = new Edge({ A1: this.vertices[i], A2: this.vertices[i + 1 == this.vertices.length ? 0 : i + 1]});
      edges.push(edge);
    }
    return edges;
  }

  getAxes() {
    var axes: Vector2D[] = [];
    // loop over the vertices
    for (var i = 0; i < this.vertices.length; i++) {
      console.log(this.vertices[i + 1 == this.vertices.length ? 0 : i + 1])
      // get the current vertex
      var p1: Vector2D = new Vector2D(this.vertices[i]);
      // get the next vertex
      var p2: Vector2D = new Vector2D(this.vertices[i + 1 == this.vertices.length ? 0 : i + 1]);
      // subtract the two to get the edge vector
      var edge: Vector2D = new Vector2D(p1.subtract(p2));
      // get either perpendicular vector
      var normal: Vector2D = new Vector2D(edge.perp());
      // the perp method is just (x, y) => (-y, x) or (y, -x)
      axes.push(normal);
    }
    return axes;
  }

  project(axis: Vector2D) {
    var min: number = axis.dot(this.vertices[0]);
    var max: number = min;
    for (var i = 1; i < this.vertices.length; i++) {
      // NOTE: the axis must be normalized to get accurate projections
      var p: number = axis.dot(this.vertices[i]);
      if (p < min) {
        min = p;
      } else if (p > max) {
        max = p;
      }
    }
    var proj: Projection = new Projection({min: min, max: max});
    return proj;
  }
}

class Edge {
  A1: Vector2D;
  A2: Vector2D;
  constructor(properties: EdgeProps) {
    this.A1 = properties.A1;
    this.A2 = properties.A2;
  }
}

interface EdgeProps {
  A1: Vector2D;
  A2: Vector2D;
}

interface ShapeProps {
  vertices: Vector2D[];
}

class Projection {
  min: number;
  max: number;
  constructor(properties: ProjectionProps) {
    this.min = properties.min;
    this.max = properties.max;
  }
  overlap(p2: Projection){
    var isOverlapping: boolean = false;
    if (
      this.max >= p2.min && this.max <= p2.max ||
      this.min >= p2.min && this.min <= p2.max ||
      p2.min >= this.min && p2.min <= this.max ||
      p2.max >= this.min && p2.max <= this.max
      )
    {
      isOverlapping = true;
    }
    return isOverlapping;
  }
}

interface ProjectionProps {
  min: number;
  max: number;
}

interface LineCollisonResult {
  isColliding: boolean;
  intersection: Vector2D;
}

class VisGraph {
  nodes: VGnode[];
  constructor() {
    this.nodes = [];
  }
  addNode(node: VGnode) {
    var newNode: VGnode = new VGnode(node);
    this.nodes.push(newNode);
  }
  removeNode(id: number) {
    // loop through all visible nodes
    //for (var j = 0; j < this.nodes.length; j++) {
      for (var i = 0; i < this.nodes[id].visibleNodes.length; i++) {
        this.nodes[this.nodes[id].visibleNodes[i].id].removeVisible(id);
      }
      this.nodes.splice(id, 1);
    //}
  }
}

class VGnode {
  id: number;
  pos: Vector2D;
  visibleNodes: VGnodeEntry[];
  prev: number;
  distanceFromSource: number;
  constructor(properties: VGnodeProps) {
    this.id = properties.id;
    this.visibleNodes = properties.visibleNodes || [];
    this.pos = properties.pos;
    this.prev = properties.prev || -1;
    this.distanceFromSource = properties.distanceFromSource || Infinity;
  }
  addVisible(nodeEntry: VGnodeEntry) {
    this.visibleNodes.push(nodeEntry);
  }
  removeVisible(id: number) {
    for (var i = 0; i < this.visibleNodes.length; i++) {
      if (this.visibleNodes[i].id == id) {
        // remove this entry
        this.visibleNodes.splice(i, 1);
        return;
      }
    }
  }
}

interface VGnodeProps {
  id: number;
  pos: Vector2D;
  visibleNodes?: VGnodeEntry[];
  prev?: number;
  distanceFromSource?: number;
}

class VGnodeEntry {
  id: number;
  distance: number;
  constructor(properties: VGnodeEntryProps) {
    this.id = properties.id;
    this.distance = properties.distance;
  }
}

interface VGnodeEntryProps {
  id: number;
  distance: number;
}

class Scenery {
  rect: Rect;
  shape: Shape;
  edges: Edge[];
  nodes: Vector2D[];
  constructor(properties: SceneryProps) {
    this.rect = properties.rect;
    this.shape = this.rect.convertToShape();
    this.edges = this.shape.getEdges();
    var c: number = 8;
    var node0: Vector2D = new Vector2D({ x: this.shape.vertices[0].x - c, y: this.shape.vertices[0].y - c });
    var node1: Vector2D = new Vector2D({ x: this.shape.vertices[1].x - c, y: this.shape.vertices[1].y + c });
    var node2: Vector2D = new Vector2D({ x: this.shape.vertices[2].x + c, y: this.shape.vertices[2].y + c });
    var node3: Vector2D = new Vector2D({ x: this.shape.vertices[3].x + c, y: this.shape.vertices[3].y - c });
    this.nodes = [];
    this.nodes.push(node0);
    this.nodes.push(node1);
    this.nodes.push(node2);
    this.nodes.push(node3);
  }
}

interface SceneryProps {
  rect: Rect;
}



