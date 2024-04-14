const ErrorEx = require("../util/ErrorEx");
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

		for(let i = 0; i < result.length; i++) {
			result[i].isLiked = await this.isPostLiked(uid, result[i].id);
			result[i].comments = await this.getComments(result[i].id);
		}

		return result;
	}
	async getPostsByUser(uid) {

		const result = await DatabaseService.conn.query("SELECT * FROM posts WHERE userid=? ORDER BY postedOn DESC", [userid]);

		for(let i = 0; i < result.length; i++) {
			result[i].isLiked = await this.isPostLiked(uid, result[i].id);
			result[i].comments = await this.getComments(result[i].id);
		}

		return result;
	}
	
	async likePost(userid, postid) {
		const conn = DatabaseService.conn;

		const result = await conn.query("SELECT * FROM likes WHERE userid=? AND postid=?", [userid, postid]);

		if(result.length !== 0) {
			throw new ErrorEx("You've already liked this post.", "post/already-liked", 400);
		}
		else {
			await conn.query("INSERT INTO likes VALUES (?, ?)", [userid, postid]);
		}
	}
	async unlikePost(userid, postid) {
		const conn = DatabaseService.conn;
		const result = await conn.query("SELECT * FROM likes WHERE userid=? AND postid=?", [userid, postid]);

		if(result.length === 0) {
			throw new ErrorEx("You've not liked that post", "post/not-liked", 400);
		}
		else {
			await conn.query("DELETE FROM likes WHERE userid=? AND postid=?", [userid, postid]);
		}
	}
	async isPostLiked(userid, postid) {
		const result = await DatabaseService.conn.query("SELECT * FROM likes WHERE userid=? AND postid=?", [userid, postid]);

		return result.length !== 0;
	}
	async createComment(userid, postid, content) {
		const conn = DatabaseService.conn;

		await conn.query("INSERT INTO comments (userid, postid, content, postedOn) VALUES (?, ?, ?, ?)", [userid, postid, content, new Date()]);
	}
	async getComments(postid) {
		const result = await DatabaseService.conn.query("SELECT * FROM comments WHERE postid=? ORDER BY postedOn DESC", [postid]);
		
		return result;
	}
}

module.exports = PostService;