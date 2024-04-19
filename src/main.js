const env = require("dotenv");

// Services
const ServerService = require("./services/server.service");
const DatabaseService = require("./services/database.service");

if(process.env.NODE_ENV != "PRODUCTION") {
	env.config();
}

function Main() {
	if(!process.env.PORT)
		throw new Error("Please specify a PORT environment variable.");
	else if(!process.env.DB_HOST)
		throw new Error("Please specify a DB_HOST environment variable.");
	else if(!process.env.DB_USERNAME)
		throw new Error("Please specify a DB_USERNAME environment variable.");
	else if(!process.env.DB_NAME)
		throw new Error("Please specify a DB_NAME environment variable.");

	else {

		ServerService.start(process.env.PORT);
		DatabaseService.start(process.env.DB_HOST, process.env.DB_USERNAME, process.env.DB_PASSWORD, process.env.DB_NAME);
	}
}

module.exports = Main;