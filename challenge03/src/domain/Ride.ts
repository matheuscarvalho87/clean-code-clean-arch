import crypto from "crypto";

export default class Ride {

	private constructor (readonly rideId: string, readonly passengerId: string, readonly fromLat: number, readonly fromLong: number, readonly toLat: number, readonly toLong: number, readonly status: string, readonly date: Date, readonly driverId:string | null) {
	}

	static create (passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
		const rideId = crypto.randomUUID();
		const status = "requested";
		const date = new Date();
		const driverId = null
		return new Ride(rideId, passengerId, fromLat, fromLong, toLat, toLong, status, date, driverId);
	}

	static restore (rideId: string, passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number, status: string, date: Date, driverId:string | null) {
		return new Ride(rideId, passengerId, fromLat, fromLong, toLat, toLong, status, date,  driverId);
	}

	static acceptRide(ride:Ride, driverId:string){
		const status = "accepted"
		return new Ride(ride.rideId, ride.passengerId, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, status, ride.date,  driverId)
	}
	static changeStatus(ride:Ride,status:string){
		return new Ride(ride.rideId, ride.passengerId, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, status, ride.date,  ride.driverId)
	}
}