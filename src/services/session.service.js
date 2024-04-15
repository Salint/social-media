const { promisify } = require("util");
const DatabaseService = require("./database.service");
const crypto = require("crypto");
const ErrorEx = require("../util/ErrorEx");

const randomBytesAsync = promisify(crypto.randomBytes);

class SessionService {
	async createNewUserSession(userid) {
		const sessionID = (await randomBytesAsync(48)).toString("base64url");

		await DatabaseService.conn.query("INSERT INTO sessions VALUES (?, ?)", [sessionID, userid]);

		return sessionID;
	}

	async createExistingUserSession(userid) {
		const sessionID = (await randomBytesAsync(48)).toString("base64url");

		await DatabaseService.conn.query("UPDATE sessions SET id=? WHERE userid=?", [sessionID, userid]);

		return sessionID;
	}

	async verifySession(sessionid) {
		const data = await DatabaseService.conn.query("SELECT * FROM sessions WHERE id=?", sessionid);

		if(data.length === 0) {
			throw new ErrorEx("Invalid session id", "auth/invalid-id", 403);
		}
		else {
			return data[0].userid;
		}
	}
}

module.exports = SessionService;