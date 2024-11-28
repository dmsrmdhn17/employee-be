const crudHelper = require("./crud_additionHelper");

exports.create = async ({ req, model, data, transaction }) => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await model.create(
				{
					...data,
					...crudHelper.helper_create(req),
				},
				{ transaction },
			);
			resolve(result);
		} catch (error) {
			console.log({ error });
			reject(error);
		}
	});
};

exports.bulkCreate = async ({ req, model, data, transaction, updateOnDuplicate }) => {
	return new Promise(async (resolve, reject) => {
		try {
			// TODO update on duplicated
			let input = data.map((x) => {
				return {
					...x,
					...crudHelper.helper_create(req),
				};
			});
			if (!data.length) {
				// Pass through if array empty
				resolve();
			} else {
				const result = await model.bulkCreate(input, {
					transaction,
					updateOnDuplicate,
				});
				resolve(result);
			}
		} catch (error) {
			console.log({ error });
			reject(error);
		}
	});
};

exports.update = async ({ req, model, data, whereData, transaction, returningObject }) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (whereData === undefined) {
				reject("Where Data Tidak Boleh Kosong");
			}
			const result = await model.update(
				{
					...data,
					...crudHelper.helper_update(req),
				},
				{
					where: { ...whereData },
					returning: true,
					transaction,
				},
			);
			resolve(returningObject ? result[1][0] : result);
		} catch (error) {
			console.log({ error });
			reject(error);
		}
	});
};

exports.delete = async ({ req, model, whereData, transaction, returningObject }) => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await model.update(
				{
					...crudHelper.helper_delete(req),
				},
				{
					where: { ...whereData },
					transaction,
					returning: true,
				},
			);
			resolve(returningObject ? result[1][0] : result);
		} catch (error) {
			reject(error);
		}
	});
};

exports.deleteAndModify = async ({ req, model, data, whereData, transaction, returningObject }) => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await model.update(
				{
					...data,
					...crudHelper.helper_delete(req),
				},
				{
					where: { ...whereData },
					transaction,
					returning: true,
				},
			);
			resolve(returningObject ? result[1][0] : result);
		} catch (error) {
			reject(error);
		}
	});
};

exports.hard_delete = async ({ model, whereData, transaction }) => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await model.destroy({
				where: { ...whereData },
				transaction,
				returning: true,
			});
			resolve(result);
		} catch (error) {
			reject(error);
		}
	});
};
