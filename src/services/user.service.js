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
			
			if(users.length !== 0) {
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
	async loginUser(username, password) {
		const conn = DatabaseService.conn;
		
		const result = await conn.query("SELECT id, password FROM users WHERE username=?", [username]);

		if(result.length === 0) {
			throw new ErrorEx("That account doesn't exist.", "auth/account-not-found", 404);
		}
		else {
			const hash = await wp.encP(password, "base64");
			const user = result[0];

			if(user.password === hash) {
				
				return user.id;
			}
			else {
				throw new ErrorEx("Incorrect password.", "auth/incorrect-password", 403);
			}

		}
	}
	async getUserId(username) {
		const conn = DatabaseService.conn;

		const results = await conn.query("SELECT id FROM users WHERE username=?", [username]);

		if(results.length === 0) {
			throw new ErrorEx("That account doesn't exist.", "auth/account-not-found", 404);
		}
		else {

			return results[0].id;
		}

	}
	async getUserProfile(userid) {
		const conn = DatabaseService.conn;

		const results = await conn.query("SELECT id, username, bio FROM users WHERE id=?", [userid]);

		if(results.length == 0) {
			throw new ErrorEx("That account doesn't exist.", "auth/account-not-found", 404);
		}
		else {
			
			results[0].followers = Number((await conn.query("SELECT COUNT(followerId) FROM follows WHERE followingId=?", [userid]))[0]["COUNT(followerId)"]);
			results[0].following = Number((await conn.query("SELECT COUNT(followingId) FROM follows WHERE followerId=?", [userid]))[0]["COUNT(followingId)"]);
		
			return results[0];
		}

	}
	async updateProfile(userid, username, bio) {
		await DatabaseService.conn.query("UPDATE users SET username=?, bio=? WHERE id=?", [username, bio, userid]);
	}
	async getFollowingList(userid) {
		const conn = DatabaseService.conn;

		const result = await conn.query("SELECT * FROM follows WHERE followerId=?", [userid]);
		const following = [];

		result.forEach((v) => following.push(v.followingId));

		return following;
	}
	async followUser(followerId, followingId) {
		const conn = DatabaseService.conn;

		const result = await conn.query("SELECT * FROM follows WHERE followerId=? AND followingId=?", [followerId, followingId]);

		if(result.length !== 0) {
			throw new ErrorEx("You're already following that person", "user/already-following", 400);
		}
		else {
			await conn.query("INSERT INTO follows VALUES (?, ?)", [followerId, followingId]);
		}
	}
	async unfollowUser(followerId, followingId) {
		const conn = DatabaseService.conn;
		const result = await conn.query("SELECT * FROM follows WHERE followerId=? AND followingId=?", [followerId, followingId]);

		if(result.length === 0) {
			throw new ErrorEx("You're not following that person", "user/not-following", 400);
		}
		else {
			await conn.query("DELETE FROM follows WHERE followerId=? AND followingId=?", [followerId, followingId]);
		}
	}
	async isFollowing(followerId, followingId) {
		const result = await DatabaseService.conn.query("SELECT * FROM follows WHERE followerId=? AND followingId=?", [followerId, followingId]);

		return result.length !== 0;
	}
}

module.exports = UserService;