const bcrypt = require("bcrypt");

class Password {
	static async generatePassword(password) {
		return new Promise(async (approve, reject) => {
			try {
				let hashPassword = await bcrypt.hash(password, 10);
				approve(hashPassword);
			} catch (err) {
				reject(err);
			}
		});
	}

	static async generatePassword_mobile(password) {
		return new Promise(async (approve, reject) => {
			try {
				let hashPassword = await bcrypt.hash(password, 12);
				approve(hashPassword);
			} catch (err) {
				reject(err);
			}
		});
	}

	static comparePassword(password, hash) {
		return new Promise(async (approve) => {
			let hasil = bcrypt.compare(password, hash);
			approve(hasil);
		});
	}
}

module.exports = Password;
