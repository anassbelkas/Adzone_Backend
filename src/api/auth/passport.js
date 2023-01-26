import { Strategy, ExtractJwt } from "passport-jwt";
import User from "../../models/user";
import dotenv from "dotenv";
dotenv.config();
const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_TOKEN,
};

const strategy = new Strategy(opts, (payload, done) => {
	User.findOne({ _id: payload.sub })
		.then((user) => {
			if (user) {
				return done(null, user);
			} else {
				return done(null, false);
			}
		})
		.catch((error) => {
			done(error, null);
		});
});

export default (passport) => {
	passport.use(strategy);
};
