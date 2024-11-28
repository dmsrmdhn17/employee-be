// HELPERS
// const { DB } = require("../../config/db/index");
// const db = require("../../config/db/db_helper");
// const check = require("../../helpers/check");
const format_responses = require("../../helpers/format_responseHelper");

// MODELS
// const employee_profileModel = require("../models/employee_profileModel");

class Controller {
	static list_employee() {
		return async (req, res, next) => {
			try {
				const { nik } = req.query;
				console.log(nik);
			} catch (error) {
				req.body.responses = format_responses.error_server(error);
			}
			next();
		};
	}
}

module.exports = Controller;
