const DatabaseService = require("./database.service");
const UserService = require("./user.service");

class PostService {
	async createPost(uid, content) {
		const conn = DatabaseService.conn;

		await conn.query("INSERT INTO posts (userid, content, postedOn) VALUES (?, ?, ?)", [uid, content, new Date()]);
	}
	async getPostsByFollowing(uid) {
		const userService = new UserService();
		const followResult = await userService.getFollowingList(uid);

		const result = await DatabaseService.conn.query("SELECT * FROM posts WHERE userid IN (?) ORDER BY postedOn DESC", [followResult]);

		return result;
	}
}

module.exports = PostService;