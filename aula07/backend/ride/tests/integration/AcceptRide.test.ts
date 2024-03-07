import { test,expect,beforeEach,afterEach } from '@jest/globals'
import {RideRepositoryDatabase} from '../../src/infra/repository/RideRepository'
import {PgPromiseAdapter} from '../../src/infra/database/DatabaseConnection'
import  RequestRide  from '../../src/application/usecase/RequestRide'
import  GetRide  from '../../src/application/usecase/GetRide'
import  AcceptRide  from '../../src/application/usecase/AcceptRide'
import AccountGatewayHttp from '../../src/infra/gateway/AccountGatewayHttp'
import { AxiosAdapter } from '../../src/infra/http/HttpClient'
let connection : PgPromiseAdapter
let rideRepository: RideRepositoryDatabase
let accountGateway: AccountGatewayHttp
let requestRide: RequestRide
let getRide: GetRide
let acceptRide: AcceptRide

beforeEach(async()=>{
   connection = new PgPromiseAdapter()
	 rideRepository = new RideRepositoryDatabase(connection)
	 accountGateway = new AccountGatewayHttp(new AxiosAdapter())
	 requestRide =  new RequestRide(rideRepository,accountGateway)
	 getRide =  new GetRide(rideRepository,accountGateway)
	 acceptRide =  new AcceptRide(rideRepository,accountGateway)
})

test("should accept a ride",async ()=>{
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

	const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	expect(outputGetRide.driverId).toBe(inputAcceptRide.driverId)
	expect(outputGetRide.passengerName).toBe("John Doe");
	expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
	expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
	expect(outputGetRide.status).toBe("accepted");
})


test('should not accept ride if is not driver',async()=>{
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	};
	const outputSignup = await accountGateway.signup(inputSignup)

	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	const outputRequestRide = await requestRide.execute(inputRequestRide)

	const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputSignup.accountId,
	}
	// const outputAcceptRide = await acceptRide.execute(inputAcceptRide)

	await expect(()=>acceptRide.execute(inputAcceptRide)).rejects.toThrowError("User is not a Driver");
})

test('Não deve aceitar uma corrida se tiver outra em andamento',async()=>{
	//cria primeiro usuário que vai pedir uma corrida
	const inputPassengerSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	};
	const outputPassengerSignup =  await accountGateway.signup(inputPassengerSignup)
	//cria motorista que vai aceitar a corrida
	const inputDriverSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA9999",
		isPassenger: false,
		isDriver: true
	};

	const outputDriverSignup = await accountGateway.signup(inputDriverSignup)
	//pede a primeira corrida com o primeiro usuário
	const inputRequestRide = {
		passengerId: outputPassengerSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	const outputRequestRide = await requestRide.execute(inputRequestRide)
	// motorista aceita a corrida
	const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputDriverSignup.accountId,
	}
	await acceptRide.execute(inputAcceptRide)
	//cria segundp usuário que vai pedir uma corrida
	const inputPassengerSignup2 = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	};
	const outputPassengerSignup2 = await accountGateway.signup(inputPassengerSignup2)
	//segundo usuário pede uma corrida
	const inputRequestRide2 = {
		passengerId: outputPassengerSignup2.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	const outputRequestRide2 = await requestRide.execute(inputRequestRide2)
	// motorista tenta aceitar corrida
	const inputAcceptRide2 = {
		rideId: outputRequestRide2.rideId,
		driverId: outputDriverSignup.accountId,
	}

	await expect(()=> acceptRide.execute(inputAcceptRide2)).rejects.toThrow(new Error("Driver already in another trip"));
})
afterEach(async()=>{
  await connection.close()
})