const router = require("express").Router();

router.use("/api", require("./modules/routes"));

module.exports = router;
