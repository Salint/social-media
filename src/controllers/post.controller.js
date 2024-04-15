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

			res.redirect("/user");
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

PostController.get("/", async function (req, res) {

	try {
		const postService = new PostService();

		const posts = await postService.getPostsByFollowing(res.locals.userid);

		res.status(200).send(posts);
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

PostController.post("/:postid/like", async function (req, res) {

	const { postid } = req.params;

	try {

		await (new PostService).likePost(res.locals.userid, postid);

		res.status(200).send({
			message: "Success"
		});
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
PostController.post("/:postid/unlike", async function (req, res) {

	const { postid } = req.params;

	try {

		await (new PostService).unlikePost(res.locals.userid, postid);

		res.status(200).send({
			message: "Success"
		});
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

PostController.post("/:postid/comment", async function (req, res) {

	const { postid } = req.params;
	const { content } = req.body;
	
	try {

		await (new PostService).createComment(res.locals.userid, postid, content);

		res.status(200).send({
			message: "Success"
		});
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