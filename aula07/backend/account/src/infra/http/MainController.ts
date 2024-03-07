import GetAccount from "../../application/usecase/GetAccount";
import HttpServer from "./HttpServer";
import Signup from "../../application/usecase/Signup";
import Registry, { inject } from '../dependency-injection/Registry';
import Queue from '../queue/Queue';

// Interface Adapter (verde)
export default class MainController {
	@inject("signup")
	signup?: Signup
	@inject("getAccount")
	getAccount?: GetAccount
	@inject("queue")
	queue?: Queue

	constructor (httpServer: HttpServer) {
		console.log('Controllers ready')
		httpServer.register("post", "/signup", async (params: any, body: any) =>{
			const output = await this.signup?.execute(body);
			return output;
		});

		httpServer.register("post", "/signupAsync", async (params: any, body: any) =>{
			this.queue?.publish("signup",body)
		});
		
		httpServer.register("get", "/accounts/:accountId", async  (params: any, body: any) =>{
			const output = await this.getAccount?.execute(params.accountId);
			return output;
		});
	}
}