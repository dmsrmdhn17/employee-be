// HELPERS
// const { DB } = require("../../config/db/index");
const db = require("../../config/db/db_helper");
const check = require("../../helpers/check");
const format_responses = require("../../helpers/format_responseHelper");

// MODELS
// const employeeModel = require("../models/employeeModel");
// const employee_profileModel = require("../models/employee_profileModel");

class Controller {
	static list_employee() {
		return async (req, res, next) => {
			try {
				const { limit, pages, sort_key, sort_by, nik } = req.query;

				await check.multiple_check_stringvar(
					req,
					res,
					[
						{ method: "string", key: limit, variable_name: "limit" },
						{ method: "string", key: pages, variable_name: "pages" },
					],
					next,
				);

				let where = ``;
				if (nik && nik !== "") {
					where += `and e.nik = '${nik}' `;
				}

				let sorting = `ORDER BY e.id`;
				if (sort_key && sort_by && sort_key !== "" && sort_by !== "") {
					sorting = `ORDER BY e.${sort_key} ${sort_by}`;
				}

				const offset = (pages - 1) * limit;

				if (!req.body.responses) {
					await Promise.all([
						db.executeSelectQuery(`select e.* from public.employee e where e."deletedAt" is null ${where} ${sorting} limit ${limit} offset ${offset}`),
						db.executeSelectQuery(`select count(e.id) from public.employee e where e."deletedAt" is null ${where} ${sorting}`),
					])
						.then(([data, count]) => {
							req.body.responses = format_responses.berhasil_list(data, pages, count.total, limit);
						})
						.catch((error) => {
							req.body.responses = format_responses.error_400(`Gagal, terjadi kesalahan saat proses data!`, error);
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
