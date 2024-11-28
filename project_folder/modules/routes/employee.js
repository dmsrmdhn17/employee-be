const auth = require("../../middlewares/auth");
const router = require("express").Router();
const controller = require("../controllers/employeeController");

router.get("/list-employee", controller.list_employee(), auth.response);

module.exports = router;
