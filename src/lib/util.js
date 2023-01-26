import crypto from "crypto";
import jwt from "jsonwebtoken";
/**	Creates a callback that proxies node callback style arguments to an Express Response object.
 *	@param {express.Response} res	Express HTTP Response
 *	@param {number} [status=200]	Status code to send on success
 *
 *	@example
 *		list(req, res) {
 *			collection.find({}, toRes(res));
 *		}
 */
export function toRes(res, status = 200) {
	return (err, thing) => {
		if (err) return res.status(500).send(err);

		if (thing && typeof thing.toObject === "function") {
			thing = thing.toObject();
		}
		res.status(status).json(thing);
	};
}

//account verification code
export function generateVerificationCode() {
	var r = crypto.randomBytes(6).toString("hex").substring(0, 6);

	return r;
}

export function generatePassword() {
	//generate password with capital letter, number and special character
	var password = Math.random().toString(36).slice(-10);
	//make  letter in string capital
	var capital = password.charAt(0).toUpperCase() + password.slice(1);
	return capital;
}

export function issueJWT(user) {
	const id = user._id;
	const expires_In = "2w";
	const payload = {
		sub: id,
		iat: Date.now(),
	};
	const signedToken = jwt.sign(payload, process.env.JWT_TOKEN, {
		expiresIn: expires_In,
	});
	return "Bearer " + signedToken;
}

//function repeat every hour
export function repeatEveryHour(callback) {
	setInterval(() => {
		callback();
	}, 1000 * 60 * 60);
}

//middleware to check roles
export function checkRoles(roles) {
	return (req, res, next) => {
		console.log(req.user);
		if (roles.includes(req.user.role)) {
			next();
		} else {
			res.status(401).send("Unauthorized");
		}
	};
}
//check if 2 hours passed since last reward
export function checkLastReward(req, res, next) {
	if (req.user.last_reward) {
		var last_reward = new Date(req.user.last_reward);
		var now = new Date();
		var diff = now.getTime() - last_reward.getTime();
		var hours = Math.floor(diff / (1000 * 60 * 60));
		if (hours >= 2) {
			next();
		} else {
			res.status(401).send("You can only receive points once every 2 hours");
		}
	} else {
		next();
	}
}
