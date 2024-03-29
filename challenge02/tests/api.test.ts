import { test,expect } from '@jest/globals'
import axios from "axios";
axios.defaults.validateStatus = function () {
	return true;
}

test("should create a passenger account", async () =>{
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	};
	const responseSignup = await axios.post("http://localhost:3000/signup", input);
	const outputSignup = responseSignup.data;
	expect(outputSignup.accountId).toBeDefined();
	const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
	const outputGetAccount = responseGetAccount.data;
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(outputGetAccount.is_passenger).toBe(input.isPassenger);
});

test("should request a ride", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	};
	const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
	const outputSignup = responseSignup.data;
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	const responseRequestRide = await axios.post("http://localhost:3000/request-ride", inputRequestRide);
	const outputRequestRide = responseRequestRide.data;
	expect(outputRequestRide.rideId).toBeDefined();
	const responseGetRide = await axios.get(`http://localhost:3000/rides/${outputRequestRide.rideId}`);
	const outputGetRide = responseGetRide.data;
	expect(responseRequestRide.status).toBe(200);
	expect(outputGetRide.passengerName).toBe("John Doe");
	expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
	expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
	expect(outputGetRide.fromLat).toBe("-27.584905257808835");
	expect(outputGetRide.status).toBe("requested");
	expect(outputGetRide.date).toBeDefined();
});

test("should not request a ride with user is not a passenger", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA9999",
		isPassenger: false,
		isDriver: true
	};
	const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
	const outputSignup = responseSignup.data;
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	const responseRequestRide = await axios.post("http://localhost:3000/request-ride", inputRequestRide);
	const outputRequestRide = responseRequestRide.data;
	expect(responseRequestRide.status).toBe(422);
	expect(outputRequestRide.message).toBe("User is not a passenger");
});

test("shoul not request a ride if passenger has another active ride", async function () {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	};
	const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
	const outputSignup = responseSignup.data;

	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	await axios.post("http://localhost:3000/request-ride", inputRequestRide);
	const responseRequestRide = await axios.post("http://localhost:3000/request-ride", inputRequestRide);
	const outputRequestRide = responseRequestRide.data;
	expect(responseRequestRide.status).toBe(422);
	expect(outputRequestRide.message).toBe('Passenger has an active ride');
});