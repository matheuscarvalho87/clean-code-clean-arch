import RequestRide from "./application/usecase/RequestRide";
import GetRide from "./application/usecase/GetRide";
import AcceptRide from "./application/usecase/AcceptRide";
import { RideRepositoryDatabase } from "./infra/repository/RideRepository";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer";
import MainController from "./infra/http/MainController";
import StartRide from './application/usecase/StartRide';
import Registry from './infra/dependency-injection/Registry';
import AccountGatewayHttp from './infra/gateway/AccountGatewayHttp';

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();
const rideRepository = new RideRepositoryDatabase(connection);
const accountGateway = new AccountGatewayHttp()
const requestRide = new RequestRide(rideRepository, accountGateway);
const getRide = new GetRide(rideRepository, accountGateway);
const acceptRide = new AcceptRide(rideRepository, accountGateway);
const startRide = new StartRide(rideRepository);

const registry = Registry.getInstance()
registry.register("requestRide", requestRide)
registry.register("getRide", getRide)
registry.register("acceptRide", acceptRide)
registry.register("startRide", startRide)
new MainController(httpServer);
httpServer.listen(3000);