const express = require("express");
const router = express.Router();
const tokenService = require("../service/token.service");

router.get("/select/:token_kind", tokenService.select);
router.post("/insert", tokenService.insert);
router.post("/update", tokenService.update);

module.exports = router;
