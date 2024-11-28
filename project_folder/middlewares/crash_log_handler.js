const { createLogger, format, transports } = require("winston");
const LokiTransport = require("winston-loki");
const { LOKI_IP, LOKI_PORT, SERVICE_NAME, CLIENT_NAME } = require("../helpers/env/env_config");

const options = {
	level: "info", // Set the log level
	format: format.combine(
		format.timestamp(),
		format.json(), // Log format as JSON with timestamps
		format.errors({ stack: true }),
	),
	transports: [
		// Adding the LokiTransport to send logs to Loki
		new LokiTransport({
			host: `${LOKI_IP}:${LOKI_PORT}`, // Loki instance URL
			json: true, // Send logs in JSON format
			labels: { APP_NAME: SERVICE_NAME, CLIENT: CLIENT_NAME, Type: "CRASH_LOGS" }, // Additional labels
			level: "info", // Log level for Loki transport
		}),
		// Optionally, you can also add console or file transports
		new transports.Console({
			format: format.simple(), // Simple format for console logs
			level: "debug", // Console log level
		}),
	],
};

// Create the logger with the specified options
const logger = createLogger(options);

exports.logError = async ({ message, errorType, reason, promise, error, request }) => {
	// Safely handle the reason (Error object)
	const reasonStr = reason instanceof Error ? reason.stack || reason.message : JSON.stringify(reason, null, 2) || "No reason provided";

	// Handle the promise details
	const promiseStr = promise ? await formatPromise(promise) : "No promise information";

	// Error details - ensure stringified format for logging
	const errorDetails = error instanceof Error ? error.stack || error.message : "No error details";

	const requestDetails = JSON.stringify(request, null, 2) || "No request details";

	// Structured log for better readability
	const logMessage = `
    Error Type: ${errorType}
    Message: ${message || "No message provided"}
    Reason: ${reasonStr}
    Promise: ${promiseStr}
    Error Details: ${errorDetails}
	Request Details: ${requestDetails}
    `;

	// Logging the error using winston
	logger.error(logMessage, {
		tipe: "ERROR",
		status: 500,
		App: SERVICE_NAME,
		Client: CLIENT_NAME,
	});
};

// Format promise to capture stack trace if it fails
async function formatPromise(promise) {
	try {
		await promise; // Wait for promise resolution or rejection
		return "Promise resolved"; // If resolved
	} catch (error) {
		// Return the full stack trace if the promise rejected with an Error
		return error instanceof Error ? error.stack || error.message : JSON.stringify(error) || error.toString();
	}
}
