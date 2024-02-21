import Signup from "./application/usecase/Signup";
import GetAccount from "./application/usecase/GetAccount";
import { MailerGatewayConsole } from "./infra/gateway/MailerGateway";
import { AccountRepositoryDatabase } from "./infra/repository/AccountRepository";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer";
import MainController from "./infra/http/MainController";
import Registry from './infra/dependency-injection/Registry';

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();
const accountRepository = new AccountRepositoryDatabase(connection);
const mailerGateway = new MailerGatewayConsole();
const signup = new Signup(accountRepository, mailerGateway);
const getAccount = new GetAccount(accountRepository);

const registry = Registry.getInstance()
registry.register("signup", signup),
registry.register("getAccount", getAccount)
new MainController(httpServer);
httpServer.listen(3001);