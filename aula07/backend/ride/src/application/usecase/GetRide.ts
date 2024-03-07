import RideRepository from "../../infra/repository/RideRepository";
import AccountGateway from '../gateway/AccountGateway';

// O Ride em questão, não é a entidade Ride, é o conceito Ride que é resultado da junção de informações de Ride e de Accont
export default class GetRide {

	constructor (readonly rideRepository: RideRepository, readonly accountGateway: AccountGateway) {
	}

	async execute (rideId: string): Promise<Output> {
		// let driver: Account | undefined 
		const ride = await this.rideRepository.get(rideId);
		if (!ride) throw new Error("Ride not found");
		const passenger = await this.accountGateway.getById(ride.passengerId);
		if (!passenger) throw new Error("Passenger not found");
		// if(ride.getDriverId()!== undefined){
		//   driver = await this.accountRepository.getById(ride.getDriverId());
		// 	if (!driver) throw new Error("Driver not found");
		// }
		return {
			passengerId: ride.passengerId,
			driverId: ride?.getDriverId(),
			rideId: ride.rideId,
			fromLat: ride.getFromLat(),
			fromLong: ride.getFromLong(),
			toLat: ride.getToLat(),
			toLong: ride.getToLong(),
			status: ride.getStatus(),
			lastLat: ride.getLastLat(),
			lastLong: ride.getLastLong(),
			distance: ride.getDistance(),
			date: ride.date,
			fare: ride.getFare(),
			passengerName: passenger.name,
			// driverName: driver?.name
		}
	}
}

type Output = {
	passengerId: string,
	driverId?: string | null,
	rideId: string,
	fromLat: number,
	fromLong: number,
	toLat: number,
	toLong: number,
	status: string,
	lastLat: number,
	lastLong: number,
	distance: number,
	date: Date,
	fare: number,
	passengerName: string
	// driverName?: string
}