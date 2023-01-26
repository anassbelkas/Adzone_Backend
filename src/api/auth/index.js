import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
	generatePassword,
	generateVerificationCode,
	issueJWT,
} from "../../lib/util";
import {
	sendVerificationEmail,
	sendPasswordResetEmail,
} from "../../lib/mailer";
import {
	findUserByEmail,
	findUserByVerificationCode,
	createUser,
	deleteUser
} from "../../service/user";

const authRoute = Router();
dotenv.config();

/**
 * @swagger
  "auth/signin": {
    "post": {
        "tags": [
            "Authentication"
        ],
        "requestBody": {
            "content": {
                "application/json": {
                    "schema": {
                        "$ref": "#/components/schemas/User"
                    }
                }
            },
            "required": true
        },
        "description": "Sign in to the application",
        "produces": [
            "application/json"
        ],
        "responses": {
            "200": {
                "description": "Successfully signed in",
                "schema": {
                    "$ref": "#/components/schemas/User",
					"token":"string",
					"expiresIn":"string"
                }
            },
			"204":{
				"description":"Please verify your email"
			},
			"400": {
				"description": "Invalid email or password"
			}
        }
    }
}
 */
authRoute.post("/signin", async (req, res) => {
	// Our login logic starts here
	try {
		// Get user input
		const { email, password } = req.body;

		// Validate user input
		if (!(email && password)) {
			console.log("Invalid email or password");
			res.status(400).json({ success: false, msg: "Invalid email or password" });
			return;
		}
		// Validate if user exist in our database
		const user = await findUserByEmail(email);

		if (user && user.isValidPassword(password)) {
			if (user.active) {
				const token = issueJWT(user);

				res.status(200).json({success: true, token, expiresIn: process.env.JWT_EXPIRES_IN, user});
				return;
			} else {
				res
					.status(201)
					.json({ success: false, msg: "Please verify your email !" });
				return;
			}
			// Create token
		}
		res.status(400).send({ success: false, msg: "Invalid credentials" });
	} catch (err) {
		console.log(err);
	}
});
/**
 * @swagger
  "auth/signup": {
    "post": {
        "tags": [
            "Authentication"
        ],
        "requestBody": {
            "content": {
                "application/json": {
                    "schema": {
                        "email": "string",
						"password": "string",
                    }
                }
            },
            "required": true
        },
        "description": "Sign up to the application",
        "produces": [
            "application/json"
        ],
        "responses": {
            "200": {
				"description": "Successfully signed up",
				"schema": {
					"msg":"string",
					"success":"boolean"
				}
            },
            "400": {
                "description": "Invalid email or password"
            },
			"409": {
				"description": "Email already exists"
			}
        }
    }
}
 * */
authRoute.post("/signup", async (req, res) => {
	try {
		// Get user input
		const {  email, password } = req.body;
		// Validate user input
		if (!(email && password)) {
			res.status(400).send({ success: false, msg: "All inputs are required" });
			return;
		}
		if (!isEmail(email)) {
			res.status(400).json({ success: false, msg: "Invalid Email" });
			return;
		}
		if (!isValidPassword(password)) {
			res.status(400).json({
				success: false,
				msg: "Password must be at least 8 characters long and contain at least one number, one uppercase and one lowercase letter",
			});

			return;
		}

		// check if user already exist
		// Validate if user exist in our database
		const oldUser = await findUserByEmail(email);

		if (oldUser && oldUser.active) {
			return res
				.status(409)
				.json({ success: false, msg: "User Already Exist. Please Login" });
		}

		//generate verification code
		var verificationCode = generateVerificationCode();

		// Create user in our database
		const createUserRecursive = () => {
			//create user then send verification email
			console.log('here');
			createUser(
				
				email.toLowerCase(), // sanitize: convert email to lowercase
				password,
				verificationCode
			)
				.then((user) => {
					sendVerificationEmail( user.email, verificationCode).catch(
						(err) => {
							console.log('verif',err);
						}
					);
					res
						.status(200)
						.json({ success: true, msg: "Please verify your email !" });
				})
				.catch((err) => {
					console.log('pattern',err);
					if (err.code === 11000) {
						//delete user if email already exists
						deleteUser(email).catch((err) => {
							console.log('delete',err);
						}
						);
						createUserRecursive();
					}
					if (err.keyPattern.verification) {
						verificationCode = generateVerificationCode();
						createUserRecursive();
					}
				});
		};

		createUserRecursive();
	} catch (err) {
		console.log(err);
	}
});

/**
 * @swagger
 * "auth/verify/{code}": {
 *  "get": {
 * 	"tags": ["Authentication"],
 * 	"description": "Verify email",
 * 	"produces": ["application/json"],
 * 	"responses": {
 * 		"200": {
 * 			"description": "Successfully verified email",
 * 			"schema": {
 * 				"msg":"string",
 * 				"success":"boolean"
 * 			}
 * 		},
 * 		"400": {
 * 			"description": "Invalid verification code"
 * 		}
 * 	}
 * }
 * }
 *
 */
authRoute.get("/verify/:code", async (req, res) => {
	const code = req.params.code;

	const user = await findUserByVerificationCode(code);
	if (user) {
		user.active = true;
		user.verificationCode = null;
		user.save().then((user) => {
			res
				.status(200)
				.json({ success: true, msg: "Account activated! Please SignIn ." });
			return;
		});
	} else {
		res.status(400).json({ success: false, msg: "verification code invalid" });
		return;
	}
});
//forgot password route
/**
 * @swagger
 * "auth/forgot-password": {
 * "post": {
 * 	"tags": ["Authentication"],
 * 	"requestBody": {
 * 		"content": {
 * 			"application/json": {
 * 				"schema": {
 * 					"email": "string"
 * 				}
 * 			}
 * 		},
 * 		"required": true
 * 	},
 * 	"description": "Forgot password",
 * 	"produces": ["application/json"],
 * 	"responses": {
 * 		"200": {
 * 			"description": "Successfully sent reset password email",
 * 			"schema": {
 * 				"msg":"string",
 * 				"success":"boolean"
 * 			}
 * 		},
 * 		"400": {
 * 			"description": "Invalid email"
 * 		}
 * 	}
 * }
 * }
 *
 */
authRoute.post("/forgot-password", async (req, res) => {
	try {
		const { email } = req.body;
		if (!email) {
			res.status(400).json({ success: false,msg:'Email required !' });;
			return;
		}
		if (!isEmail(email)) {
			res.status(400).json({ success: false, msg:"Invalid Email !"});;
			return;
		}
		const user = await findUserByEmail(email);
		if (!user || !user.active) {
			res.status(400).json({ success: false, msg: "User Not Found !" });;
			return;
		}
		const newPassword = generatePassword();
		user.password = newPassword;
		user.save().then((user) => {
			sendPasswordResetEmail( user.email, newPassword).catch(
				(err) => {
					console.log(err);
				}
			);
			res.status(200).json({ success: true, msg: "Please check your email" });
		});
	} catch (err) {
		console.log(err);
	}
});
//resend verification email
/**
 * @swagger
 * "auth/resend-verification": {
 * "post": {
 * 	"tags": ["Authentication"],
 * 	"requestBody": {
 * 		"content": {
 * 			"application/json": {
 * 				"schema": {
 * 					"email": "string"
 * 				}
 * 			}
 * 		},
 * 		"required": true
 * 	},
 * 	"description": "Resend verification email",
 * 	"produces": ["application/json"],
 * 	"responses": {
 * 		"200": {
 * 			"description": "Successfully sent verification email",
 * 			"schema": {
 * 				"msg":"string",
 * 				"success":"boolean"
 * 			}
 * 		},
 * 		"400": {
 * 			"description": "Invalid email"
 * 		}
 * 	}
 * }
 * }
 * */
authRoute.post("/resend-verification", async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			res.status(400).json({ success: false, msg: "Email is required" });
			return;
		}
		if (!isEmail(email)) {
			res.status(400).json({ success: false, msg: "Invalid Email" });
			return;
		}
		const user = await findUserByEmail(email);
		if (!user || user.active) {
			res.status(400).json({ success: false, msg : "User does not exist" });
			return;
		}
		const verificationCode = generateVerificationCode();
		user.verification = verificationCode;

		const createUserRecursive = async () => {
			await user.save().then((user) => {
				console.log(user);
				sendVerificationEmail( user.email, verificationCode).catch(
					(err) => {
						console.log(err);
					}
				);
				res.status(200).json({ success: true, msg: "Please check your email" });
			}).catch((err) => {
				if (err.keyPattern.verification) {
					user.verification = generateVerificationCode();
					createUserRecursive();
				}
				
			});
		}
		createUserRecursive();
	} catch (err) {
		console.log(err);
	}
}
);

		



const isEmail = (email) => {
	var emailFormat =
		/^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
	if (email !== "" && email.match(emailFormat)) {
		return true;
	} else {
		return false;
	}
};

const isValidPassword = (password) => {
	var passwordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
	if (password !== "" && password.match(passwordFormat)) {
		return true;
	} else {
		return false;
	}
};



export default authRoute;
