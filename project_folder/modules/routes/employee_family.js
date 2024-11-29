const auth = require("../../middlewares/auth");
const router = require("express").Router();
const controller = require("../controllers/employee_familyController");

router.post("/update-employee-family", controller.update_employee_family(), auth.response);

module.exports = router;
