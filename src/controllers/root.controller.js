const { Router } = require("express");
const SessionService = require("../services/session.service");

const RootController = Router();

RootController.get("/", async function(req, res) {
	if(req.cookies.sessionId) {
		try {
			const sessionService = new SessionService();
			const userId = await sessionService.verifySession(req.cookies.sessionId);

			res.render("index");
		}
		catch(error) {
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