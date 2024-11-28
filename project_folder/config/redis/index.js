const { createClient } = require("redis");

const { REDIS_HOST } = require("../../helpers/env/env_config");

// connect to regis
const CLIENT_1 = createClient({
	url: REDIS_HOST,
	pingInterval: 10000,
});

CLIENT_1.on("connect", () => {
	console.log("REDIS 1 CONNECTED");
});

CLIENT_1.on("error", (err) => {
	console.error("REDIS 1 ERROR", err);
});

const CLIENT_2 = createClient({
	url: REDIS_HOST,
	pingInterval: 10000,
});

CLIENT_2.on("connect", () => {
	console.log("REDIS 2 CONNECTED");
});

CLIENT_2.on("error", (err) => {
	console.error("REDIS 2 ERROR", err);
});

module.exports = { CLIENT_1, CLIENT_2 };
