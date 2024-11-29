const auth = require("../../middlewares/auth");
const router = require("express").Router();
const controller = require("../controllers/employeeController");

router.get("/list-employee", controller.list_employee(), auth.response);
router.get("/get-employee-by-id", controller.get_employee_by_id(), auth.response);
router.post("/create-employee", controller.create_employee(), auth.response);
router.put("/update-employee", controller.update_employee(), auth.response);
router.delete("/delete-employee", controller.delete_employee(), auth.response);

module.exports = router;
