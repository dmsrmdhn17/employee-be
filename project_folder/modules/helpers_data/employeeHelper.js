const db = require("../../config/db/db_helper");
const format_responses = require("../../helpers/format_responseHelper");

class Helper {
	static async data_employee({ id, nik, notEqualsId }) {
		return await new Promise(async (resolve, reject) => {
			try {
				let where = ``;
				if (id) {
					if (!notEqualsId) {
						where += `and e.id = ${id} `;
					} else {
						where += `and e.id <> ${id} `;
					}
				}

				if (nik) {
					where += `and e.nik = '${nik}' `;
				}

				await db.executeSelectQuery(`select e.* from public.employee e where e."deletedAt" is null ${where}`).then(async (data) => {
					resolve(data);
				});
			} catch (error) {
				reject(format_responses.error_server(error));
			}
		});
	}

	static async data_employee_profile({ employee_id }) {
		return await new Promise(async (resolve, reject) => {
			try {
				let where = ``;
				if (employee_id) {
					where += `and ep.employee_id <> ${employee_id} `;
				}

				await db.executeSelectQuery(`select ep.* from public.employee_profile ep where ep."deletedAt" is null ${where}`).then(async (data) => {
					resolve(data);
				});
			} catch (error) {
				reject(format_responses.error_server(error));
			}
		});
	}

	static async data_employee_family({ id }) {
		return await new Promise(async (resolve, reject) => {
			try {
				let where = ``;
				if (id) {
					where += `and ef.id <> ${id} `;
				}

				await db.executeSelectQuery(`select ef.* from public.employee_family ef where ef."deletedAt" is null ${where}`).then(async (data) => {
					resolve(data);
				});
			} catch (error) {
				reject(format_responses.error_server(error));
			}
		});
	}
}
module.exports = Helper;
