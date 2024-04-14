const ErrorEx = require("../util/ErrorEx");
const DatabaseService = require("./database.service");

class PostService {
	async createPost(uid, content) {
		const conn = DatabaseService.conn;

		await conn.query("INSERT INTO posts (userid, content, postedOn) VALUES (?, ?, ?)", [uid, content, new Date()])
	}
}

module.exports = PostService;