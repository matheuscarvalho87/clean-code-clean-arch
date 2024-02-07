import AccountRepository from '../../infra/repository/AccountRepository';
import RideRepository from '../../infra/repository/RideRepository';


export default class AcceptRide{
  constructor(readonly rideRepository: RideRepository, readonly accountRepository: AccountRepository){}

  async execute({rideId,driverId}:Input){
    const driver = await this.accountRepository.getById(driverId);
    if(!driver) throw new Error('Driver not found');
    if(!driver.isDriver) throw new Error("User is not a Driver");

    const ride = await this.rideRepository.get(rideId)
    if (!ride)  throw new Error('Ride does not exist')
    
    // const [driverInAnotherRide] = await this.rideRepository.getAcceptedOrInProgressRidesByDriverId(driverId)
    // console.log('DRIVERINANOTHERRIDE',driverInAnotherRide)
    // if(driverInAnotherRide)  throw new Error('Driver already in another trip')

    ride.accept(driverId)
    console.log({ride})
    await this.rideRepository.update(ride)
  } 
}

type Input = {
	rideId: string,
	driverId: string,
}
