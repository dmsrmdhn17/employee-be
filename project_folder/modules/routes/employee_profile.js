const auth = require("../../middlewares/auth");
const router = require("express").Router();
const controller = require("../controllers/employee_profileController");

router.put("/update-employee-profile", controller.update_employee_profile(), auth.response);

module.exports = router;
