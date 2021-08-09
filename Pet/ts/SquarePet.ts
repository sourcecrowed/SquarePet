import Mathz from './Mathz';
import NameGenerator from './NameGenerator';
import PhysicsBox from './PhysicsBox';
import PhysicsObject from './PhysicsObject';
import SquarePetEyeBlink from './SquarePetEyeBlink';
import SquarePetEyes from './SquarePetEyes';
import SquarePetSleep from './SquarePetSleep';

function getRandomSquarePetColor() {
  let colors: string[] = [
    'red', 'blue', 'yellow', 'green', 'white', 'black', 'orange', 'purple',
    'Cornsilk', 'Aqua', 'Crimson', 'DarkGoldenRod', 'DarkOliveGreen',
    'DarkOrchid', 'DarkMagenta', 'DarkSeaGreen', 'DeepSkyBlue', 'GreenYellow',
    'HotPink'
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}

export default class SquarePet extends PhysicsObject {
  name: string;

  color: string;
  secondaryColor: string;

  eyes: SquarePetEyes;
  sleep: SquarePetSleep;
  eyeBlink: SquarePetEyeBlink;

  bounce: number;

  chanceBumpRarity: number;
  chanceBump: number;
  chanceBumpSpeed: number;

  constructor(pb: PhysicsBox) {
    super(pb.x + pb.width / 2, pb.y + pb.height / 2, 10 + Math.random() * 100,
          10 + Math.random() * 100);

    this.name = NameGenerator.generateRomajiName(3, 3 + Math.random() * 10);

    this.color = getRandomSquarePetColor();
    this.secondaryColor = getRandomSquarePetColor();

    this.eyes = new SquarePetEyes(this.width, this.height);
    this.sleep = new SquarePetSleep();
    this.eyeBlink = new SquarePetEyeBlink();

    this.bounce = Math.random();

    this.chanceBumpRarity = 40 + Math.floor(Math.random() * 100);
    this.chanceBump = Math.floor(Math.random() * this.chanceBumpRarity);
    this.chanceBumpSpeed = 5 + Math.floor(Math.random() * 10);

    this.onPhysicsUpdateFunctions.push(this.physicsUpdateFunction);
    this.onBounceFunctions.push(this.bounceFunction);
    this.onDrawFunctions.push(this.drawFunction);
  }

  private bounceFunction(p: SquarePet) {
    p.applyAcceleration(p.getDirectionAngle(), -(p.getSpeed() * .25));
    p.applyAcceleration(p.getDirectionAngle(), -(p.getSpeed() * .25));
  }

  public isAwake() { return this.sleep.sleepingRem <= 0; }

  public isAsleep() { return this.sleep.sleepingRem > 0; }

  private sleepUpdate(p: SquarePet) {
    if (p.isAsleep()) {

      --p.sleep.sleepingRem;

      if (--p.sleep.zzzToggleFlipRem == 0) {
        p.sleep.zzzToggleFlipRem = 10;

        if (p.sleep.zzzToggleFlip == 0) {
          p.sleep.zzzToggleFlip = 1;
        } else if (p.sleep.zzzToggleFlip == 1) {
          p.sleep.zzzToggleFlip = 0;
        }
      }
    } else {
      if (Math.floor(Math.random() * p.sleep.sleepingChanceMax) ==
          p.sleep.sleepingChance) {
        p.sleep.sleepingGap = 100 + Math.floor(Math.random() * 500);
        p.sleep.sleepingRem = p.sleep.sleepingGap;
      }
    }
  }

  private eyeBlinkUpdate(p: SquarePet) {
    if (p.isAwake()) {
      if (p.eyeBlink.blinkRem > 0) {
        --p.eyeBlink.blinkRem;
      } else {
        if (Math.floor(Math.random() * p.eyeBlink.blinkFreq) ==
            p.eyeBlink.blinkLotto) {
          p.eyeBlink.blinkRem = p.eyeBlink.blinkDur;
        }
      }
    }
  }

  private eyeUpdate(p: SquarePet)
  {
    let e = p.eyes;
    let pSpeed = p.getSpeed();
    let pAngle = p.getDirectionAngle();

    if (Math.abs(pSpeed) > p.chanceBumpSpeed / 3)
    {
      e.eyeAngleTarget = (e.eyeAngleTarget + pAngle) / 2;
      e.eyeDistFromCenterTarget = (e.eyeDistFromCenterTarget + (pSpeed / p.chanceBumpSpeed * (e.eyeSize / 2))) / 2;
    }

    if (Math.floor(Math.random() * e.eyeMoveRarity) == e.eyeMoveLotto)
    {
      e.eyeAngleTarget = (e.eyeAngleTarget + (-Math.PI + Math.random() * (Math.PI * 2)) / 2);
      e.eyeDistFromCenterTarget = (e.eyeDistFromCenterTarget + (Math.random() * (e.eyeSize / 2))) / 2;
    }

    e.eyeAngle = (e.eyeAngleTarget + e.eyeAngle) / 2;
    e.eyeDistFromCenter = (e.eyeDistFromCenterTarget + e.eyeDistFromCenter) / 2;

    Mathz.slowWrap(-Math.PI, Math.PI, e.eyeAngle);
    Mathz.slowWrap(-Math.PI, Math.PI, e.eyeAngleTarget);

/*
    let speed = p.getSpeed();
    e.eyeAngleTarget = p.getDirectionAngle();
*/

    /*
    if (e.eyeAngle < e.eyeAngleTarget) {
      e.eyeSpeed += e.eyeAccel * (speed / p.chanceBumpSpeed);
      e.eyeAngle += e.eyeSpeed;

      if (e.eyeAngle >= e.eyeAngleTarget) {
        e.eyeAngle = e.eyeAngleTarget;
        e.eyeSpeed = 0;
      }
    } else if (e.eyeAngle > e.eyeAngleTarget) {
      e.eyeSpeed -= e.eyeAccel * (speed / p.chanceBumpSpeed);
      e.eyeAngle += e.eyeSpeed;

      if (e.eyeAngle <= e.eyeAngleTarget) {
        e.eyeAngle = e.eyeAngleTarget;
        e.eyeSpeed = 0;
      }
    }
    */

    // let diffAngle = angle - eyeAngle;

    //e.eyeDistFromCenter = Math.abs((e.eyeSpeed * 10 * (e.eyeSize / 2)));

    if (e.eyeDistFromCenter > e.eyeSize / 2)
      e.eyeDistFromCenter = e.eyeSize / 2;
  }

  private bumpUpdate(p: SquarePet) {
    if (p.isAwake()) {
      if (Math.floor(Math.random() * p.chanceBumpRarity) == p.chanceBump) {
        p.eyeBlink.blinkRem = p.eyeBlink.blinkDur;
        p.applyAcceleration(Math.PI / 4 + Math.random() * (Math.PI / 4 * 3),
                            p.chanceBumpSpeed);
      }
    }
  }

  private physicsUpdateFunction(p: SquarePet) {
    p.sleepUpdate(p);
    p.eyeBlinkUpdate(p);
    p.bumpUpdate(p);
    p.eyeUpdate(p);
  }

  private drawFunction(p: SquarePet, ctx: CanvasRenderingContext2D) {
    // Create gradient
    var grd = ctx.createLinearGradient(p.x, p.y + p.height, p.x + p.width,
                                       p.y + p.height);

    // Set the square's gradient with its primary and secondary colors.
    grd.addColorStop(0, p.color);
    grd.addColorStop(1, p.secondaryColor); //'black');

    // Fill the square with gradient.
    ctx.fillStyle = grd;
    ctx.fillRect(p.x, p.y, p.width, p.height);

    // Calculate eye positions.
    let eyeX1 = p.x + p.eyes.eyeMarginX;
    let eyeX2 = p.x + p.width - p.eyes.eyeMarginX;
    let eyeY = p.y + p.eyes.eyeMarginY;

    // Determine the eye white color - sleeping or not?
    let eyeWhiteColor: string =
        (p.sleep.sleepingRem > 0 || p.eyeBlink.blinkRem > 0) ? 'black' : 'white';

    // Draw the first eye whites.
    ctx.beginPath();
    ctx.arc(eyeX1, eyeY, p.eyes.eyeSize, 0, 2 * Math.PI, false);
    ctx.lineWidth = 3;
    ctx.fillStyle = eyeWhiteColor;
    ctx.fill();

    // Draw the second eye whites.
    ctx.beginPath();
    ctx.arc(eyeX2, eyeY, p.eyes.eyeSize, 0, 2 * Math.PI, true);
    ctx.lineWidth = 3;
    ctx.fillStyle = eyeWhiteColor;
    ctx.fill();

    // Draw the first eye pupil.
    ctx.beginPath();
    ctx.arc(eyeX1 + Math.cos(p.eyes.eyeAngle) * p.eyes.eyeDistFromCenter,
            eyeY + Math.sin(p.eyes.eyeAngle) * p.eyes.eyeDistFromCenter, p.eyes.eyeSize / 2, 0,
            2 * Math.PI, true);
    ctx.lineWidth = p.eyes.eyeSize / 4;
    ctx.fillStyle = '#000000';
    ctx.fill();

    // Draw the second eye pupil.
    ctx.beginPath();
    ctx.arc(eyeX2 + Math.cos(p.eyes.eyeAngle) * p.eyes.eyeDistFromCenter,
            eyeY + Math.sin(p.eyes.eyeAngle) * p.eyes.eyeDistFromCenter, p.eyes.eyeSize / 2, 0,
            2 * Math.PI, true);
    ctx.lineWidth = p.eyes.eyeSize / 4;
    ctx.fillStyle = '#000000';
    ctx.fill();

    // Update Zz's if sleeping.
    if (p.isAsleep()) {
      let yOffset: number = 0;
      let xOffset: number = 0;

      if (p.sleep.zzzToggleFlip == 0) {
        ctx.font = '15px serif';
        yOffset = -10;
      } else {
        ctx.font = "25px serif";
        yOffset = -20;
        xOffset = -10
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.fillText("Z", p.x + xOffset, p.y + yOffset);
    }
  }
}
