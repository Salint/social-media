const SessionService = require("../services/session.service");
const ErrorEx = require("../util/ErrorEx");

async function AuthMiddleware (req, res, next) {
	const { sessionId } = req.cookies;

	try {
		if(!sessionId) {
			throw new ErrorEx("You are not logged in.", "auth/unauthenticated", 401);
		}
		else {
			const sessionService = new SessionService();
			const id = await sessionService.verifySession(sessionId);

			res.locals.userid = id;
			next();
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
}

module.exports = AuthMiddleware