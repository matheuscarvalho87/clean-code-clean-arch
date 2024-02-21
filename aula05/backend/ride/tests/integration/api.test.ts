import { test,expect } from '@jest/globals'
import axios from "axios";

axios.defaults.validateStatus = function () {
	return true;
}

test("Deve solicitar uma corrida", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	};
	const responseSignup = await axios.post("http://localhost:3001/signup", inputSignup);
	const outputSignup = responseSignup.data;
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	const responseRequestRide = await axios.post("http://localhost:3000/request_ride", inputRequestRide);
	const outputRequestRide = responseRequestRide.data;
	expect(outputRequestRide.rideId).toBeDefined();
	const responseGetRide = await axios.get(`http://localhost:3000/rides/${outputRequestRide.rideId}`);
	const outputGetRide = responseGetRide.data;
	expect(responseRequestRide.status).toBe(200);
	expect(outputGetRide.passengerName).toBe("John Doe");
	expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
	expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
	expect(outputGetRide.fromLat).toBe(-27.584905257808835);
	expect(outputGetRide.status).toBe("requested");
	expect(outputGetRide.date).toBeDefined();
});

test("Não deve solicitar uma corrida se não for passageiro", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA9999",
		isPassenger: false,
		isDriver: true
	};
	const responseSignup = await axios.post("http://localhost:3001/signup", inputSignup);
	const outputSignup = responseSignup.data;
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	const responseRequestRide = await axios.post("http://localhost:3000/request_ride", inputRequestRide);
	const outputRequestRide = responseRequestRide.data;
	expect(responseRequestRide.status).toBe(422);
	expect(outputRequestRide.message).toBe("Account is not from a passenger");
});

test("Não deve solicitar uma corrida se o passageiro tiver outra corrida com outra corrida ativa", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	};
	const responseSignup = await axios.post("http://localhost:3001/signup", inputSignup);
	const outputSignup = responseSignup.data;
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	await axios.post("http://localhost:3000/request_ride", inputRequestRide);
	const responseRequestRide = await axios.post("http://localhost:3000/request_ride", inputRequestRide);
	const outputRequestRide = responseRequestRide.data;
	expect(responseRequestRide.status).toBe(422);
	expect(outputRequestRide.message).toBe("Passenger has an active ride");
});

test('Deve aceitar uma corrida',async()=>{
	const inputPassengerSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	};

	const inputDriverSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA9999",
		isPassenger: false,
		isDriver: true
	};
	const responsePassengerSignup = await axios.post("http://localhost:3001/signup", inputPassengerSignup);
	const outputPassengerSignup = responsePassengerSignup.data;
	const responseDriverSignup = await axios.post("http://localhost:3001/signup", inputDriverSignup);
	const outputDriverSignup = responseDriverSignup.data;
	const inputRequestRide = {
		passengerId: outputPassengerSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	const responseRequestRide = await axios.post("http://localhost:3000/request_ride", inputRequestRide);
	const outputRequestRide = responseRequestRide.data;

	const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputDriverSignup.accountId,
	}
	await axios.patch("http://localhost:3000/rides/accept", inputAcceptRide);

	const responseGetRide = await axios.get(`http://localhost:3000/rides/${outputRequestRide.rideId}`);
	const outputGetRide = responseGetRide.data;
	// expect(outputGetRide.driverId).toBe(outputDriverSignup.accountId)
	expect(outputGetRide.passengerName).toBe("John Doe");
	expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
	expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
	expect(outputGetRide.fromLat).toBe(-27.584905257808835);
	expect(outputGetRide.status).toBe("accepted");
	expect(outputGetRide.date).toBeDefined();
})

test('Deve iniciar uma corrida',async()=>{
	const inputPassengerSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	};

	const inputDriverSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA9999",
		isPassenger: false,
		isDriver: true
	};
	const responsePassengerSignup = await axios.post("http://localhost:3001/signup", inputPassengerSignup);
	const outputPassengerSignup = responsePassengerSignup.data;
	const responseDriverSignup = await axios.post("http://localhost:3001/signup", inputDriverSignup);
	const outputDriverSignup = responseDriverSignup.data;
	const inputRequestRide = {
		passengerId: outputPassengerSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	const responseRequestRide = await axios.post("http://localhost:3000/request_ride", inputRequestRide);
	const outputRequestRide = responseRequestRide.data;

	const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputDriverSignup.accountId,
	}
	await axios.patch("http://localhost:3000/rides/accept", inputAcceptRide);

	const inputStartRide = {
		rideId: outputRequestRide.rideId,
	}
	
	await axios.patch("http://localhost:3000/rides/start", inputStartRide);

	const responseGetRide = await axios.get(`http://localhost:3000/rides/${outputRequestRide.rideId}`);
	const outputGetRide = responseGetRide.data;
	expect(responseRequestRide.status).toBe(200);
	expect(outputGetRide.passengerName).toBe("John Doe");
	expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
	expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
	expect(outputGetRide.fromLat).toBe(-27.584905257808835);
	expect(outputGetRide.status).toBe("in_progress");
	expect(outputGetRide.date).toBeDefined();
})
