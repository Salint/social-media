const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// Controllers
const AuthController = require("../controllers/auth.controller");
const UserController = require("../controllers/user.controller");
const PostController = require("../controllers/post.controller");

// Middleware 
const AuthMiddleware = require("../middleware/auth.middleware");

class ServerService {
	
	static start(port) {

		const app = express();

		app.set("view engine", "ejs");


		app.use(cors());
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: false }));
		app.use(cookieParser());
		app.use("/static", express.static("static"));

		app.use("/auth", AuthController);
		app.use("/user", AuthMiddleware, UserController);
		app.use("/post", AuthMiddleware, PostController);

		app.listen(port);
		console.log("Listening on PORT " + port);
	}
}

module.exports = ServerService;