const mariadb = require("mariadb");

class DatabaseService {
	static pool;
	static conn;

	static async start(host, username, password, name) {
		this.pool = mariadb.createPool({
			host,
			user: username,
			password,
			database: name
		});

		this.conn = await this.pool.getConnection();

		console.log("Connected to database successfully");
	}
}

module.exports = DatabaseService;