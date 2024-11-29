// HELPERS
const { DB } = require("../../config/db/index");
const db = require("../../config/db/db_helper");
const check = require("../../helpers/check");
const format_responses = require("../../helpers/format_responseHelper");
const employeeHelper = require("../helpers_data/employeeHelper");
const extendedModelHelper = require("../../helpers/extended_modelHelper");

// MODELS
const employeeModel = require("../models/employeeModel");
const employee_profileModel = require("../models/employee_profileModel");
const educationModel = require("../models/educationModel");
const employee_familyModel = require("../models/employee_familyModel");

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
						db.executeSelectOneQuery(`select count(e.id) AS total from public.employee e where e."deletedAt" is null ${where}`),
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

	static get_employee_by_id() {
		return async (req, res, next) => {
			try {
				const { id } = req.query;

				await check.multiple_check_stringvar(req, res, [{ method: "string", key: id, variable_name: "id" }], next);

				if (!req.body.responses) {
					await db
						.executeSelectQuery(
							`SELECT 
									ep.place_of_birth,
									ep.date_of_birth,
									ep.gender,
									CASE 
										WHEN ep.is_married IS TRUE THEN 'Sudah menikah' 
										ELSE 'Belum menikah' 
									END AS marital_status,
									e.*,
									(
										SELECT COALESCE(
											json_agg(
												json_build_object(
													'edu_name', e2."name",
													'edu_level', e2."level",
													'edu_description', e2.description
												)
											), '[]'
										)
										FROM public.education e2
										WHERE e2.employee_id = e.id
									) AS education_data,
									(
										SELECT COALESCE(
											json_agg(
												json_build_object(
													'fam_name', ef."name",
													'fam_identifier', ef.identifier,
													'fam_job', ef.job,
													'fam_place_ob', ef.place_of_birth,
													'fam_date_ob', ef.date_of_birth,
													'fam_religion', ef.religion,
													'is_life',
													CASE 
														WHEN ef.is_life IS TRUE THEN 'Masih hidup' 
														ELSE 'Meninggal dunia' 
													END,
													'is_divorced',
													CASE 
														WHEN ef.is_divorced IS TRUE THEN 'Cerai' 
														ELSE 'Tidak' 
													END,
													'relation_status', ef.relation_status
												)
											), '[]'
										)
										FROM public.employee_family ef
										WHERE ef.employee_id = e.id
									) AS family_data
							FROM 
								public.employee e
							LEFT JOIN 
								public.employee_profile ep ON e.id = ep.employee_id
							WHERE 
								e."deletedAt" IS NULL 
								AND e.id = ${id};
								`,
						)
						.then(async (result) => {
							if (result.length > 0) {
								req.body.responses = format_responses.berhasil_object(result[0]);
							} else {
								req.body.responses = format_responses.error_404(`Data pegawai dengan id ${id} tidak ditemukan!`);
							}
						});
				}
			} catch (error) {
				req.body.responses = format_responses.error_server(error);
			}
			next();
		};
	}

	static create_employee() {
		return async (req, res, next) => {
			// Manual Transaction
			let manual_transaction = null;
			let is_commit = false;

			try {
				const { nik, name, is_active, start_date, end_date, place_of_birth, date_of_birth, gender, is_married, prof_pict } = req.body;

				let arr_validate_input = [
					{ method: "string", key: nik, variable_name: "NIK" },
					{ method: "string", key: name, variable_name: "Nama pegawai" },
					{ method: "string", key: start_date, variable_name: "Tanggal mulai" },
					{ method: "string", key: end_date, variable_name: "Tanggal berakhir" },
					{ method: "string", key: place_of_birth, variable_name: "Tempat lahir pegawai" },
					{ method: "string", key: date_of_birth, variable_name: "Tanggal lahir pegawai" },
					{ method: "string", key: gender, variable_name: "Jenis kelamin" },
				];

				await check.multiple_check_stringvar(req, res, arr_validate_input, next);

				manual_transaction = await DB.transaction();
				if (!req.body.responses) {
					await employeeHelper
						.data_employee({ nik })
						.then(async (data) => {
							if (data.length > 0) {
								req.body.responses = format_responses.error_204("Gagal, nik sudah pernah terdaftar!");
							} else {
								await extendedModelHelper
									.create({
										req,
										model: employeeModel,
										data: {
											nik,
											name,
											is_active,
											start_date,
											end_date,
										},
										transaction: manual_transaction,
									})
									.then(async (result_employee) => {
										await extendedModelHelper
											.create({
												req,
												model: employee_profileModel,
												data: {
													employee_id: result_employee.id,
													place_of_birth,
													date_of_birth,
													gender,
													is_married,
													prof_pict,
												},
												transaction: manual_transaction,
											})
											.then(async () => {
												is_commit = true;
												req.body.responses = format_responses.berhasil_create(result_employee);
											});
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

			if (manual_transaction) {
				if (!is_commit) {
					await manual_transaction.rollback();
				} else {
					await manual_transaction.commit();
				}
			}

			next();
		};
	}

	static update_employee() {
		return async (req, res, next) => {
			try {
				const { id, nik, name, is_active, start_date, end_date } = req.body;

				let arr_validate_input = [
					{ method: "number", key: parseInt(id), variable_name: "Id" },
					{ method: "string", key: nik, variable_name: "NIK" },
					{ method: "string", key: name, variable_name: "Nama pegawai" },
					{ method: "string", key: start_date, variable_name: "Tanggal mulai" },
					{ method: "string", key: end_date, variable_name: "Tanggal berakhir" },
				];

				await check.multiple_check_stringvar(req, res, arr_validate_input, next);

				if (!req.body.responses) {
					await Promise.all([employeeHelper.data_employee({ id, nik, notEqualsId: true }), employeeHelper.data_employee({ id })])
						.then(async ([data_nik, data_id]) => {
							if (data_id.length < 1) {
								req.body.responses = format_responses.error_204("Gagal, id tidak ditemukan!");
							} else if (data_nik.length > 0) {
								req.body.responses = format_responses.error_204("Gagal, nik sudah pernah terdaftar!");
							} else {
								await extendedModelHelper
									.update({
										req,
										model: employeeModel,
										data: {
											nik,
											name,
											is_active,
											start_date,
											end_date,
										},
										whereData: { id },
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

	static delete_employee() {
		return async (req, res, next) => {
			// Manual Transaction
			let manual_transaction = null;
			let is_commit = false;

			try {
				const { id } = req.body;

				let arr_validate_input = [{ method: "number", key: parseInt(id), variable_name: "Id" }];

				await check.multiple_check_stringvar(req, res, arr_validate_input, next);

				manual_transaction = await DB.transaction();
				if (!req.body.responses) {
					await employeeHelper
						.data_employee({ id })
						.then(async (data) => {
							if (data.length < 1) {
								req.body.responses = format_responses.error_204("Gagal, id tidak ditemukan!");
							} else {
								await extendedModelHelper
									.delete({
										req,
										model: employeeModel,
										transaction: manual_transaction,
										whereData: { id },
									})
									.then(async (result_employee) => {
										await extendedModelHelper
											.delete({
												req,
												model: employee_profileModel,
												transaction: manual_transaction,
												whereData: { employee_id: id },
											})
											.then(async () => {
												await extendedModelHelper
													.delete({
														req,
														model: educationModel,
														transaction: manual_transaction,
														whereData: { employee_id: id },
													})
													.then(async () => {
														await extendedModelHelper
															.delete({
																req,
																model: employee_familyModel,
																transaction: manual_transaction,
																whereData: { employee_id: id },
															})
															.then(async () => {
																is_commit = true;
																req.body.responses = format_responses.berhasil_delete(result_employee);
															});
													});
											});
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

			if (manual_transaction) {
				if (!is_commit) {
					await manual_transaction.rollback();
				} else {
					await manual_transaction.commit();
				}
			}

			next();
		};
	}
}

module.exports = Controller;
