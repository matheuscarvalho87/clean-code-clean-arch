import Coord from '../vo/Coord';
import crypto from 'node:crypto'

export default class Position{
  private coord: Coord

  constructor(readonly positionId:string, readonly rideId:string,  lat:number, long: number, readonly date:Date){
    this.coord = new Coord(lat, long)
  }

  static create (rideId: string, lat: number, long: number) {
		const positionId = crypto.randomUUID();
		const date = new Date();
		return new Position(positionId,rideId,lat,long,date);
	}
  static restore (positionId:string, rideId: string, lat: number, long: number, date:Date) {
		return new Position(positionId,rideId,lat,long,date);
	}
  
  getLat(){
    return this.coord.getLat()
  }
  getLong(){
    return this.coord.getLong()
  }
}