
export default class SquarePetEyes
{
  static minEyeMoveRarity: number = 5;
  static maxEyeMoveRarity: number = 100;
  eyeMoveRarity: number;
  eyeMoveLotto: number;

  eyeSpringBackMultiplier: number = .8;
  eyeAngleTarget: number;
  eyeAngle: number;
  eyeSpeed: number;
  eyeAccel: number;
  eyeMarginX: number;
  eyeMarginY: number;
  eyeSize: number;
  eyeDistFromCenter: number = 0;
  eyeDistFromCenterTarget: number = 0;

  constructor(squarePetWidth: number,
              squarePetHeight: number)
  {
    this.eyeAngleTarget = 0;
    this.eyeAngle = 0; //po.getDirectionAngle();
    this.eyeSpeed = 0;
    this.eyeAccel = Math.PI / 360;
    this.eyeMarginX = squarePetWidth / 3;
    this.eyeMarginY = squarePetHeight / 4;
    this.eyeSize = Math.min(squarePetWidth, squarePetHeight) / 3 / 2;

    this.eyeMoveRarity = SquarePetEyes.minEyeMoveRarity + Math.floor(Math.random() * SquarePetEyes.maxEyeMoveRarity);
    this.eyeMoveLotto = SquarePetEyes.minEyeMoveRarity + Math.floor(Math.random() * this.eyeMoveRarity);
  }
}
