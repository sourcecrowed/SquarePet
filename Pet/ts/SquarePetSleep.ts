
export default class SquarePetSleep
{
  sleepingRem: number;
  sleepingChanceMax: number;
  sleepingChance: number;
  sleepingGap: number;
  zzzToggleFlipRem: number;
  zzzToggleFlip: number;

  constructor()
  {
    this.sleepingRem = 0;
    this.sleepingChanceMax = 2000;
    this.sleepingChance = Math.floor(Math.random() * this.sleepingChanceMax);
    this.sleepingGap = 100 + Math.floor(Math.random() * 500);
    this.zzzToggleFlipRem = 10;
    this.zzzToggleFlip = 0;
  }
}
