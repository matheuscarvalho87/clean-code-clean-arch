

export default class Coord{
  private lat: number;
  private long:number;

  constructor(lat: number, long: number){
    if(lat  < -90 || lat > 90) throw new Error("Latitude must be between -90 and 90");
    if(long < -180 || long > 180) throw new  Error("Longitude must be between -180 and 180")
    this.lat = lat
    this.long = long
  }

  getLat(){
    return this.lat
  }
  getLong(){
    return this.long
  }
}