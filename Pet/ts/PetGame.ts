import PhysicsBox from "./PhysicsBox"
import PhysicsObject from "./PhysicsObject"
import SquarePet from "./SquarePet"

export default class PetGame {
  sleepTimeMs: number = 16;

  drawBackground(color: string, canvas: HTMLCanvasElement,
                 context: CanvasRenderingContext2D) {
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  async run() {

    let canvas = <HTMLCanvasElement>document.getElementById('draw_canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let context = <CanvasRenderingContext2D>canvas.getContext('2d');

    let boxes: PhysicsBox[] = [];
    let boxStartX: number = 100;
    let lastBoxX: number = boxStartX;
    let lastBoxY: number = 100;
    let boxWidth: number = 150;
    let boxHeight: number = 150;
    let boxSpacing: number = 30;

    // var img = new Image(50, 50);
    // img.src =
    // "https://animals.net/wp-content/uploads/2018/08/Tanuki-3-650x425.jpg";

    let addBox = () => {
      let pb = new PhysicsBox(lastBoxX, lastBoxY, boxWidth, boxHeight);
      let sp = new SquarePet(pb);

      sp.onDrawFunctions.push((p: SquarePet, ctx: CanvasRenderingContext2D) =>
      {
        // ctx.drawImage(img, p.x, p.y);
        ctx.font = '15px serif';
        ctx.fillStyle = '#acc0c3';
        ctx.fillText(p.name, pb.x, pb.y - 10);
      });

      pb.addObject(sp);

      lastBoxX += boxWidth + boxSpacing;

      if (lastBoxX + boxWidth > canvas.width) {
        lastBoxY += boxHeight + boxSpacing;
        lastBoxX = boxStartX;
      }

      boxes.push(pb);
    };

    while (lastBoxY + boxHeight < canvas.height)
      addBox();

    while (true) {
      this.drawBackground('#3e4b4d', canvas, context);

      for (var i = 0; i < boxes.length; ++i) {
        boxes[i].updatePhysics();
        boxes[i].drawAsRect('#a0a08f', '#63635a', context);
        boxes[i].drawObjects(context);
      }

      await new Promise(resolve => setTimeout(resolve, this.sleepTimeMs));
    }
  }
}
