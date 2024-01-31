import express, { Request, Response } from 'express'
import Signup from './Signup';
import { AccountDAODatabase } from './AccountDAO';
import { RideDAODatabase } from './RideDAO';
import GetAccount from './GetAccount';
import RequestRide from './RequestRide';
import GetRide from './GetRide';

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
	const accountDAO = new AccountDAODatabase();
	const signup = new Signup(accountDAO);
	const output = await signup.execute(req.body);
	res.json(output);
});

app.get("/accounts/:accountId", async function (req, res) {
	const accountDAO = new AccountDAODatabase();
	const getAccount = new GetAccount(accountDAO);
	const output = await getAccount.execute(req.params.accountId);
	res.json(output);
});

app.post("/request-ride", async function (req, res) {
	const accountDAO = new AccountDAODatabase();
	const rideDAO = new RideDAODatabase();
	const requestRide = new RequestRide(accountDAO,rideDAO)
	const response = await requestRide.execute(req.body)
	res.json(response);
});

app.get("/rides/:rideId", async function (req, res) {
	const accountDAO = new AccountDAODatabase();
	const rideDAO = new RideDAODatabase();
	const getRide = new GetRide(accountDAO,rideDAO)
	const response = await getRide.execute(req.params.rideId)
	res.json(response);
});

app.listen(3000);