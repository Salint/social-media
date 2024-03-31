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

module.exports = ProfileController;