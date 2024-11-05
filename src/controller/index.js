const express = require("express");
const router = express.Router();

router.use("/", require("./view"));
router.use("/content", require("./content.controller"));
router.use("/user", require("./user.controller"));
router.use("/counsel", require("./counsel.controller"));
router.use("/upload", require("./upload.controller"));
router.use("/token", require("./token.controller"));

module.exports = router;
