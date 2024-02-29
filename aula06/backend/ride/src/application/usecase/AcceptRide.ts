import RideRepository from '../../infra/repository/RideRepository';
import AccountGateway from '../gateway/AccountGateway';


export default class AcceptRide{
  constructor(readonly rideRepository: RideRepository, readonly accountGateway: AccountGateway){}

  async execute({rideId,driverId}:Input){
    const driver = await this.accountGateway.getById(driverId);
    if(!driver) throw new Error('Driver not found');
    if(!driver.isDriver) throw new Error("User is not a Driver");

    const ride = await this.rideRepository.get(rideId)
    if (!ride)  throw new Error('Ride does not exist')
    
    const hasAnotherRide = await this.rideRepository.getAcceptedOrInProgressRidesByDriverId(driverId)
    if(hasAnotherRide)  throw new Error('Driver already in another trip')

    ride.accept(driverId)
    await this.rideRepository.update(ride)
  } 
}

type Input = {
	rideId: string,
	driverId: string,
}
