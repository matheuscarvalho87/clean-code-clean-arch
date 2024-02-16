import { test,expect,beforeEach,afterEach } from '@jest/globals'
import {AccountRepositoryDatabase} from '../../src/infra/repository/AccountRepository'
import {RideRepositoryDatabase} from '../../src/infra/repository/RideRepository'
import {PositionRepositoryDatabase} from '../../src/infra/repository/PositionRepository'
import {PgPromiseAdapter} from '../../src/infra/database/DatabaseConnection'
import {MailerGatewayConsole} from '../../src/infra/gateway/MailerGateway'
import Signup  from '../../src/application/usecase/Signup'
import RequestRide  from '../../src/application/usecase/RequestRide'
import GetRide  from '../../src/application/usecase/GetRide'
import AcceptRide  from '../../src/application/usecase/AcceptRide'
import UpdatePosition  from '../../src/application/usecase/UpdatePosition'
import StartRide from '../../src/application/usecase/StartRide'
import GetPositions from '../../src/application/usecase/GetPositions'
let connection : PgPromiseAdapter
let rideRepository: RideRepositoryDatabase
let accountRepository: AccountRepositoryDatabase
let positionRepository: PositionRepositoryDatabase
let singup: Signup
let requestRide: RequestRide
let getRide: GetRide
let acceptRide: AcceptRide
let startRide: StartRide
let updatePosition: UpdatePosition
let getPositions: GetPositions
beforeEach(async()=>{
   connection = new PgPromiseAdapter()
	 rideRepository = new RideRepositoryDatabase(connection)
	 accountRepository = new AccountRepositoryDatabase(connection)
	 positionRepository = new PositionRepositoryDatabase(connection)
	 singup =  new Signup(accountRepository,new MailerGatewayConsole())
	 requestRide =  new RequestRide(rideRepository,accountRepository)
	 getRide =  new GetRide(rideRepository,accountRepository)
	 acceptRide =  new AcceptRide(rideRepository,accountRepository)
	 startRide = new StartRide(rideRepository)
	 updatePosition =  new UpdatePosition(rideRepository, positionRepository)
	 getPositions =  new GetPositions(positionRepository)
})

test("should update a ride position",async ()=>{
	const inputPassengerSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	};
	const outputPassengerSignup = await singup.execute(inputPassengerSignup)

	const inputDriverSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA9999",
		isDriver: true
	};
	const outputDriverSignup = await  singup.execute(inputDriverSignup)

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

	const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	expect(outputGetRide.distance).toBe(10);
	expect(outputGetRide.lastLat).toBe(-27.496887588317275);
	expect(outputGetRide.lastLong).toBe(-48.522234807851476);

	const outputGetPositions = await getPositions.execute(outputRequestRide.rideId);
	expect(outputGetPositions[0].lat).toStrictEqual(inputUpdatePosition.lat);
	expect(outputGetPositions[0].long).toStrictEqual(inputUpdatePosition.long);
})

afterEach(async()=>{
  await connection.close()
})