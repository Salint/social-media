const express = require("express");

class ServerService {
	
	static start(port) {

		const app = express();

		app.get("/", (req, res) => {
			res.send("Test");
		});

		app.listen(port);
		console.log("Listening on PORT " + port);
	}
}

module.exports = ServerService;