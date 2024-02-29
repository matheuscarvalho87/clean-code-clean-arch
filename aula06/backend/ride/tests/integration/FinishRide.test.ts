import { test,expect,beforeEach,afterEach } from '@jest/globals'
import {RideRepositoryDatabase} from '../../src/infra/repository/RideRepository'
import {PositionRepositoryDatabase} from '../../src/infra/repository/PositionRepository'
import {PgPromiseAdapter} from '../../src/infra/database/DatabaseConnection'
import RequestRide  from '../../src/application/usecase/RequestRide'
import GetRide  from '../../src/application/usecase/GetRide'
import AcceptRide  from '../../src/application/usecase/AcceptRide'
import UpdatePosition  from '../../src/application/usecase/UpdatePosition'
import StartRide from '../../src/application/usecase/StartRide'
import GetPositions from '../../src/application/usecase/GetPositions'
import FinishRide from '../../src/application/usecase/FinishRide'
import AccountGatewayHttp from '../../src/infra/gateway/AccountGatewayHttp'
import sinon from 'sinon'
import { AxiosAdapter } from '../../src/infra/http/HttpClient'
import { RabbitMQAdapter } from '../../src/infra/queue/Queue'
let connection : PgPromiseAdapter
let rideRepository: RideRepositoryDatabase
let accountGateway: AccountGatewayHttp
let positionRepository: PositionRepositoryDatabase
let requestRide: RequestRide
let getRide: GetRide
let acceptRide: AcceptRide
let startRide: StartRide
let updatePosition: UpdatePosition
let getPositions: GetPositions
let finishRide: FinishRide
beforeEach(async()=>{
   connection = new PgPromiseAdapter()
	 rideRepository = new RideRepositoryDatabase(connection)
	 accountGateway = new AccountGatewayHttp(new AxiosAdapter())
	 positionRepository = new PositionRepositoryDatabase(connection)
	 requestRide =  new RequestRide(rideRepository,accountGateway)
	 getRide =  new GetRide(rideRepository,accountGateway)
	 acceptRide =  new AcceptRide(rideRepository,accountGateway)
	 startRide = new StartRide(rideRepository)
	 updatePosition =  new UpdatePosition(rideRepository, positionRepository)
	 getPositions =  new GetPositions(positionRepository)
	 const queue = new RabbitMQAdapter()
	 finishRide = new FinishRide(rideRepository,queue)
})

test("should finish a ride in normal hour",async ()=>{
	const dateStub = sinon.useFakeTimers(new Date("2024-02-28T16:00:00-03:00"))
	const inputPassengerSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	};
	const outputPassengerSignup = await accountGateway.signup(inputPassengerSignup)

	const inputDriverSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA9999",
		isDriver: true
	};
	const outputDriverSignup = await  accountGateway.signup(inputDriverSignup)

	const inputRequestRide = {
		passengerId: outputPassengerSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	const outputRequestRide = await requestRide.execute(inputRequestRide)

	const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputDriverSignup.accountId,
	}
	await acceptRide.execute(inputAcceptRide)
	
	const inputStartRide = {
		rideId: outputRequestRide.rideId,
	}
	await startRide.execute(inputStartRide)

	const inputUpdatePosition = {
		rideId: outputRequestRide.rideId,
		lat:-27.496887588317275,
		long:-48.522234807851476
	}
	await updatePosition.execute(inputUpdatePosition)
	const inputFinishRide = {
		rideId: outputRequestRide.rideId
	}
	await finishRide.execute(inputFinishRide)
	const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	
	expect(outputGetRide.fare).toBe(21);
	expect(outputGetRide.status).toBe("completed")
	dateStub.restore()
})

test("should finish a ride in noturn hour",async ()=>{
	const dateStub = sinon.useFakeTimers(new Date("2024-02-28T23:00:00-03:00"))
	const inputPassengerSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	};
	const outputPassengerSignup = await accountGateway.signup(inputPassengerSignup)

	const inputDriverSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA9999",
		isDriver: true
	};
	const outputDriverSignup = await  accountGateway.signup(inputDriverSignup)

	const inputRequestRide = {
		passengerId: outputPassengerSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	const outputRequestRide = await requestRide.execute(inputRequestRide)

	const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputDriverSignup.accountId,
	}
	await acceptRide.execute(inputAcceptRide)
	
	const inputStartRide = {
		rideId: outputRequestRide.rideId,
	}
	await startRide.execute(inputStartRide)

	const inputUpdatePosition = {
		rideId: outputRequestRide.rideId,
		lat:-27.496887588317275,
		long:-48.522234807851476
	}
	await updatePosition.execute(inputUpdatePosition)
	const inputFinishRide = {
		rideId: outputRequestRide.rideId
	}
	await finishRide.execute(inputFinishRide)
	const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	
	expect(outputGetRide.fare).toBe(39);
	expect(outputGetRide.status).toBe("completed")
	dateStub.restore()
})

afterEach(async()=>{
  await connection.close()
})