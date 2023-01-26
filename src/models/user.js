import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * @swagger
 * "components": {
    "schemas": {
        "User": {
            "type": "object",
            "required": [
                "email",
                "password"
            ],
            "properties": {
                "_id": {
                    "type": "integer",
                    "description": "The auto-generated id of the book."
                },
				"firstName": {
					"type": "string",
					"description": "The first name of the user."
				},
				"lastName": {
					"type": "string",
					"description": "The last name of the user."
				},
				,
                "email": {
                    "type": "string",
                    "description": "The email of the user."
                },
                "password": {
                    "type": "string",
                    "description": "The password of the user."
                },
				"active": {
					"type": "boolean",
					"description": "The active status of the user."
				},
				"roles": {
					"type": "array",
					"description": "The roles of the user."
				},
				"verification":{
					"type": "string",
					"description": "The verification code of the user."
				},
                "createdAt": {
                    "type": "string",
                    "format": "date",
                    "description": "The date of the record creation."
                }
            }
        }
    }
}
 */

const userSchema = new mongoose.Schema({
	first_name: { type: String, default: null },
	last_name: { type: String, default: null },
	email: { type: String, unique: true },
	password: { type: String },
	active: { type: Boolean , default: false },
	verification: { type: String, default: null, unique: true },
	image: { type: String, default: null },
	points: { type: Number, default: 0 },
	last_reward: { type: Date, default: null },
	roles: { type: [String], default: ["user"] },
	created_at: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
	const user = this;
	const hash = await bcrypt.hash(this.password, 10);

	this.password = hash;
	next();
});

userSchema.methods.isValidPassword = async function (password) {
	const user = this;
	const compare = await bcrypt.compare(password, user.password);

	return compare;
};
const User = mongoose.model("User", userSchema);
export default User;
