import AccountDAO from './AccountDAO'
import RideDAO from './RideDAO'


export default class GetRide{
  constructor (
    readonly accountDAO: AccountDAO,
    readonly rideDAO: RideDAO
    ) {
	}

  async execute(input:any):Promise<any>{
    const ride = await this.rideDAO.getById(input)
    if(!ride)throw new Error('Ride not found')
    const passenger = await this.accountDAO.getById(ride.passenger_id)
    return {
      ...ride,
      rideId: ride.ride_id,
      fromLat: ride.from_lat,
      passengerName: passenger.name,
      passengerId: passenger.account_id
    } 
  }
}

