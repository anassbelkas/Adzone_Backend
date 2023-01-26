import User from "../models/user";
import fs from "fs";
//delete inactive users that are older than 1 day
export function deleteInactiveUsers() {
	User.find({
		active: false,
		created_at: { $lt: Date.now() - 1000 * 60 * 60 * 24 },
	})
		.then((users) => {
			users.forEach((user) => {
				user.remove();
			});
		})
		.catch((err) => {
			console.log(err);
		});
}

// find user by email
export function findUserByEmail(email) {
	return User.findOne({ email: email });
}
//find user by verification code
export function findUserByVerificationCode(verificationCode) {
	return User.findOne({ verification: verificationCode });
}

//create user 
export function createUser(email, password, verification) {
	return User.create({
		email: email,
		password: password,
		verification: verification,
	});
}

//save user
export function saveUser(user) {
	return user.save();
}
//find and update  user fields optionaly
export function findAndUpdateUser(userId, fields) {
	return User.findByIdAndUpdate(userId, fields);
}
//find user by id
export function findUserById(userId) {
	return User.findById(userId);
}

//find and verify password then update it with new password	and save it
export async function findAndUpdatePassword(userId, newPassword, oldPassword) {
	const user = await User.findById(userId);
	if (user.isValidPassword(oldPassword)) {
		user.password = newPassword;
		return user.save();
	}
	return false;
}

// remove user image from public folder
function removeUserImage(path) {
	const imagePath = `public/images/${path}`;
	fs.unlink(imagePath, (err) => {
		if (err) {
			console.log(err);
		}
	});
}

//change user image and delete old image
export async function changeUserImage(userId, image) {
	const user = await User.findById(userId);
	if (user.image) {
		removeUserImage(user.image);
	}
	user.image = image;
	return user.save();
}

//delete user
export function deleteUser(email) {
	return User.findOneAndDelete({ email });
}
