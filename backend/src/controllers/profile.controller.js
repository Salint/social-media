const { Router } = require("express");

const ProfileController = Router();

ProfileController.get("/", async function (req, res) {
	res.send("Hello, world");
});

module.exports = ProfileController;