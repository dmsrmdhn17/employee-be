let jwt = require("../helpers/jwt");
const cache = require("../config/redis/index").CLIENT_1;
const env_config = require("../helpers/env/env_config");

class Authentification {
	static langsungMasuk() {
		return async (req, res, next) => {
			if (req.headers.token) {
				try {
					let hasil = await jwt.verifyToken(req.headers.token);
					let token_user = await cache.keys(`token_${hasil.username}_${hasil.iduser}_${hasil.apps}`);
					if (token_user.length === 0) {
						res.status(403).json({
							status: 403,
							message: "Session anda telah berakhir.",
						});
					} else {
						await cache.set(`token_${hasil.username}_${hasil.iduser}_${hasil.apps}`, JSON.stringify(hasil, 0, 2), { EX: 60 * parseInt(env_config.SESSION_TIME) });

						req.headers.user = hasil;
						next();
					}
				} catch (err) {
					console.log(err);
					res.status(500).json({ status: 403, message: "token salah | ceklogin", err });
				}
			} else {
				res.status(500).json({ status: 403, message: "Anda Belum Login | ceklogin" });
			}
		};
	}

	static async response(req, res, next) {
		try {
			if (res.headersSent) {
				next();
			} else if (req.body?.responses) {
				let status_code = 200;
				if (req.body?.responses?.status === 500 || req.body.responses?.meta_data?.status === 500) {
					status_code = 500;
				}
				res.status(status_code).json(req.body.responses);
			} else {
				res.status(500).json({
					status: 500,
					data: null,
					message: `Tidak ditemukan response dari server [808]!`,
				});
			}
		} catch (err) {
			console.log(err);
			res.status(500).json({
				status: 500,
				data: null,
				message: `Proses response gagal [809] `,
			});
		}
	}

	static getIP(ip) {
		const array_ip = ip.split(":");

		if (array_ip.length === 3) {
			return array_ip[2];
		} else {
			return array_ip[3];
		}
	}
}

module.exports = Authentification;
