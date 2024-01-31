import express, { Request, Response } from 'express'
import Signup from './Signup';
import { AccountDAODatabase } from './AccountDAO';
import GetAccount from './GetAccount';

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
	const rideId = crypto.randomUUID()
	res.json({rideId});
});

app.get("/rides/:rideId", async function (req, res) {
	try {
		const accountDAO = new AccountDAODatabase();
		const 
	} catch (error) {
		
	}
});

app.listen(3000);