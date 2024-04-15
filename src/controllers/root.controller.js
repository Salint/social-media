const { Router } = require("express");
const SessionService = require("../services/session.service");
const PostService = require("../services/post.service");
const { post } = require("./user.controller");
const UserService = require("../services/user.service");

const RootController = Router();

RootController.get("/", async function(req, res) {
	if(req.cookies.sessionId) {
		try {
			const sessionService = new SessionService();
			const postService = new PostService();
			const userService = new UserService();

			const userId = await sessionService.verifySession(req.cookies.sessionId);
			const posts = await postService.getPostsByFollowing(userId);
			const profile = await userService.getUserProfile(userId);

			res.render("index", { profile, posts });
		}
		catch(error) {
			console.log(error);
			res.clearCookie("sessionId").redirect("/");
		}
	}
	else {
		const { username, email, message } = req.query;
		res.render("login", { username, email, message });
	}
});

RootController.get("/signup", function(req, res) {
	const { username, email, message } = req.query;
	res.render("signup", { username, email, message });
});

module.exports = RootController;