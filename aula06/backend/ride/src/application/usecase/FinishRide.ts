import Queue from '../../infra/queue/Queue';
import RideRepository from '../../infra/repository/RideRepository';

export default class FinishRide{
  constructor(readonly rideRepository: RideRepository, readonly queue: Queue){}

  async execute({rideId}:Input){
    const ride = await this.rideRepository.get(rideId)
    if (!ride)  throw new Error('Ride does not exist')
    ride.finish()
    await this.rideRepository.update(ride)
    await this.queue.publish("rideCompleted",{rideId: ride.rideId})
  } 
}

type Input = {
	rideId: string,
}
