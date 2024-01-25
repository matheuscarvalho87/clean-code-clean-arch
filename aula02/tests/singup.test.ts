import { test,expect, beforeEach } from '@jest/globals'
import Signup from '../src/Signup'
import GetAccount from '../src/GetAccount'
import MailerGateway from "../src/MailerGateway";
import {AccountDAODatabase, AccountDAOMemory} from '../src/AccountDAO'
import sinon from "sinon";

let signup: Signup;
let getAccount: GetAccount;


beforeEach(()=>{
  const accountDAO = new AccountDAODatabase();
	signup = new Signup(accountDAO);
	getAccount = new GetAccount(accountDAO);
})

test("Should create a passanger account",async()=>{
  
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf:'97456321558',
    isPassenger: true
  }
  
  const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(outputGetAccount.is_passenger).toBe(input.isPassenger);
})
test("Should create a driver account",async()=>{
  
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf:'97456321558',
    carPlate:"AAA9999",
    isDriver: true
  }
 
  const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(outputGetAccount.is_driver).toBe(input.isDriver);
})
test("Should not create a a passenger if name is invalid",async()=>{
  
  const input = {
    name: "John",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf:'97456321558',
    isPassenger: true
  }
  await expect(()=> signup.execute(input)).rejects.toThrow(new Error('Invalid name'))
})
test("Should not create a passenger if email is invalid",async()=>{
  
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}`,
    cpf:'97456321558',
    isPassenger: true
  }
  
  await expect(()=> signup.execute(input)).rejects.toThrow(new Error('Invalid email'))
})
test("Should not create a a passenger if account already exists",async()=>{
  
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf:'97456321558',
    isPassenger: true
  }
  
  await signup.execute(input)
  await expect(()=> signup.execute(input)).rejects.toThrow(new Error('Account already exists'))
})
test("Should not create a driver if car plate is invalid",async()=>{
  
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf:'97456321558',
    carPlate:"AAA-@9999999",
    isDriver: true
  }
  await expect(()=> signup.execute(input)).rejects.toThrow(new Error('Invalid car plate'))
})

test("Should create a passanger account stub", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	};
	const saveStub = sinon.stub(AccountDAODatabase.prototype, "save").resolves();
	const getByEmailStub = sinon.stub(AccountDAODatabase.prototype, "getByEmail").resolves();
	const getByIdStub = sinon.stub(AccountDAODatabase.prototype, "getById").resolves(input);
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	saveStub.restore();
	getByEmailStub.restore();
	getByIdStub.restore();
});

test("Should create a passanger account spy", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	};
	const saveSpy = sinon.spy(AccountDAODatabase.prototype, "save");
	const sendSpy = sinon.spy(MailerGateway.prototype, "send");
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(saveSpy.calledOnce).toBe(true);
	expect(saveSpy.calledWith(input)).toBe(true);
	expect(sendSpy.calledOnce).toBe(true);
	expect(sendSpy.calledWith("Welcome", input.email, "Use this link to confirm your account"));
	saveSpy.restore();
	sendSpy.restore();
});

test("Deve criar a conta de um passageiro mock", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	};
	const mailerGatewayMock = sinon.mock(MailerGateway.prototype);
	mailerGatewayMock.expects("send").withArgs("Welcome", input.email, "Use this link to confirm your account").once();
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	mailerGatewayMock.verify();
	mailerGatewayMock.restore();
});