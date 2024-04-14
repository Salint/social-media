const { Router } = require("express");
const ErrorEx = require("../util/ErrorEx");
const PostService = require("../services/post.service");

const PostController = Router();

PostController.post("/", async function (req, res) {
	const { content } = req.body;

	try {
		if(!content) {
			throw new ErrorEx("There is no content.", "post/no-content-available", 400);
		}
		else {
			const postService = new PostService();

			await postService.createPost(res.locals.userid, content);

			res.status(200).send({
				message: "Success"
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

module.exports = PostController;