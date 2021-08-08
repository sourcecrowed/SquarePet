
export default class SquarePetEyeBlink
{
  blinkDur: number;
  blinkRem: number;
  blinkFreq: number;
  blinkLotto: number;

  constructor()
  {
    this.blinkDur = Math.floor(Math.random() * 10);
    this.blinkRem = 0;
    this.blinkFreq = 50 + Math.floor(Math.random() * 50);
    this.blinkLotto = Math.floor(Math.random() * this.blinkFreq);
  }
}
