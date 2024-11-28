const router = require("express").Router();

router.use("/employee", require("./employee"));

module.exports = router;
