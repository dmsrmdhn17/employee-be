const router = require("express").Router();

router.use("/api", require("./modules/index"));

module.exports = router;
