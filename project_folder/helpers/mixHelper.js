const format_responseHelper = require("./format_responseHelper");
class MixHelper {
	static format_print_id_to_9_digit(value) {
		try {
			// Potong string original agar panjang tetap sama setelah disisipkan string baru
			const originalString = "000000000";
			let newString = originalString.slice(0, originalString.length - value.length);
			return newString + value;
		} catch (error) {
			console.log(error);
		}
	}

	static check_other_than_number(input) {
		// Define the regex pattern that matches any character other than numbers
		const nonNumericPattern = /[^0-9]/;

		// Use the test method to check if the pattern is found in the input
		return nonNumericPattern.test(input);
	}
	static check_key_in_obj(child, parent) {
		let error = false;
		let error_msg;
		for (let index = 0; index < child.length; index++) {
			const detail_child = child[index];
			const detail_child_keys = Object.keys(detail_child);
			for (let index = 0; index < parent.length; index++) {
				const element = parent[index];
				if (!detail_child_keys.includes(element)) {
					error = true;
					error_msg = element;
					// return {error: true, error_msg: element}
				}
			}
		}
		return { error, error_msg };
	}
	static async check_compare_key_in_obj(input, mapping) {
		return await new Promise(async (resolve, reject) => {
			try {
				let error_msg;
				let data_ke = 0;
				const missingKeysReport = input
					.map((element, index) => {
						const missingKeys = mapping.filter((key) => !element.hasOwnProperty(key)); // eslint-disable-line
						return { index, missingKeys };
					})
					.filter((report) => report.missingKeys.length > 0);

				if (missingKeysReport.length === 0) {
					console.log("All elements have the required keys.");
					resolve();
				} else {
					console.log("Some elements are missing the required keys:");
					missingKeysReport.forEach((report) => {
						console.log(`Element at index ${report.index} is missing keys: ${report.missingKeys.join(", ")}`);
						error_msg = report.missingKeys;
						data_ke = report.index;
					});
					reject(format_responseHelper.error_203(`Data ke ${data_ke} dengan nama data ${error_msg} tidak valid`));
				}
			} catch (err) {
				reject(format_responseHelper.error_server(err));
			}
		});
	}

	static async check_duplicate_data_in_array_of_obj(array, key) {
		return await new Promise((resolve, reject) => {
			try {
				const seenIds = new Set();
				const duplicateIds = new Set();
				array.forEach((item) => {
					if (seenIds.has(item[key])) {
						duplicateIds.add(item[key]);
					} else {
						seenIds.add(item[key]);
					}
				});
				if (duplicateIds.size > 0) {
					console.log({ duplicateIds });
					reject(format_responseHelper.error_203(`terdapat duplikasi data pada ${key} dengan data ${Array.from(duplicateIds).toString()}`));
				} else {
					resolve();
				}
			} catch (err) {
				reject(format_responseHelper.error_server(err));
			}
		});
	}
	static status_bool_to_int(status) {
		switch (status) {
			case true:
				return 1;
			case false:
				return 0;
			case "true":
				return 1;
			case "false":
				return 0;

			default:
				break;
		}
	}
	static int_status_to_bool(status) {
		switch (status) {
			case 1:
				return true;
			case 2:
				return false;
			case "1":
				return true;
			case "2":
				return false;

			default:
				undefined;
				break;
		}
	}
	static flatten_remove_duplicates_array_of_object(nestedArray) {
		function flattenArray(arr) {
			const result = [];

			arr.forEach((item) => {
				if (Array.isArray(item)) {
					result.push(...flattenArray(item));
				} else if (typeof item === "object" && item !== null) {
					const flattenedObject = flattenObject(item);
					result.push(flattenedObject);
				} else {
					result.push(item);
				}
			});

			return result;
		}

		function flattenObject(obj, parentKey = "", result = {}) {
			for (let key in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, key)) {
					const newKey = parentKey ? `${parentKey}.${key}` : key;
					if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
						flattenObject(obj[key], newKey, result);
					} else {
						result[newKey] = obj[key];
					}
				}
			}
			return result;
		}

		function removeDuplicates(arr) {
			const seen = new Set();
			const result = [];

			arr.forEach((item) => {
				const stringified = JSON.stringify(item);
				if (!seen.has(stringified)) {
					seen.add(stringified);
					result.push(item);
				}
			});

			return result;
		}

		const flattenedArray = flattenArray(nestedArray);
		const uniqueArray = removeDuplicates(flattenedArray);

		// console.log(uniqueArray);
		return uniqueArray;
	}
	static ageCalculation(date) {
		const calculateAge = (dateString) => {
			// Parse the input date string
			const birthDate = new Date(dateString);

			// Get today's date
			const today = new Date();

			// Calculate the difference in years
			let age = today.getFullYear() - birthDate.getFullYear();

			// Adjust age if the birth date hasn't occurred yet this year
			const monthDifference = today.getMonth() - birthDate.getMonth();
			if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
				age--;
			}

			return age;
		};

		// Example usage
		const age = calculateAge(date);
		// console.log(`Age: ${age}`);
		return age;
	}
	static generate_random_string(input, length = 20) {
		const generateRandomStringWithMiddle = (inputString, randomStringLength) => {
			if (randomStringLength <= inputString.length) {
				throw new Error("Random string length must be greater than the length of the input string.");
			}

			const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			const halfLength = Math.floor((randomStringLength - inputString.length) / 2);

			const getRandomChars = (length) => {
				let result = "";
				for (let i = 0; i < length; i++) {
					result += charset.charAt(Math.floor(Math.random() * charset.length));
				}
				return result;
			};

			const prefix = getRandomChars(halfLength);
			const suffix = getRandomChars(randomStringLength - inputString.length - halfLength);

			return prefix + inputString + suffix;
		};

		// Example usage
		const inputString = input;
		const randomStringLength = length;
		const result = generateRandomStringWithMiddle(inputString, randomStringLength);
		return result; // Example output: "a8JkINSERTmVqR3fB5Xz"
	}

	static generate_no_rm(input) {
		function addLeadingZeros(number) {
			// Convert the input number to a string
			let numberStr = number.toString();

			// Calculate how many leading zeros are needed
			let numZerosToAdd = 9 - numberStr.length;

			// Add the necessary leading zeros
			let resultStr = "0".repeat(numZerosToAdd) + numberStr;

			return resultStr;
		}

		return addLeadingZeros(input);
	}
}

module.exports = MixHelper;
