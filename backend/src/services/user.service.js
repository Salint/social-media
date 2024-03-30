const ErrorEx = require("../util/ErrorEx");
const wp = require("whirlpool-js");
const DatabaseService = require("./database.service");

class UserService {

	async createUser(username, email, password) {
		
		const conn = DatabaseService.conn;

		if(username.length > 24) {
			throw new ErrorEx("Username cannot be longer than 24 letters.", "auth/long-username", 400);
		}
		else if(!email.includes("@") || !email.includes(".")) {
			throw new ErrorEx("Invalid email provided.", "auth/invalid-email", 400);
		}
		else {

			const users = await conn.query("SELECT username FROM users WHERE username=?", username);
			
			if(users.length != 0) {
				throw new ErrorEx("Username already taken.", "auth/username-taken", 400);
			}
			else {
				const hash = await wp.encP(password, "base64");
				await conn.query("INSERT INTO users (`username`, `password`, `email`, `bio`) VALUES (?, ?, ?, ?)", [username, hash, email, ""]);
			
				const ids = await conn.query("SELECT id FROM users WHERE username=?", [username]);
				return ids[0].id;
			}

		}
	}
}

module.exports = UserService;