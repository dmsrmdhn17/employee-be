const constants = require("./constantsHelper");

class FormatResponse {
	// 200
	static berhasil_array_no_count(data, additionalData) {
		return {
			data: {
				list: data,
				...additionalData,
			},
			meta_data: {
				status: constants.CODE_RESPONSE.BERHASIL,
				message: constants.WORDING_RESPONSE.BERHASIL,
			},
		};
	}
	static berhasil_list(data, pages, count, limit, additionalData) {
		count = parseInt(count);
		pages = parseInt(pages);
		limit = parseInt(limit);

		if (!pages && isNaN(pages)) {
			pages = 0;
		}
		if (!limit && isNaN(limit)) {
			limit = 0;
		}
		if (!count && isNaN(count)) {
			count = 0;
		}

		return {
			data: {
				list: data,
				...additionalData,
				meta_data: {
					count,
					pages,
					limit,
				},
			},
			meta_data: {
				status: constants.CODE_RESPONSE.BERHASIL,
				message: constants.WORDING_RESPONSE.BERHASIL,
			},
		};
	}
	static berhasil_resource(data) {
		return {
			data,
			meta_data: {
				status: constants.CODE_RESPONSE.BERHASIL,
				message: constants.WORDING_RESPONSE.BERHASIL,
			},
		};
	}
	static berhasil_array(data) {
		return {
			data,
			meta_data: {
				status: constants.CODE_RESPONSE.BERHASIL,
				message: constants.WORDING_RESPONSE.BERHASIL,
			},
		};
	}
	static berhasil_object(data, additionalData, custom_message) {
		return {
			data: Array.isArray(data) ? data[0] : data,
			...additionalData,
			meta_data: {
				status: constants.CODE_RESPONSE.BERHASIL,
				message: !custom_message ? constants.WORDING_RESPONSE.BERHASIL : custom_message,
			},
		};
	}
	static berhasil_update(data, additionalData, custom_message) {
		return {
			data: Array.isArray(data) ? data[1][0] : data,
			...additionalData,
			meta_data: {
				status: constants.CODE_RESPONSE.BERHASIL,
				message: !custom_message ? constants.WORDING_RESPONSE.BERHASIL_UPDATE : custom_message, //"Berhasil Mengubah data",
			},
		};
	}
	static berhasil_delete(data) {
		return {
			data: Array.isArray(data) ? data[1][0] : data,
			meta_data: {
				status: constants.CODE_RESPONSE.BERHASIL,
				message: constants.WORDING_RESPONSE.BERHASIL_MENGHAPUS, //"Berhasil Menghapus data",
			},
		};
	}
	// 201
	static berhasil_create(data, custom_message) {
		return {
			data,
			meta_data: {
				status: constants.CODE_RESPONSE.TERBUAT,
				message: !custom_message ? constants.WORDING_RESPONSE.TERBUAT : custom_message,
			},
		};
	}
	// Validasi error
	static error_server(error, custom_message) {
		console.log(error);
		return {
			data: error,
			meta_data: {
				status: constants.CODE_RESPONSE.SYSTEM_ERROR,
				message: !custom_message ? constants.WORDING_RESPONSE.SYSTEM_ERROR : custom_message,
			},
		};
	}
	static error_unhandled(error) {
		if (error?.meta_data) return error;
		console.log(error);
		return {
			data: error,
			meta_data: {
				status: constants.CODE_RESPONSE.SYSTEM_ERROR,
				message: constants.WORDING_RESPONSE.SYSTEM_ERROR,
			},
		};
	}

	// TIDAK DITEMUKAN PRIMARY KEY
	static error_404(message) {
		return {
			data: null,
			meta_data: {
				status: constants.CODE_RESPONSE.LIST_TIDAK_DITEMUKAN,
				message,
			},
		};
	}
	static error_400(message, error) {
		return {
			data: null,
			meta_data: {
				status: constants.CODE_RESPONSE.BAD_REQUEST,
				message,
				error,
			},
		};
	}
	static error_204(message) {
		return {
			data: null,
			meta_data: {
				status: constants.CODE_RESPONSE.DUPLIKAT,
				message,
			},
		};
	}
	static error_203(message, data) {
		return {
			data: data,
			meta_data: {
				status: constants.CODE_RESPONSE.GAGAL_VALIDASI,
				message,
			},
		};
	}

	// TIDAK DITEMUKAN SECONDARY ATAU OPTIONAL KEY
	static error_202(message) {
		return {
			data: null,
			meta_data: {
				status: constants.CODE_RESPONSE.DATA_TIDAK_DITEMUKAN,
				message,
			},
		};
	}

	// PERINGATAN VALIDASI FILE (UPLOAD/IMPORT)
	static error_412(message, data, label) {
		return {
			data: {
				validasi: !data ? null : data,
				label: !label ? null : label,
			},
			meta_data: {
				status: constants.CODE_RESPONSE.IMPORT_DATA_VALIDASI,
				message,
			},
		};
	}

	static warning(data, message) {
		return {
			data: data,
			meta_data: {
				status: constants.CODE_RESPONSE.BERHASIL,
				message,
			},
		};
	}
}

module.exports = FormatResponse;
