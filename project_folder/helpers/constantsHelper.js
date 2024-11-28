exports.WORDING_RESPONSE = {
	BERHASIL: "Berhasil!",
	TERBUAT: "Berhasil membuat data!",
	BERHASIL_MENGHAPUS: "Berhasil menghapus data!",
	BERHASIL_UPDATE: "Berhasil mengubah data!",
	SYSTEM_ERROR: "Internal server error!",
	DATA_TIDAK_DITEMUKAN: (data) => {
		return `Data ${data} tidak ditemukan!`;
	},
	DATA_SUDAH_DIGUNAKAN: (data) => {
		return `Data ${data} sudah digunakan!`;
	},
};

exports.CODE_RESPONSE = {
	BERHASIL: 200,
	TERBUAT: 201,
	SYSTEM_ERROR: 500,
	DUPLIKAT: 204,
	DATA_TIDAK_DITEMUKAN: 202,
	ERROR_VALIDASI: 400,
	GAGAL_VALIDASI: 203,
	LIST_TIDAK_DITEMUKAN: 404,
	BAD_REQUEST: 400,
	IMPORT_DATA_VALIDASI: 412,
};
