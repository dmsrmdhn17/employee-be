const format_responseHelper = require("../helpers/format_responseHelper");

const cleanKeyword = (inputStr) => {
	if (typeof sanitizedInput !== "string") {
		return inputStr;
	}
	// Define a list of characters that need to be replaced
	const charsToReplace = [";", "--", "'", '"', "=", "<", ">", "(", ")", "UNION", "SELECT", "FROM", "WHERE", "INSERT", "UPDATE", "DELETE", "DROP", "CREATE", "ALTER", "EXEC"];

	// Replace each character with an empty string
	charsToReplace.forEach((char) => {
		inputStr = inputStr.split(char).join("");
	});

	return inputStr;
};
const cleanInput = (input) => {
	if (typeof input === "object") {
		for (let key in input) {
			if (Object.prototype.hasOwnProperty.call(input, key)) {
				if (typeof input[key] === "string") {
					// Remove characters commonly used in SQL injection
					// input[key] = input[key].replace(/[\';\-\-]/g, '');
					input[key] = cleanKeyword(input[key]);
				}
			}
		}
	}
	return input;
};

const cleanMiddleware = (req, res, next) => {
	try {
		// console.log({req});
		// Clean query parameters
		req.query = cleanInput(req.query);

		// Clean request body
		req.body = cleanInput(req.body);

		// Clean route parameters
		req.params = cleanInput(req.params);
		next();
	} catch (err) {
		console.log(err);
		req.body.responses = format_responseHelper.error_server(err);
	}
};

module.exports = cleanMiddleware;
