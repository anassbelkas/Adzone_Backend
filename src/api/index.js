import { version } from "../../package.json";
import { Router } from "express";
import { repeatEveryHour } from "../lib/util";
import { deleteInactiveUsers } from "../service/user";
import profileRoute from "./profile";

export default ({ config, db }) => {
	let api = Router();
	repeatEveryHour(deleteInactiveUsers);
	// mount the facets resource
	api.use("/profile", profileRoute);
	// perhaps expose some API metadata at the root
	api.get("/", (req, res) => {
		res.json({ version });
	});

	return api;
};
