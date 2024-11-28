const format_responseHelper = require("./format_responseHelper");
const constants = require("./constantsHelper");

class check {
	static async multiple_check_stringvar(req, res, array, next, custom_status_code) {
		// sort method string first
		array.sort((a, b) => (a.method === "string" ? -1 : b.method === "string" ? 1 : 0));

		let callback = [];
		try {
			return await new Promise((resolve) => {
				const filterRegex = /^[A-Z_]{1,50}$/;
				for (let i = 0; i < array.length; i++) {
					if (array[i].method === "string") {
						if (array[i].key === "" || array[i].key === " " || array[i].key === null || array[i].key === undefined) {
							callback.push({
								key: array[i].key || array[i].variable_name,
								message: `Maaf, ${array[i].variable_name} tidak boleh kosong. Pastikan Anda telah melengkapi semua informasi yang diperlukan.`,
							});
						}
					} else if (array[i].method === "defined") {
						if (array[i].key === undefined) {
							callback.push({
								key: array[i].key || array[i].variable_name,
								message: `Maaf, ${array[i].variable_name} tidak terdefinisi. Pastikan anda memasukan informasi dengan format yang benar.`,
							});
						}
					} else if (array[i].method === "standar_kode") {
						if (array[i].key === "" || array[i].key === null || array[i].key === undefined || filterRegex.test(array[i].key.toUpperCase()) === false) {
							callback.push({
								key: array[i].key || array[i].variable_name,
								message: `Maaf, sepertinya kode kosong atau tidak sesuai standar , kode hanya boleh mengandung hurup kapital 'A-Z' dan tanda '_'. Pastikan anda memasukan informasi dan format yang benar.`,
							});
						}
					} else if (array[i].method === "status") {
						if (
							![1, 0, true, false, 2, 3, "0", "1", "2", "3", "true", "false", 99, "99"].includes(array[i].key) &&
							array[i].key !== "" &&
							array[i].key !== null &&
							array[i].key !== undefined
						) {
							callback.push({
								key: array[i].key || array[i].variable_name,
								message: `Maaf, ${array[i].variable_name} bukan format status. Pastikan anda memasukan informasi dengan format yang benar.`,
							});
						}
					} else if (array[i].method === "resource") {
						if (array[i].key === "" || array[i].key === null || array[i].key === undefined) {
							callback.push({
								key: array[i].key || array[i].variable_name,
								message: `Maaf sebelum melanjutkan silahkan pilih data yang akan dilakukan ${array[i].variable_name}  atau refresh halaman untuk memperbarui pilihan`,
							});
						}
					} else if (array[i].method === "number") {
						if (isNaN(array[i].key) || typeof array[i].key !== "number") {
							callback.push({
								key: array[i].key || array[i].variable_name,
								message: `Maaf, format  ${array[i].variable_name} harus berupa number . `,
							});
						}
					} else if (array[i].method === "enum") {
						let cek = false;
						for (let j = 0; j < array[i].enum.length; j++) {
							if (array[i].enum[j] === array[i].key && array[i].key !== "" && array[i].key !== null && array[i].key !== undefined) {
								cek = true;
							}
						}
						if (!cek) {
							const enumLength = array[i].enum.length;
							if (enumLength > 1) array[i].enum[enumLength - 1] = " dan " + array[i].enum[enumLength - 1];
							callback.push({
								key: array[i].key || array[i].variable_name,
								message: `Maaf, data ${array[i].variable_name} tidak valid , Pastikan nilai berupa salah satu dari ${array[i].enum.toString()}.`,
								// message: `Maaf, data ${array[ i ].variable_name} tidak valid , Pastikan anda memasukan informasi dengan format yang benar. `,
							});
						}
					} else if (array[i].method === "deleted") {
						if (![1, 2, "1", "2", 0, "0"].includes(array[i].key) && array[i].key !== "" && array[i].key !== null && array[i].key !== undefined) {
							callback.push({
								key: array[i].key || array[i].variable_name,
								message: `Maaf, ${array[i].variable_name} bukan format deleted. Pastikan anda memasukan informasi dengan format yang benar.`,
							});
						}
					} else if (array[i].method === "boolean") {
						if (typeof array[i].key !== "boolean") {
							callback.push({
								key: array[i].key || array[i].variable_name,
								message: `Maaf, ${array[i].variable_name} harus format boolean. Pastikan anda memasukan informasi dengan format yang benar.`,
							});
						}
					} else if (array[i].method === "array") {
						if (!Array.isArray(array[i].key) || array[i].key.length < 1) {
							callback.push({
								key: array[i].key || array[i].variable_name,
								message: `Maaf, ${array[i].variable_name} bukan format array. Pastikan anda memasukan informasi dengan format yang benar.`,
							});
						}
					} else if (array[i].method === "json") {
						if (typeof array[i].key !== "object") {
							callback.push({
								key: array[i].key || array[i].variable_name,
								message: `Maaf, ${array[i].variable_name} harus format JSON. Pastikan anda memasukan informasi dengan format yang benar.`,
							});
						}
					} else if (array[i].method === "array_of_object") {
						if (typeof array[i].key !== "object") {
							callback.push({
								key: array[i].key || array[i].variable_name,
								message: `Maaf, ${array[i].variable_name} harus format JSON array of object. Pastikan anda memasukan informasi dengan format yang benar.`,
							});
						} else {
							if (array[i].key.length <= 0) {
								callback.push({
									key: array[i].key || array[i].variable_name,
									message: `Maaf, ${array[i].variable_name} harus bertipe array of object dan harus memiliki properties ${array[i].keys_on_object.toString()}`,
								});
							} else {
								// check jika key value tidak boleh " "
								// CEK KEY

								// array_of_object
								let noValidObj = false;
								array[i].keys_on_object.map((el) => {
									array[i].key.map((elObj) => {
										if (!(el in elObj)) noValidObj = true;
									});
								});
								if (noValidObj) {
									callback.push({
										key: array[i].key || array[i].variable_name,
										message: `Maaf, ${array[i].variable_name} harus bertipe array of object, object harus memiliki properties ${array[i].keys_on_object.toString()}`,
									});
								}
							}
						}
					} else if (array[i].method === "array_of_object_form") {
						if (typeof array[i].key !== "object") {
							callback.push({
								key: array[i].key || array[i].variable_name,
								message: `Maaf, ${array[i].variable_name} harus format JSON array of object. Pastikan anda memasukan informasi dengan format yang benar.`,
							});
						} else {
							if (array[i].key.length <= 0) {
								callback.push({
									key: array[i].key || array[i].variable_name,
									message: `Maaf, ${array[i].variable_name} harus bertipe array of object dan harus memiliki properties ${array[i].keys_on_object.toString()}`,
								});
							} else {
								// check jika key value tidak boleh " "
								// CEK KEY
								for (let index = 0; index < array[i].key.length; index++) {
									const elObj = array[i].key[index];
									if (elObj.value === " " || elObj.label === " ") {
										callback.push({
											key: array[i].key || array[i].variable_name,
											message: `Maaf, Value atau Label pada pilihan ganda tidak boleh diisi text kosong`,
										});
									} else if (elObj.label === elObj.value) {
										callback.push({
											key: array[i].key || array[i].variable_name,
											message: `Maaf, Label dan value pada pilihan ganda tidak boleh bernilai sama`,
										});
									}
								}
								// array_of_object
								let noValidObj = false;
								array[i].keys_on_object.map((el) => {
									array[i].key.map((elObj) => {
										if (!(el in elObj)) noValidObj = true;
									});
								});
								if (noValidObj) {
									callback.push({
										key: array[i].key || array[i].variable_name,
										message: `Maaf, ${array[i].variable_name} harus bertipe array of object, object harus memiliki properties ${array[i].keys_on_object.toString()}`,
									});
								}
							}
						}
					} else if (array[i].method === "object_with_properties") {
						if (typeof array[i].key !== "object") {
							callback.push({
								key: array[i].key || array[i].variable_name,
								message: `Maaf, ${array[i].variable_name} harus bertipe object. Pastikan anda memasukan informasi dengan format yang benar.`,
							});
						} else {
							// array_of_object
							let noValidObj = false;
							array[i].keys_on_object.map((el) => {
								if (!(el in array[i].key)) noValidObj = true;
							});
							if (noValidObj) {
								callback.push({
									key: array[i].key || array[i].variable_name,
									message: `Maaf, ${array[i].variable_name} harus bertipe object dan harus memiliki properties ${array[i].keys_on_object.toString()}`,
								});
							}
						}
					} else if (array[i].method === "min_max") {
						if (array[i].key.max < 1) {
							callback.push({
								key: array[i].key || array[i].variable_name,
								message: `Maaf, Panjang ${array[i].variable_name.max} tidak boleh lebih kecil dari 1.`,
							});
						}
						if (array[i].key.min > array[i].key.max) {
							callback.push({
								key: array[i].key || array[i].variable_name,
								message: `Maaf, ${array[i].variable_name.min} tidak boleh lebih besar dari ${array[i].variable_name.max}.`,
							});
						}
					} else if (array[i].method === "length_compare_exact") {
						if (array[i].key.compare !== array[i].key.value.toString().length) {
							callback.push({
								key: array[i].key || array[i].variable_name,
								message: `Maaf, Panjang ${array[i].variable_name} tidak sama dengan ${array[i].key.compare}.`,
							});
						}
					} else if (array[i].method === "email") {
						const isEmail = (inputString) => {
							// Regular expression to validate email format
							const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
							return emailRegex.test(inputString);
						};
						if (!isEmail(array[i].key)) {
							callback.push({
								key: array[i].key || array[i].variable_name,
								message: `Maaf, ${array[i].variable_name} harus format Email. Pastikan anda memasukan informasi dengan format yang benar.`,
							});
						}
					} else if (array[i].method === "existing") {
						if (array[i].result === undefined || array[i].result === null || array[i].result === "") {
							callback.push({
								key: array[i].variable_name,
								message: `Maaf, result tidak boleh kosong. `,
							});
						} else {
							if (array[i].result.length > 0) {
								callback.push({
									key: array[i].variable_name,
									message: `Duplikat data, ${array[i].variable} dengan ${array[i].variable_name} ${array[i].key} sudah ada!`,
								});
							}
						}
					} else if (array[i].method === "not_found_id") {
						if (array[i].result === undefined || array[i].result === null || array[i].result === "") {
							callback.push({
								key: array[i].variable_name,
								message: `Maaf, result tidak boleh kosong. `,
							});
						} else {
							if (array[i].result.length === 0) {
								callback.push({
									key: array[i].variable_name,
									message: `Data ${array[i].variable} dengan ${array[i].variable_name} ${array[i].key} tidak ditemukan!`,
								});
							}
						}
					} else if (array[i].method === constants.VALIDATION_TYPE.START_END_TIME) {
						// cara penggungaan key harus bernilai array ['14:00','13:00']
						let startTime = array[i].key[0];
						let endTime = array[i].key[1];

						function isValidTimeFormat(time) {
							const timeFormat = /^([01]?\d|2[0-3]):[0-5]\d$/;
							return timeFormat.test(time);
						}

						// Periksa apakah format waktu valid
						if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
							callback.push({
								key: array[i].variable_name,
								message: `Maaf, ${array[i].variable_name} tidak valid, harus dalam format HH:MM`,
							});
						} else {
							// Ubah waktu menjadi objek Date untuk mempermudah perbandingan
							const today = new Date();
							const start = new Date(today);
							const end = new Date(today);

							// Set jam dan menit untuk waktu mulai dan selesai
							const [startHour, startMinute] = startTime.split(":").map(Number);
							const [endHour, endMinute] = endTime.split(":").map(Number);

							start.setHours(startHour, startMinute);
							end.setHours(endHour, endMinute);

							if (start >= end) {
								callback.push({
									key: array[i].variable_name,
									message: `Maaf, ${array[i].variable_name} tidak valid. `,
								});
							}
						}
					} else {
						callback.push({
							key: array[i].key || array[i].variable_name,
							message: `Maaf, Method ${array[i].variable_name} tidak sesuai, Silahkan hubungi tim administrator. `,
						});
					}
				}

				if (callback.length > 0) {
					if (custom_status_code === 500) {
						req.body.responses = format_responseHelper.error_server(callback);
					} else {
						req.body.responses = format_responseHelper.error_203("validasi error", callback);
					}

					if (next) {
						next();
					} else {
						resolve(req.body.responses);
					}
				} else {
					resolve();
				}
			});
		} catch (err) {
			// req.body.responses = {
			//     data: null,
			//     status: 200,
			//     message: "Maaf, terjadi kesalahan internal server saat pengecekakan variable gagal, silahkan coba lagi atau hubungi administrator. ",
			//     err
			// };
			req.body.responses = format_responseHelper.error_server(err);
			if (next) {
				next();
			}
		}
	}
}

module.exports = check;
