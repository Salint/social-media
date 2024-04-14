const { Router } = require("express");

const RootController = Router();

RootController.get("/", function(req, res) {
	const { username, email, message } = req.query;
	res.render("login", { username, email, message });
});

RootController.get("/signup", function(req, res) {
	const { username, email, message } = req.query;
	res.render("signup", { username, email, message });
});

module.exports = RootController;