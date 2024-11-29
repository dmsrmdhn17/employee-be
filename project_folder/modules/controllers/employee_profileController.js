// HELPERS
// const { DB } = require("../../config/db/index");
// const db = require("../../config/db/db_helper");
const check = require("../../helpers/check");
const format_responses = require("../../helpers/format_responseHelper");
const employeeHelper = require("../helpers_data/employeeHelper");
const extendedModelHelper = require("../../helpers/extended_modelHelper");

// MODELS
const employee_profileModel = require("../models/employee_profileModel");

class Controller {
	static update_employee_profile() {
		return async (req, res, next) => {
			try {
				const { employee_id, place_of_birth, date_of_birth, gender, is_married, prof_pict } = req.body;

				let arr_validate_input = [
					{ method: "number", key: parseInt(employee_id), variable_name: "Id pegawai" },
					{ method: "string", key: place_of_birth, variable_name: "Tempat lahir" },
					{ method: "string", key: date_of_birth, variable_name: "Tanggal lahir" },
					{ method: "string", key: gender, variable_name: "Jenis kelamin" },
				];

				await check.multiple_check_stringvar(req, res, arr_validate_input, next);

				if (!req.body.responses) {
					await employeeHelper
						.data_employee({ id: employee_id })
						.then(async (data) => {
							if (data.length < 1) {
								req.body.responses = format_responses.error_204("Gagal, id tidak ditemukan!");
							} else {
								await extendedModelHelper
									.update({
										req,
										model: employee_profileModel,
										data: {
											place_of_birth,
											date_of_birth,
											gender,
											is_married,
											prof_pict,
										},
										whereData: { employee_id },
									})
									.then(async (result_employee) => {
										req.body.responses = format_responses.berhasil_update(result_employee);
									});
							}
						})
						.catch((error) => {
							req.body.responses = error;
						});
				}
			} catch (error) {
				req.body.responses = format_responses.error_server(error);
			}
			next();
		};
	}
}

module.exports = Controller;
