import pgp from "pg-promise";


export default interface RideDAO {
  save(ride:any):Promise<void>
  getById(rideId: string):Promise<any>
  getActiveRidesByPassengerId(passengerId:string): Promise<any>
}

export class RideDAODatabase implements RideDAO {
  async save(ride: any){
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		await connection.query("insert into cccat15.ride (ride_id, passenger_id, driver_id, status, fare, from_lat, from_long, to_lat,to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", 
    [ride.rideId, ride.passengerId, ride.driverId, ride.status, ride.fare, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.date]);
		await connection.$pool.end();
  }

  async getById(rideId: string){
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		const [ride] = await connection.query("select * from cccat15.ride where ride_id = $1", [rideId]);
		await connection.$pool.end();
		return ride;
  }

  async getActiveRidesByPassengerId(passengerId: string): Promise<any> {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		const activeRidesData = await connection.query("select * from cccat15.ride where passenger_id = $1 and status = 'requested'", [passengerId]);
    const activeRides: any[] = [];
		for (const activeRideData of activeRidesData) {
			activeRides.push(activeRideData);
		}
    await connection.$pool.end();
		return activeRides;
  }
}