import GetRide from "../../application/usecase/GetRide";
import HttpServer from "./HttpServer";
import RequestRide from "../../application/usecase/RequestRide";
import AcceptRide from '../../application/usecase/AcceptRide';
import StartRide from '../../application/usecase/StartRide';
import { inject } from '../dependency-injection/Registry';

// Interface Adapter (verde)
export default class MainController {
	@inject("requestRide")
	requestRide?: RequestRide
	@inject("getRide")
	getRide?: GetRide
	@inject("acceptRide")
	acceptRide?: AcceptRide
	@inject("startRide")
	startRide?: StartRide
	
	constructor (httpServer: HttpServer) {
		httpServer.register("post", "/request_ride", async  (params: any, body: any) =>{
			const output = await this.requestRide?.execute(body);
			return output;
		});
		
		httpServer.register("get", "/rides/:rideId", async  (params: any, body: any) =>{
			const ride = await this.getRide?.execute(params.rideId);
			return ride;
		});

		httpServer.register("patch", "/rides/accept", async  (params: any, body: any) =>{
		  await this.acceptRide?.execute(body);
		});

		httpServer.register("patch", "/rides/start", async  (params: any, body: any) =>{
		  await this.startRide?.execute(body);
		});
	}
}