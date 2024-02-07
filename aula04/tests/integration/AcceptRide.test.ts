import { test,expect,beforeEach,afterEach } from '@jest/globals'
import {AccountRepositoryDatabase} from '../../src/infra/repository/AccountRepository'
import {RideRepositoryDatabase} from '../../src/infra/repository/RideRepository'
import {PgPromiseAdapter} from '../../src/infra/database/DatabaseConnection'
import {MailerGatewayConsole} from '../../src/infra/gateway/MailerGateway'
import  Signup  from '../../src/application/usecase/Signup'
import  RequestRide  from '../../src/application/usecase/RequestRide'
import  GetRide  from '../../src/application/usecase/GetRide'
import  AcceptRide  from '../../src/application/usecase/AcceptRide'
let connection : PgPromiseAdapter
let rideRepository: RideRepositoryDatabase
let accountRepository: AccountRepositoryDatabase
let singup: Signup
let requestRide: RequestRide
let getRide: GetRide
let acceptRide: AcceptRide

beforeEach(async()=>{
   connection = new PgPromiseAdapter()
	 rideRepository = new RideRepositoryDatabase(connection)
	 accountRepository = new AccountRepositoryDatabase(connection)
	 singup =  new Signup(accountRepository,new MailerGatewayConsole())
	 requestRide =  new RequestRide(rideRepository,accountRepository)
	 getRide =  new GetRide(rideRepository,accountRepository)
	 acceptRide =  new AcceptRide(rideRepository,accountRepository)
})

test("should accept a ride",async ()=>{
  const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	};
	const outputSignup = await  singup.execute(inputSignup);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	const responseRequestRide = await requestRide.execute(inputRequestRide)
	const outputRequestRide = responseRequestRide;
	expect(outputRequestRide.rideId).toBeDefined();
	const responseGetRide = await getRide.execute(outputRequestRide.rideId)
	const outputGetRide = responseGetRide;
	expect(outputGetRide.passengerName).toBe("John Doe");
	expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
	expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
	expect(outputGetRide.fromLat).toBe(-27.584905257808835);
	expect(outputGetRide.status).toBe("requested");
	expect(outputGetRide.date).toBeDefined();

})
afterEach(async()=>{
  await connection.close()
})