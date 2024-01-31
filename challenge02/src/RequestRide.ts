import AccountDAO from './AccountDAO'
import RideDAO from './RideDAO'

export default class RequestRide{
  constructor (
    readonly accountDAO: AccountDAO,
    readonly rideDAO: RideDAO
    ) {
	}

  async execute(input:any):Promise<any>{
    const passenger = await this.accountDAO.getById(input.passengerId)
    if(!passenger)throw new Error('User Not found')
    if(!passenger.is_passenger)throw new Error('User is not a passenger')
    const [activeRide] = await this.rideDAO.getActiveRidesByPassengerId(input.passengerId)
    if(activeRide) throw new Error('Passenger has an active ride')
    input.rideId = crypto.randomUUID()
    input.status = "requested"
    input.date = new Date()
    await this.rideDAO.save(input)
    return { rideId: input.rideId }
  }
}