
export default class Mathz
{
  // Wrap a number using the slow method.
  static slowWrap(min: number, max: number, val: number)
  {
    if (min >= max)
      throw 'Min is greater than or equal to max!';

    let diff: number = Math.abs(max - min);

    while(val < min)
    {
      val += diff;
    }

    while (val > max)
    {
      val -= diff;
    }
  }
}
