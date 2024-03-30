const mariadb = require("mariadb");

class DatabaseService {
	static pool;
	static conn;

	static start(host, username, password, name) {
		this.pool = mariadb.createPool({
			host,
			user: username,
			password,
			database: name
		});

		this.conn = this.pool.getConnection();

		console.log("Connected to database successfully");
	}
}

module.exports = DatabaseService;