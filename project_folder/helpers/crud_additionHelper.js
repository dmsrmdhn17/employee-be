const moment = require("moment");
const { getIP } = require("../middlewares/auth");

class CrudAddition {
	static helper_create(req) {
		return {
			createdName: req.headers?.user?.username ?? "-", //req.headers.user.username,
			createdCode: getIP(req.ip), //req.ip_client,
			createdBy: req.headers?.user?.iduser ?? 0, //req.headers.user.iduser,
		};
	}
	static helper_update(req) {
		return {
			updatedName: req.headers?.user?.username ?? "-", //req.headers.user.username,
			updatedCode: getIP(req.ip), //req.ip_client,
			updatedBy: req.headers?.user?.iduser ?? 0, //req.headers.user.iduser,
		};
	}
	static helper_delete(req) {
		return {
			deletedName: req.headers?.user?.username ?? "-", //req.headers.user.username,
			deletedCode: getIP(req.ip), //req.ip_client,
			deletedBy: req.headers?.user?.iduser ?? 0, //req.headers.user.iduser,
			deletedAt: moment(),
		};
	}
}

module.exports = CrudAddition;
