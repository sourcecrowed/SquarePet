import PhysicsObject from "./PhysicsObject"

export default class PhysicsBox {
  private physicsObjects: PhysicsObject[] = [];

  x: number;
  y: number;
  width: number;
  height: number;
  gravity: number = .5;
  gravityDirectionInRads: number = Math.PI / 2;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public addObject(obj: PhysicsObject) {
    this.updateObjBounds(obj);
    this.physicsObjects.push(obj);
  }

  private updateObjPhysics(obj: PhysicsObject) {
    obj.applyAcceleration(this.gravityDirectionInRads, this.gravity);
    obj.onPhysicsUpdate();
  }

  private updateObjBounds(obj: PhysicsObject) {
    let getCoordUpdate = (c: number, speed: number, size: number,
                          minBound: number, boundSize: number) => {
      let bounce = false;
      let maxBound = minBound + boundSize;

      if (c < minBound) {
        bounce = true;
        c = minBound;
        speed *= -1;
      } else if ((c + size) > maxBound) {
        bounce = true;
        c = maxBound - size;
        speed *= -1;
      }

      return {c : c, speed : speed, bounced : bounce};
    };

    let updatedX =
        getCoordUpdate(obj.x, obj.speedX, obj.width, this.x, this.width);
    let updatedY =
        getCoordUpdate(obj.y, obj.speedY, obj.height, this.y, this.height);

    obj.x = updatedX.c;
    obj.y = updatedY.c;
    obj.speedX = updatedX.speed;
    obj.speedY = updatedY.speed;

    if (updatedX.bounced || updatedY.bounced)
      obj.onBounce();
  }

  public updatePhysics() {
    for (var i = 0; i < this.physicsObjects.length; ++i) {
      this.updateObjPhysics(this.physicsObjects[i]);
      this.updateObjBounds(this.physicsObjects[i]);
    }
  }

  public drawAsRect(innerColor: string, outerColor: string,
                    context: CanvasRenderingContext2D) {
    const margin: number = 5;

    context.fillStyle = outerColor;
    context.fillRect(this.x - margin, this.y - margin,
                     this.width + (margin * 2), this.height + (margin * 2));

    context.fillStyle = innerColor;
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  public drawObjects(context: CanvasRenderingContext2D) {
    for (var i = 0; i < this.physicsObjects.length; ++i) {
      this.physicsObjects[i].draw(context);
    }
  }
}
