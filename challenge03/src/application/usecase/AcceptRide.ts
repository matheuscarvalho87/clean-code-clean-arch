import Ride from '../../domain/Ride';
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
    if(ride && ride.status !== "requested") throw new Error('Invalid status for acceptance');

    const [driverInAnotherRide] = await this.rideRepository.getAcceptedOrInProgressRidesByDriverId(driverId)
    if(driverInAnotherRide)  throw new Error('You are already in another trip')
    const newRide = Ride.acceptRide(ride, driverId)
    console.log({newRide})
    await this.rideRepository.update(newRide)
  } 
}

type Input = {
	rideId: string,
	driverId: string,
}
