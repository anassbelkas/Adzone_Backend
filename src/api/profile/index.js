import { Router } from "express";
import {
	findAndUpdateUser,
	findAndUpdatePassword,
	changeUserImage,
	findUserById
} from "../../service/user";
import { pickBy } from "lodash";
import imageUpload from "../../lib/upload";
const profileRoute = Router();

/**
 * @swagger
 * "api/profile/update": {
 *  "post": {
 *     "tags": [
 *        "Profile"
 *    ],
 *   "requestBody": {
 *     "content": {
 *      "application/json": {
 *       "schema": {
 *       "firstName": "string",
 *      "lastName": "string",
 *      }
 *    }
 * },
 * "description": "Update profile",
 * "produces": [
 *   "application/json"
 * ],
 * "responses": {
 *  "200": {
 *   "description": "Successfully updated",
 *  "schema": {
 *  "$ref": "#/components/schemas/User"
 * }
 * },
 * "400": {
 * "description": "Invalid email or password"
 * }
 * }
 * }
 * }
 */

profileRoute.post("/update", async (req, res) => {
	const fields = {
		first_name: req.body.firstName,
		last_name: req.body.lastName,
	};
	const userId = req.user._id;
	const user = await findAndUpdateUser(userId, pickBy(fields));
	res.json(user);
});

/**
 * @swagger
 * "api/profile/updatePassword": {
 * "post": {
 *   "tags": [
 *     "Profile"
 *  ],
 * "requestBody": {
 * "content": {
 * "application/json": {
 * "schema": {
 * "oldPassword": "string",
 * "newPassword": "string",
 * }
 * }
 * },
 * "description": "Update password",
 * "produces": [
 * "application/json"
 * ],
 * "responses": {
 * "200": {
 * "description": "Successfully updated",
 * "schema": {
 * "$ref": "#/components/schemas/User"
 * }
 * },
 * "400": {
 * "description": "Invalid email or password"
 * }
 * }
 * }
 * }
 */
profileRoute.post("/updatePassword", async (req, res) => {
	const { oldPassword, newPassword } = req.body;
	const userId = req.user._id;
	const user = await findAndUpdatePassword(userId, oldPassword, newPassword);
	if (!user) {
		res.status(400).send("Invalid password");
		return;
	}
	res.json(user);
});

/**
 * @swagger
 * "api/profile/updateAvatar": {
 * "post": {
 *  "tags": [
 *   "Profile"
 * ],
 * "parameters": {
 * "file": {
 * "in": "formData",
 * "name": "file",
 * "type": "file",
 * "description": "Avatar"
 * }
 * },
 * "requestBody": {
 * "content": {
 * "multipart/form-data": {
 * "schema": {
 * }
 * }
 * },
 * "description": "Update avatar",
 * "produces": [
 * "application/json"
 * ],
 * "responses": {
 * "200": {
 * "description": "Successfully updated",
 * "schema": {
 * "$ref": "#/components/schemas/User"
 * }
 * },
 * "400": {
 * "description": "Invalid email or password"
 * }
 * }
 * }
 * }
 *
 */
profileRoute.post(
	"/updateAvatar",
	imageUpload.single("pdp"),
	async (req, res) => {
		const userId = req.user._id;
		const user = await changeUserImage(userId, req.file.filename);
		res.json(user);
	}
);

/**
 * @swagger
 * "api/profile/": {
 * "get": {
 * "tags": [
 * "Profile"
 * ],
 * "parameters": {
 * "id": {
 * "in": "query",
 * "name": "id",
 * "type": "string",
 * "description": "User id"
 * }
 * },
 * 	"description": "Get profile",	
 * "produces": [
 * "application/json"
 * ],
 * "responses": {
 * "200": {
 * "description": "Successfully updated",
 * "schema": {
 * "$ref": "#/components/schemas/User"
 * }
 * },
 * "400": {
 * "description": "Invalid email or password"
 * }
 * 	}
 * }
 * }
 *
 */
profileRoute.get("/", async (req, res) => {
	const userId = req.user._id;
	const user = await findUserById(userId);
	res.json(user);
}
);


export default profileRoute;
