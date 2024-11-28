const process = require("node:process");
const { logError } = require("./crash_log_handler");
const { APP_ENV } = require("../helpers/env/env_config");
const { getRequest } = require("./requestHandler");

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
	const request = getRequest();
	if (APP_ENV === "DEV") {
		console.error("Unhandled Rejection at:", promise, "reason:", reason);
	} else {
		logError({ errorType: "Unhandled Rejection", reason, message: "Unhandled Rejection", promise, request });
	}
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
	const request = getRequest();
	if (APP_ENV === "DEV") {
		console.error("Uncaught Exception:", error.message);
	} else {
		logError({ errorType: "uncaughtException", message: "uncaughtException : " + `${error.message}`, error, request });
	}
});

// Handle warnings
process.on("warning", (warning) => {
	console.warn("Warning:", warning.name, warning.message, warning.stack);
});

// Handle signals (like Ctrl+C)
process.on("SIGINT", () => {
	if (APP_ENV === "DEV") {
		console.log("Received SIGINT. Exiting gracefully.");
	} else {
		logError({ errorType: "SIGINT", message: "Service Dimatikan" });
	}
	process.exit(0);
});

// Handle exit events
process.on("exit", (code) => {
	if (APP_ENV === "DEV") {
		console.log(`Process exited with code: ${code}`);
	} else {
		logError({ errorType: "Exit", message: "Service Mati" });
	}
});

// Handle other signal events, like SIGTERM
process.on("SIGTERM", () => {
	if (APP_ENV === "DEV") {
		console.log("Received SIGTERM. Shutting down.");
	} else {
		logError({ errorType: "SIGTERM", message: "Service Dimatikan" });
	}
	process.exit(0);
});

process.on("SIGUSR2", () => {
	if (APP_ENV === "DEV") {
		console.log("Received SIGUSR2. Shutting down.");
	} else {
		logError({ errorType: "SIGUSR2", message: "Memory Leaks" });
	}
	process.exit(0);
});

module.exports = {}; // Export if needed to be required elsewhere
