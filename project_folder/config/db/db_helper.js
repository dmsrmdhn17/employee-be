const { QueryTypes } = require("sequelize");
const { DB } = require("./index");

exports.executeSelectQuery = async (querystring) => {
	try {
		const result = await DB.query(querystring, { type: QueryTypes.SELECT });
		return result;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

exports.executeSelectOneQuery = async (querystring) => {
	try {
		const result = await DB.query(querystring, { type: QueryTypes.SELECT });
		return result[0] || null; // Return the first row or null if no rows found
	} catch (error) {
		console.log(error);
		throw error;
	}
};

exports.queryReplacement = async (querystring, replacements = {}) => {
	try {
		return await DB.query(querystring, {
			replacements,
			type: QueryTypes.RAW,
		});
	} catch (error) {
		throw error;
	}
};

exports.queryRawReplace = async (querystring, replacements = {}) => {
	let rawQuery = querystring;
	for (const key in replacements) {
		const value = replacements[key];
		const regex = new RegExp(`:${key}`, "g");
		rawQuery = rawQuery.replace(regex, typeof value === "string" ? `'${value}'` : value);
	}
	return rawQuery;
};

exports.executeQueryRaw = async (querystring, { transaction }) => {
	try {
		const result = await DB.query(querystring, { type: QueryTypes.RAW, transaction });
		return result;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

exports.startTransaction = async () => {
	return DB.transaction();
};

exports.commitTransaction = async (transaction) => {
	try {
		await transaction.commit();
	} catch (error) {
		throw error;
	}
};

exports.rollbackTransaction = async (transaction) => {
	try {
		await transaction.rollback();
	} catch (error) {
		throw error;
	}
};

// akan menghasilkan ' and KOLOM_A .....'
exports.buildFilterAnd = ({ filterRequest, filterFormat }) => {
	let r = ``;
	Object.keys(filterRequest).forEach((el) => {
		if (typeof filterRequest[el] === "number") {
			filterFormat[el] && (filterRequest[el] || filterRequest[el] === 0) ? (r += ` and ${filterFormat[el]}= ${filterRequest[el]}`) : "";
		} else if (typeof filterRequest[el] === "boolean") {
			filterFormat[el] ? (r += ` and ${filterFormat[el]} is ${filterRequest[el] ? "true" : "false"}`) : "";
		} else {
			filterFormat[el] && filterRequest[el] ? (r += ` and ${filterFormat[el]}= '${filterRequest[el]}'`) : "";
		}
	});
	return r;
};

exports.buildFilterAndIlike = ({ filterRequest, filterFormat, startWildcard = false, endWildcard = true }) => {
	let r = ``;
	Object.keys(filterRequest).forEach((el) => {
		filterFormat[el] && filterRequest[el] ? (r += ` and ${filterFormat[el]} ilike '${startWildcard ? "%" : ""}${filterRequest[el]}${endWildcard ? "%" : ""}'`) : "";
	});
	return r;
};

// akan menghasilkan ' and (KOLOM_A ilike '%key%' or KOLOM_B ilike '%key%' OR .....)'
exports.buildFilterAndGroupIlikeOr = ({ filterRequest, filterFormat, startWildcard = false, endWildcard = true }) => {
	let r = [];
	Object.keys(filterRequest).forEach((el) => {
		filterFormat[el] && filterRequest[el] ? r.push(`${filterFormat[el]} ilike '${startWildcard ? "%" : ""}${filterRequest[el]}${endWildcard ? "%" : ""}'`) : "";
	});
	return r.length ? ` and (${r.join(" or ")})` : "";
};
// akan menghasilkan ' and KOLOM_A in (1,2,3) and KOLOM_B in (1,2,3)'
exports.buildFilterAndIn = ({ filterRequest, filterFormat }) => {
	let r = [];
	Object.keys(filterRequest).forEach((el) => {
		// const item=filterRequest[el].split(',')
		// filterFormat[el] && filterRequest[el] ? r.push(` and ${filterFormat[el]} in ('${item.join(`','`)}')`):''
		if (filterFormat[el] && filterRequest[el]) {
			const items = filterRequest[el].toString().split(",");
			// Buat filter dengan format `field IN ('value1','value2',...)`
			const filterCondition = `AND ${filterFormat[el]} IN ('${items.map((i) => i.trim()).join("','")}')`;
			r.push(filterCondition);
		}
	});
	return r.length ? r.join(" ") : "";
};

// menghasilkan name,email,phone_number
exports.getFieldsWithJoinComa = ({ fields, masterFields }) => {
	try {
		const masterFieldsWithMap = {};
		masterFields.forEach((el) => {
			masterFieldsWithMap[el.key] = el.field;
		});
		const result = [];
		fields.split(",").forEach((el) => {
			if (masterFieldsWithMap[el]) {
				result.push(masterFieldsWithMap[el]);
			}
		});
		return result.join(",");
	} catch (error) {
		throw error;
	}
};

exports.getFieldsWithJoinComa_ = ({ fields, masterFields }) => {
	try {
		let result = ``;
		const _fields = fields.split(",");
		const _fields_length = _fields.length - 1;

		_fields.forEach((el, key) => {
			if (masterFields[el]) {
				result += _fields_length === key ? ` ${masterFields[el].field}` : `${masterFields[el].field}, `;
			} else {
				throw `Kolom ${el} ini tidak tersedia`;
			}
		});
		return result;
	} catch (error) {
		throw error;
	}
};

// Helper function to build SELECT query and map column data
exports.buildSelectQuery = (kolom_data, fields, is_all = false) => {
	// Ubah kolom_data menjadi objek untuk akses yang lebih cepat
	const kolomDataMap = Object.fromEntries(kolom_data.map((kolom) => [kolom.key, kolom]));
	let selectQuery = ``;

	if (is_all) {
		// menampilkan semua
		selectQuery = kolom_data
			.map((el) => {
				const field = el.key;
				const column = kolomDataMap[field];
				if (!column) return null; // Lewati jika kolom tidak ditemukan

				const { initial, field: columnField } = column;

				// Cek apakah kolom field tanpa petik dua sama dengan key
				const cleanField = columnField.replace(/"/g, ""); // Hapus petik dua
				const needsAlias = cleanField !== field; // Tentukan jika perlu alias

				return `${initial}.${columnField}${needsAlias ? ` AS ${field}` : ""}`;
			})
			.filter(Boolean) // Hapus nilai null
			.join(", ");
	} else {
		// Ambil fields dari query atau gunakan kolom pertama sebagai default
		const requestedFields = fields ? fields.split(/,\s*/).map((field) => field.trim()) : [kolom_data[0].key];

		// Set string untuk SELECT query berdasarkan requestedFields
		selectQuery = requestedFields
			.map((field) => {
				const column = kolomDataMap[field];
				if (!column) return null; // Lewati jika kolom tidak ditemukan

				const { initial, field: columnField } = column;

				// Cek apakah kolom field tanpa petik dua sama dengan key
				const cleanField = columnField.replace(/"/g, ""); // Hapus petik dua
				const needsAlias = cleanField !== field; // Tentukan jika perlu alias

				return `${initial}.${columnField}${needsAlias ? ` AS ${field}` : ""}`;
			})
			.filter(Boolean) // Hapus nilai null
			.join(", ");
	}
	return {
		columnMapping: kolomDataMap, // Peta kolom untuk akses cepat
		selectFields: selectQuery, // String query SELECT yang dibangun
	};
};
