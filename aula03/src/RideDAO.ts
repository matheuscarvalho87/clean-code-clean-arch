import pgp from "pg-promise";


export default interface RideDAO {
  save(ride:any):Promise<void>
  getById(rideId: string):Promise<any>
}

export class RideDAODatabase implements RideDAO {
  async save(ride: any){
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		await connection.query("insert into cccat15.ride (ride_id, passenger_id, driver_id, status, fare, from_lat, from_long, to_lat,to_long) values ($1, $2, $3, $4, $5, $6, $7)", 
    [ride.rideId, ride.passangerId, ride.driverId, ride.status, ride.fare, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong]);
		await connection.$pool.end();
  }

  async getById(rideId: string){
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
		const [ride] = await connection.query("select * from cccat15.ride where ride_id = $1", [rideId]);
		await connection.$pool.end();
		return ride;
  }
}

export class RideDAOMemory implements RideDAO{
  rides: any = []
  async save(ride: any): Promise<void> {
    this.rides.push(ride)
  }
  async getById(rideId: string): Promise<any> {
    return this.rides.find((account:any)=> account.rideId === rideId)
  }
}