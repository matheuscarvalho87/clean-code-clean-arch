import Position from '../../domain/entity/Position';
import PositionRepository from '../../infra/repository/PositionRepository';
import RideRepository from '../../infra/repository/RideRepository';

export default class UpdatePosition{
  constructor(
    readonly rideRepository: RideRepository,
    readonly positionRepository: PositionRepository
    ){}

  async execute({rideId,lat,long}:Input){
    const ride = await this.rideRepository.get(rideId)
    if (!ride)  throw new Error('Ride does not exist')
    ride.updatePosition(lat,long)
    await this.rideRepository.update(ride)
    const position = Position.create(rideId,lat,long)
    await this.positionRepository.save(position)
  } 
}

type Input = {
	rideId: string,
  lat: number;
  long: number;
}
