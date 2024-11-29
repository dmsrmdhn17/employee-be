const auth = require("../../middlewares/auth");
const router = require("express").Router();
const controller = require("../controllers/employee_familyController");

router.put("/update-employee-family", controller.update_employee_profile(), auth.response);

module.exports = router;
