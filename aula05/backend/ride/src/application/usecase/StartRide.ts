import RideRepository from '../../infra/repository/RideRepository';

export default class StartRide{
  constructor(readonly rideRepository: RideRepository){}

  async execute({rideId}:Input){
    const ride = await this.rideRepository.get(rideId)
    if (!ride)  throw new Error('Ride does not exist')
    ride.start()
    await this.rideRepository.update(ride)
  } 
}

type Input = {
	rideId: string,
}
