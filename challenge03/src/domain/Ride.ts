import crypto from "crypto";

export default class Ride {

	private constructor (readonly rideId: string, readonly passengerId: string, 
		readonly fromLat: number, readonly fromLong: number, readonly toLat: number,
		readonly toLong: number, private status: string, readonly date: Date,
		private driverId?:string ) {
	}

	static create (passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
		const rideId = crypto.randomUUID();
		const status = "requested";
		const date = new Date();
		return new Ride(rideId, passengerId, fromLat, fromLong, toLat, toLong, status, date);
	}

	static restore (rideId: string, passengerId: string, fromLat: number, fromLong: number, 
		toLat: number, toLong: number, status: string, date: Date, driverId?:string ) {
		return new Ride(rideId, passengerId, fromLat, fromLong, toLat, toLong, status, date,  driverId);
	}

	accept(driverId:string){
		if(this.status !== "requested") throw new Error('Invalid status for acceptance');
		this.status = "accepted";
		this.driverId=driverId
	}
	start(){
		if(this.status !== "accepted") throw new Error('Invalid status for start ride');
		this.status = "in_progress";
	}

	getStatus(){
		return this.status;
	}
	getDriverId(){
		return this.driverId;
	}
}