const ErrorEx = require("../util/ErrorEx");
const wp = require("whirlpool-js");
const DatabaseService = require("./database.service");

class UserService {

	async createUser(username, email, password) {
		
		if(username.length > 24) {
			throw new ErrorEx("Username cannot be longer than 24 letters.", "auth/long-username", 400);
		}
		else if(!email.includes("@") || !email.includes(".")) {
			throw new ErrorEx("Invalid email provided.", "auth/invalid-email", 400);
		}
		else {
			const hash = await wp.encP(password, "base64");

			await DatabaseService.conn.query("INSERT INTO users (`username`, `password`, `email`, `bio`) VALUES (?, ?, ?, ?)", [username, hash, email, ""]);
		}
	}
}

module.exports = UserService;