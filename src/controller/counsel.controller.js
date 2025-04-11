const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const counselService = require("../service/counsel.service");

/**
 * @swagger
 * tags:
 *   name: Counsel
 *   description: Counsel API
 */

router.post("/select", counselService.select);
router.get("/select/:counsel_id", counselService.select);
router.post("/insertCounsel", counselService.insertCounsel);

/**
 * @swagger
 * /counsel/insertAnswer:
 *   post:
 *     tags: [Counsel]
 *     summary: Save Answer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               detail:
 *                 type: string
 *               counselId:
 *                 type: number
 *               file:
 *                 type: object
 *             example:
 *               detail: "TEST"
 *               counselId: 2
 *               file : {origin_name : "1.jpg", change_name : "1.jpg", ext : "jpg", url : "/1.jpg"}
 */
router.post("/insertAnswer", counselService.insertAnswer);

module.exports = router;
