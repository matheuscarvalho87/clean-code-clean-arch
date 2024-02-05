import { test,expect } from '@jest/globals'
import axios from "axios";

axios.defaults.validateStatus = function () {
	return true;
}

// integration test com uma granularidade mais grossa
test("Deve criar a conta de um passageiro", async function () {
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
	expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
});

test("Deve solicitar uma corrida", async function () {
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
	const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
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
	const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
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

test.only('Deve aceitar uma corrida',async()=>{
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
	const responsePassengerSignup = await axios.post("http://localhost:3000/signup", inputPassengerSignup);
	const outputPassengerSignup = responsePassengerSignup.data;
	const responseDriverSignup = await axios.post("http://localhost:3000/signup", inputDriverSignup);
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
	console.log('AQUI:::',{outputGetRide})
	// expect(outputGetRide.driverId).toBe(outputDriverSignup.accountId)
	expect(outputGetRide.passengerName).toBe("John Doe");
	expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
	expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
	expect(outputGetRide.fromLat).toBe(-27.584905257808835);
	expect(outputGetRide.status).toBe("accepted");
	expect(outputGetRide.date).toBeDefined();
})

test('Não deve aceitar uma corrida se não for motorista',async()=>{
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
	const responseRequestRide = await axios.post("http://localhost:3000/request_ride", inputRequestRide);

	const outputRequestRide = responseRequestRide.data;
	const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputSignup.accountId,
	}
	const responseAcceptRide = await axios.patch("http://localhost:3000/rides/accept", inputAcceptRide);
	const outputAcceptRide = responseAcceptRide.data

	expect(responseAcceptRide.status).toBe(422);
	expect(outputAcceptRide.message).toBe("User is not a Driver");
})

test('Não deve aceitar uma corrida se tiver outra em andamento',async()=>{
	//cria primeiro usuário que vai pedir uma corrida
	const inputPassengerSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	};
	const responsePassengerSignup = await axios.post("http://localhost:3000/signup", inputPassengerSignup);
	const outputPassengerSignup = responsePassengerSignup.data;
	//cria motorista que vai aceitar a corrida
	const inputDriverSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA9999",
		isPassenger: false,
		isDriver: true
	};

	const responseDriverSignup = await axios.post("http://localhost:3000/signup", inputDriverSignup);
	const outputDriverSignup = responseDriverSignup.data;
	//pede a primeira corrida com o primeiro usuário
	const inputRequestRide = {
		passengerId: outputPassengerSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	const responseRequestRide = await axios.post("http://localhost:3000/request_ride", inputRequestRide);
	const outputRequestRide = responseRequestRide.data;
	// motorista aceita a corrida
	const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputDriverSignup.accountId,
	}
	await axios.patch("http://localhost:3000/rides/accept", inputAcceptRide);
	//cria segundp usuário que vai pedir uma corrida
	const inputPassengerSignup2 = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	};
	const responsePassengerSignup2 = await axios.post("http://localhost:3000/signup", inputPassengerSignup2);
	const outputPassengerSignup2 = responsePassengerSignup2.data;
	//segundo usuário pede uma corrida
	const inputRequestRide2 = {
		passengerId: outputPassengerSignup2.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};
	const responseRequestRide2 = await axios.post("http://localhost:3000/request_ride", inputRequestRide2);
	const outputRequestRide2 = responseRequestRide2.data;
	// motorista tenta aceitar corrida
	const inputAcceptRide2 = {
		rideId: outputRequestRide2.rideId,
		driverId: outputDriverSignup.accountId,
	}

	const responseAcceptRide = await axios.patch("http://localhost:3000/rides/accept", inputAcceptRide2);
	const outputAcceptRide = responseAcceptRide.data

	expect(responseAcceptRide.status).toBe(422);
	expect(outputAcceptRide.message).toBe("You are already in another trip");
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
	const responsePassengerSignup = await axios.post("http://localhost:3000/signup", inputPassengerSignup);
	const outputPassengerSignup = responsePassengerSignup.data;
	const responseDriverSignup = await axios.post("http://localhost:3000/signup", inputDriverSignup);
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

test('Não deve iniciar uma corrida com status diferente de accepted',async()=>{
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
	const responsePassengerSignup = await axios.post("http://localhost:3000/signup", inputPassengerSignup);
	const outputPassengerSignup = responsePassengerSignup.data;
	const responseDriverSignup = await axios.post("http://localhost:3000/signup", inputDriverSignup);
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

	const inputStartRide = {
		rideId: outputRequestRide.rideId,
	}
	const responseStartRide = await axios.patch("http://localhost:3000/rides/start", inputStartRide);
	const outputStartRide = responseStartRide.data

	expect(responseStartRide.status).toBe(422);
	expect(outputStartRide.message).toBe('Invalid status for start ride');
})