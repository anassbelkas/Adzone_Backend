import http from "http";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import initializeDb from "./db";
import middleware from "./middleware";
import api from "./api";
import config from "./config.json";
import authRoute from "./api/auth";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

let app = express();
app.server = http.createServer(app);

const swaggerDefinition = {
	openapi: "3.0.0",
	info: {
		title: "Express API for JSONPlaceholder",
		version: "1.0.0",
	},
	servers: [
		{
			url: "http://localhost:8080",
			description: "Development server",
		},
	],
};

const options = {
	swaggerDefinition,
	// Paths to files containing OpenAPI definitions
	apis: ["src/api/*.js", "src/api/auth/*.js", "src/models/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
// logger
app.use(morgan("dev"));

// 3rd party middleware
app.use(
	cors({
		exposedHeaders: config.corsHeaders,
	})
);
app.use(express.static("public"));
app.use(
	bodyParser.json({
		limit: config.bodyLimit,
	})
);

// connect to db
initializeDb((db) => {
	// internal middleware
	app.use(middleware({ config, db }));
	// api router

	app.use("/api", api({ config, db }));
	app.use("/auth", authRoute);

	app.use(
		"/api-docs",
		swaggerUi.serve,
		swaggerUi.setup(swaggerSpec, { explorer: true })
	);

	app.server.listen(process.env.PORT || config.port, () => {
		console.log(`Started on port ${app.server.address().port}`);
	});
});

export default app;
