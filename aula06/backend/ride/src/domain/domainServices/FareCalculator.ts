
export default interface FareCalculator{
  calculate(distance:number): number
}

export class NormalFareCalculator implements FareCalculator{
  FARE=2.1

  calculate(distance: number): number {
    return distance * this.FARE
  }
}
export class OverNightFareCalculator implements FareCalculator{
  FARE=3.9

  calculate(distance: number): number {
    return distance * this.FARE
  }
}
export class SundayFareCalculator implements FareCalculator{
  FARE=2.9

  calculate(distance: number): number {
    return distance * this.FARE
  }
}

export class FareCalculatorFactory{
  static create(date: Date){
		if(date.getDay() === 0)return new SundayFareCalculator()
    if(date.getHours() > 22 || date.getHours()<6)return new OverNightFareCalculator()
		if(date.getHours() <= 22 && date.getHours()>=6)return new NormalFareCalculator()
    throw new Error()
  }
}