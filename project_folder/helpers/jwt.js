const env_config = require("../helpers/env/env_config");
let jwt = require("jsonwebtoken");
let key = env_config.KEY;

class Jwt {
	/** =========================================== */
	/** WEB VERSION */
	/** =========================================== */
	static generateToken(data) {
		if (data) {
			let token = jwt.sign(data, key);
			return token;
		} else {
			return { pesan: "data tidak ada" };
		}
	}

	static verifyToken(token) {
		return new Promise((approve, reject) => {
			if (token) {
				try {
					var decoded = jwt.verify(token, key);
					approve(decoded);
				} catch (err) {
					reject(err);
				}
			} else {
				reject({ pesan: "token belum dikirim" });
			}
		});
	}
}
module.exports = Jwt;
