const router = require("express").Router();

router.use("/employee", require("./employee"));
router.use("/employee-profile", require("./employee_profile"));
router.use("/employee-family", require("./employee_family"));

module.exports = router;
