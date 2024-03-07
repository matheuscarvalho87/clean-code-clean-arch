import DomainEvent from '../../domain/event/DomainEvent';
import RideCompletedEvent from '../../domain/event/RideCompletedEvent';
import Mediator from '../../infra/mediator/mediator';
import Queue from '../../infra/queue/Queue';
import RideRepository from '../../infra/repository/RideRepository';

export default class FinishRide{
  constructor(readonly rideRepository: RideRepository, readonly mediator: Mediator,readonly queue: Queue){}

  async execute({rideId}:Input){
    const ride = await this.rideRepository.get(rideId)
    if (!ride)  throw new Error('Ride does not exist')
    ride.register("rideCompleted", async(event:DomainEvent)=>{
      await this.queue.publish(event.name,event)
    })
    ride.finish()
    await this.rideRepository.update(ride)
    // await this.queue.publish(event.name,event)
  } 
}

type Input = {
	rideId: string,
}
