import GetAccount from "../../application/usecase/GetAccount";
import HttpServer from "./HttpServer";
import Signup from "../../application/usecase/Signup";
import Registry, { inject } from '../dependency-injection/Registry';

// Interface Adapter (verde)
export default class MainController {
	@inject("signup")
	signup?: Signup
	@inject("getAccount")
	getAccount?: GetAccount

	constructor (httpServer: HttpServer) {
		console.log('Controllers ready')
		httpServer.register("post", "/signup", async (params: any, body: any) =>{
			const output = await this.signup?.execute(body);
			return output;
		});
		
		httpServer.register("get", "/accounts/:accountId", async  (params: any, body: any) =>{
			const output = await this.getAccount?.execute(params.accountId);
			return output;
		});
	}
}