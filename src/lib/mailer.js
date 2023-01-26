import { createTransport } from "nodemailer";
const user = process.env.GMAIL_USER;
const password = process.env.GMAIL_PASSWORD;

const transport = createTransport({
	service: "Gmail",
	auth: {
		user: user,
		pass: password,
	},
});

const sendVerificationEmail = ( email, verificationCode) => {
	return transport.sendMail({
		from: user,
		to: email,
		subject: "Please confirm your account",
		html: `<h1>Email Verification</h1>
        <h1>Hello</h1>
        <p>Thank you for subscribing. here is the verification code</p>
        <h2>${verificationCode}</h2>
        </div>`,
	});
};
//send password reset email
const sendPasswordResetEmail = ( email, password) => {
	return transport.sendMail({
		from: user,
		to: email,
		subject: "Password Reset",
		html: `<h1>Password Reset</h1>
		<h1>Hello</h1>
		<p>Your password has been reset to <strong>${password}</strong></p>
		</div>`,
	});
};

export { sendVerificationEmail, sendPasswordResetEmail };
