const { promisify } = require("util");
const DatabaseService = require("./database.service");
const crypto = require("crypto");

const randomBytesAsync = promisify(crypto.randomBytes);

class SessionService {
	async createNewUserSession(userid) {
		const sessionID = (await randomBytesAsync(48)).toString("base64url");

		await DatabaseService.conn.query("INSERT INTO sessions VALUES (?, ?)", [sessionID, userid]);

		return sessionID;
	}
}

module.exports = SessionService;