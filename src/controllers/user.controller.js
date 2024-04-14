const { Router } = require("express");
const UserService = require("../services/user.service");
const ErrorEx = require("../util/ErrorEx");

const UserController = Router();

UserController.get("/:userid", async function (req, res) {
	const { userid } = req.params;

	try {
		const userService = new UserService();
		const profile = await userService.getUserProfile(userid);
		const isFollowing = await userService.isFollowing(res.locals.userid, userid);

		res.render("profile", { profile, isFollowing });
	}
	catch(error) {
		if(error instanceof ErrorEx) {
			res.status(error.statusCode).send({
				message: error.message,
				code: error.code
			});
		}
		else {
			console.log(error);
			res.status(500).send("Server Error. Please try again later.");
		}
	}
});

UserController.post("/:userid/follow", async function (req, res) {

	const { userid } = req.params;

	try {

		await (new UserService).followUser(res.locals.userid, userid);

		res.redirect("/user/" + userid);
	}
	catch(error) {
		if(error instanceof ErrorEx) {
			res.status(error.statusCode).send({
				message: error.message,
				code: error.code
			});
		}
		else {
			console.log(error);
			res.status(500).send("Server Error. Please try again later.");
		}
	}

});
UserController.post("/:userid/unfollow", async function (req, res) {

	const { userid } = req.params;

	try {

		await (new UserService).unfollowUser(res.locals.userid, userid);

		res.redirect("/user/" + userid);
	}
	catch(error) {
		if(error instanceof ErrorEx) {
			res.status(error.statusCode).send({
				message: error.message,
				code: error.code
			});
		}
		else {
			console.log(error);
			res.status(500).send("Server Error. Please try again later.");
		}
	}

});
UserController.patch("/update",  async function (req, res) {
	const { username, bio } = req.body;
	
	try {
		if(!username) {
			throw new ErrorEx("Username cannot be empty.", "profile/empty-username", 400);
		}
		else {
			const userService = new UserService();
			
			await userService.updateProfile(res.locals.userid, username, bio ? bio : "");

			res.send({
				message: "Success",
				username,
				bio
			});
		}
	}
	catch(error) {
		if(error instanceof ErrorEx) {
			res.status(error.statusCode).send({
				message: error.message,
				code: error.code
			});
		}
		else {
			console.log(error);
			res.status(500).send("Server Error. Please try again later.");
		}
	}
})

module.exports = UserController;