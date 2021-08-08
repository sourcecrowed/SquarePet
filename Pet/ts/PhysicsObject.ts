
export default class PhysicsObject {
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
  speedX: number = 0;
  speedY: number = 0;

  public onDrawFunctions: Function[] = [];
  public onPhysicsUpdateFunctions: Function[] = [];
  public onBounceFunctions: Function[] = [];

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.onPhysicsUpdateFunctions.push(() => {
      this.x += this.speedX;
      this.y += this.speedY;
    })
  }

  applyAcceleration(angleInRads: number, amount: number) {
    this.speedX += Math.cos(angleInRads) * amount;
    this.speedY += Math.sin(angleInRads) * amount;
  }

  move(x: number, y: number) {
    this.x += x;
    this.y += y;
  }

  getDirectionAngle() { return Math.atan2(this.speedY, this.speedX); }

  getSpeed() {
    return Math.sqrt((this.speedX * this.speedX) + (this.speedY * this.speedY));
  }

  onPhysicsUpdate() {
    for (var i = 0; i < this.onPhysicsUpdateFunctions.length; ++i) {
      this.onPhysicsUpdateFunctions[i](this);
    }
  }

  onBounce() {
    for (var i = 0; i < this.onBounceFunctions.length; ++i) {
      this.onBounceFunctions[i](this);
    }
  }

  draw(context: CanvasRenderingContext2D) {
    for (var i = 0; i < this.onDrawFunctions.length; ++i)
      this.onDrawFunctions[i](this, context);
  }

  drawAsRect(color: string, context: CanvasRenderingContext2D) {
    context.fillStyle = color;
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}
