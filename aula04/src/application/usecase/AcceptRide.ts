import crypto from "crypto";
import AccountRepository from "../../infra/repository/AccountRepository";
import RideRepository from "../../infra/repository/RideRepository";
import Ride from "../../domain/Ride";

export default class AcceptRide {

	constructor (readonly rideRepository: RideRepository, readonly accountRepository: AccountRepository) {

	}

	async execute (input: Input): Promise<Output> {
		const ride = await this.rideRepository.get(input.rideId)
		return {
			rideId: ride.
		};
	}
}

type Input = {
	rideId: string,
	driverId: string
}


type Output  = {
	rideId: string
}
