require("dotenv").config();

const EXPRESS = require("express");
const SESSION = require("express-session");
const CORS = require("cors");
const MORGAN = require("morgan");
const HPP = require("hpp");
const MOMENT = require("moment");
const HELMET = require("helmet");
const BODYPARSER = require("body-parser");
const REDIS_STORE = require("connect-redis").default;
const HTTP = require("http");

const ROUTERS = require("./project_folder");
const { DB } = require("./project_folder/config/db/index");
const { CLIENT_1 } = require("./project_folder/config/redis/index");
const store = new REDIS_STORE({ client: CLIENT_1 });
const WEBSOCKET = require("./project_folder/config/socket/index");
const SANITIZEINPUT = require("./project_folder/middlewares/sanitize_inputMiddleware");
const ENV_CONFIG = require("./project_folder/helpers/env/env_config");

const APP = EXPRESS();
const PORT = ENV_CONFIG.PORT_EXPRESS || 5044;
const { setRequest } = require("./project_folder/middlewares/requestHandler");
require("./project_folder/middlewares/eventHandler");

MORGAN.token("date", function () {
	var p = MOMENT().format();
	return p;
});

// Middleware to capture request details
APP.use((req, res, next) => {
	const requestDetails = {
		method: req.method,
		url: req.originalUrl || req.url,
		headers: req.headers,
		body: req.body,
		ip: req.ip,
	};
	setRequest(requestDetails);
	next();
});
APP.use(HPP({ checkBody: false }));
APP.use(MORGAN(":remote-user [:date[web]] - :method :url :status :res[content-length] - :response-time ms"));
APP.use(CORS());
APP.use(HELMET());
APP.use(EXPRESS.json({ limit: "500mb" }));
APP.use(
	SESSION({
		store,
		secret: ENV_CONFIG.KEY,
		resave: false,
		saveUninitialized: false,
		cookie: { secure: false }, // Set secure: true in production
	}),
);
APP.use(BODYPARSER.json());
APP.use(BODYPARSER.urlencoded({ extended: false }));
APP.use(BODYPARSER.raw({ type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", limit: "10mb" }));
APP.use(EXPRESS.urlencoded({ limit: "500mb", extended: true }));
APP.use(SANITIZEINPUT);
APP.use("/", ROUTERS);
APP.use((req, res) => {
	res.status(404).json({ status: "404 Path not Found" });
});
APP.disable("x-powered-by");

const SERVER = HTTP.createServer(APP);
WEBSOCKET(SERVER);

SERVER.listen(PORT, async () => {
	console.log(`ACTIVE IN PORT ${PORT}`);
	try {
		// await CLIENT_1.connect();
		// await CLIENT_2.connect();
		await DB.authenticate();
		console.log("DATABASE OK");
	} catch (error) {
		console.error("DATABASE ERROR", error);
	}
});
