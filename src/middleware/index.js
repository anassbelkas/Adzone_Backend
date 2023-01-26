import { Router } from "express";
import { jwt } from "jsonwebtoken";
import passport from "passport";
import passsport from "../api/auth/passport";
import { checkRoles } from "../lib/util";

export default ({ config, db }) => {
	let routes = Router();
	passsport(passport);
	routes.use("/api", passport.authenticate("jwt", { session: false }));

	return routes;
};
