import pgp from "pg-promise";

export default interface DatabaseConnection {
	query (statement: string, params: any): Promise<any>;
	close (): Promise<any>;
}

export class PgPromiseAdapter implements DatabaseConnection {
	connection: any;

	constructor () {
		console.log('Initializing database connection')
		this.connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	}

	query(statement: string, params: any): Promise<any> {
		return this.connection.query(statement, params);
	}

	async close(): Promise<any> {
		// detalhe traduzido no adapter
		console.log('Closing database connection')
		return this.connection.$pool.end();
	}

}
