const { Router } = require("express");
const UserService = require("../services/user.service");
const ErrorEx = require("../util/ErrorEx");

const ProfileController = Router();

ProfileController.get("/:userid", async function (req, res) {
	const { userid } = req.params;

	try {
		const userService = new UserService();
		const profile = await userService.getUserProfile(userid);

		res.status(200).send(profile);
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
ProfileController.patch("/update",  async function (req, res) {
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

module.exports = ProfileController;