import Ride from "../../domain/Ride";
import DatabaseConnection from "../database/DatabaseConnection";
	
// Port
export default interface RideRepository {
	save (ride: Ride): Promise<void>;
	update(ride:Ride): Promise<void>
	get (rideId: string): Promise<Ride | undefined>;
	getActiveRidesByPassengerId (passengerId: string): Promise<Ride[]>;
	getAcceptedOrInProgressRidesByDriverId (driverId: string): Promise<Ride[]>;
}

// Adapter Database
export class RideRepositoryDatabase implements RideRepository {

	constructor (readonly connection: DatabaseConnection) {
	}

	async save (ride: Ride) {
		await this.connection.query("insert into cccat15.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date,driver_id) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)", [ride.rideId, ride.passengerId, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.getStatus(), ride.date, ride.getDriverId()]);
	}

	async update(ride: Ride): Promise<void> {
		await this.connection.query("update cccat15.ride set status = $1, driver_id = $2 where ride_id = $3", [ride.getStatus(), ride.getDriverId(), ride.rideId]);
	}

	async get (rideId: string) {
		const [ride] = await this.connection.query("select * from cccat15.ride where ride_id = $1", [rideId]);
		if (!ride) return;
		return Ride.restore(ride.ride_id, ride.passenger_id, parseFloat(ride.from_lat), parseFloat(ride.from_long), parseFloat(ride.to_lat), parseFloat(ride.to_long), ride.status, ride.date, ride.driver_id);
	}

	async getActiveRidesByPassengerId (passengerId: string) {
		const activeRidesData = await this.connection.query("select * from cccat15.ride where passenger_id = $1 and status = 'requested'", [passengerId]);
		const activeRides: Ride[] = [];
		for (const activeRideData of activeRidesData) {
			activeRides.push(Ride.restore(activeRideData.ride_id, activeRideData.passenger_id, parseFloat(activeRideData.from_lat), parseFloat(activeRideData.from_long), parseFloat(activeRideData.to_lat), parseFloat(activeRideData.to_long), activeRideData.status, activeRideData.date, activeRideData.driver_id));
		}
		return activeRides;
	}

	async getAcceptedOrInProgressRidesByDriverId(driverId: string): Promise<Ride[]> {
		const acceptedRidesData = await this.connection.query("select * from cccat15.ride where driver_id = $1 and status = 'accepted' or status='in_progress'", [driverId]);
		const acceptedRides: Ride[] = [];
		for (const acceptedRideData of acceptedRidesData) {
			acceptedRides.push(Ride.restore(acceptedRideData.ride_id, acceptedRideData.passenger_id, parseFloat(acceptedRideData.from_lat), parseFloat(acceptedRideData.from_long), parseFloat(acceptedRideData.to_lat), parseFloat(acceptedRideData.to_long), acceptedRideData.status, acceptedRideData.date, acceptedRideData.driver_id));
		}
		return acceptedRides;
	}
}