const { Router } = require("express");
const ErrorEx = require("../util/ErrorEx");
const UserService = require("../services/user.service");
const SessionService = require("../services/session.service");

const AuthController = Router();

AuthController.get("/signup", async function (req, res) {

	const { username, email, password } = req.body;

	try {
		if(!username || !email || !password) {
			throw new ErrorEx("Please supply username, email and password.", "auth/insufficent-creds", 400);
		}
		else {
			const userService = new UserService();
			const id = await userService.createUser(username, email, password);

			const sessionID = await (new SessionService()).createNewUserSession(id);

			res.status(200).send({
				message: "Success",
				id,
				sessionID
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
});

AuthController.get("/login", async function (req, res) {

	const { username, password } = req.body;

	try {
		if(!username || !password) {
			throw new ErrorEx("Please supply username and password.", "auth/insufficent-creds", 400);
		}
		else {
			
			const userService = new UserService();
			const id = await userService.loginUser(username, password);

			const sessionID = await (new SessionService()).createExistingUserSession(id);

			res
			.status(200)
			.cookie("sessionId", sessionID, {
				expires: new Date(Date.now() + 24 * 3600000)
			})
			.send({
				message: "Success",
				id
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
});

module.exports = AuthController;