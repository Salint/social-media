const { Router } = require("express");
const ErrorEx = require("../util/ErrorEx");
const UserService = require("../services/user.service");

const AuthController = Router();

AuthController.get("/signup", async function (req, res) {

	const { username, email, password } = req.body;

	try {
		if(!username || !email || !password) {
			throw new ErrorEx("Please supply username, email and password.", "auth/insufficent-creds", 400);
		}
		else {
			const userService = new UserService();
			await userService.createUser(username, email, password);

			res.status(200).send("Success");
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
});

module.exports = AuthController;