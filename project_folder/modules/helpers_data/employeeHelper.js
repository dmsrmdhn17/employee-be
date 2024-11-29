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
}
module.exports = Helper;
