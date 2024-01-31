import { test,expect } from '@jest/globals'
import axios from "axios";


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

test("should request a ride", async () =>{
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	};
	const responseSignup = await axios.post("http://localhost:3000/signup", input);
	const outputSignup = responseSignup.data;
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat:  -23.543210, 
		fromLong:  -46.633312, 
		toLat:   -23.553210, 
		toLong:   -46.643312
	}
	const  responseRequestRide = await axios.post("http://localhost:3000/request-ride", inputRequestRide)
	const outputRequesRide =  responseRequestRide.data;
	expect(outputRequesRide.rideId).toBeDefined();
});