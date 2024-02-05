import Ride from '../../domain/Ride';
import AccountRepository from '../../infra/repository/AccountRepository';
import RideRepository from '../../infra/repository/RideRepository';


export default class StartRide{
  constructor(readonly rideRepository: RideRepository, readonly accountRepository: AccountRepository){}

  async execute({rideId}:Input){
    const ride = await this.rideRepository.get(rideId)
    if (!ride)  throw new Error('Ride does not exist')
    if(ride && ride.status !== "accepted") throw new Error('Invalid status for start ride');
    const newRide = Ride.changeStatus(ride, "in_progress")
    await this.rideRepository.update(newRide)
  } 
}

type Input = {
	rideId: string,
}
