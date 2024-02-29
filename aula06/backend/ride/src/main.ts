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
import { AxiosAdapter } from './infra/http/HttpClient';
import { RabbitMQAdapter } from './infra/queue/Queue';
import QueueController from './infra/queue/QueueController';
import { ProcessPayment } from './application/usecase/ProcessPayment';

async function main(){
  const httpServer = new ExpressAdapter();
  const connection = new PgPromiseAdapter();
  const queue = new RabbitMQAdapter()
  await queue.connect()
  const rideRepository = new RideRepositoryDatabase(connection);
  const accountGateway = new AccountGatewayHttp(new AxiosAdapter())
  const requestRide = new RequestRide(rideRepository, accountGateway);
  const getRide = new GetRide(rideRepository, accountGateway);
  const acceptRide = new AcceptRide(rideRepository, accountGateway);
  const startRide = new StartRide(rideRepository);
  const processPayment = new ProcessPayment()
  const registry = Registry.getInstance()
  registry.register("requestRide", requestRide)
  registry.register("getRide", getRide)
  registry.register("acceptRide", acceptRide)
  registry.register("startRide", startRide)
  registry.register("processPayment", processPayment)
  new MainController(httpServer);
  new QueueController(queue)
  httpServer.listen(3000);
}
main()