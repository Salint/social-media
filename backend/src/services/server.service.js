const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Controllers
const AuthController = require("../controllers/auth.controller");

class ServerService {
	
	static start(port) {

		const app = express();

		app.use(cors());
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: false }));

		app.use("/auth", AuthController);

		app.listen(port);
		console.log("Listening on PORT " + port);
	}
}

module.exports = ServerService;