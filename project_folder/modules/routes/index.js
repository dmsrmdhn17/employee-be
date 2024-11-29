const router = require("express").Router();

router.use("/employee", require("./employee"));
router.use("/employee-profile", require("./employee_profile"));

module.exports = router;
