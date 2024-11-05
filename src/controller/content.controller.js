const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const contentService = require("../service/content.service");

/**
 * @swagger
 * tags:
 *   name: Content
 *   description: Content API
 */

router.post("/search", contentService.search);
router.get("/select/:content_id", contentService.select);
router.get("/select", contentService.select);
router.post("/insert", contentService.insert);
router.post("/update", contentService.update);
router.post("/delete", contentService.delete);

/**
 * @swagger
 * /content/gallery:
 *   get:
 *     tags: [Content]
 *     summary: 갤러리 조회
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 페이지 번호
 *         required: true
 *         example: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: 페이지당 항목 개수
 *         required: true
 *         example: 10
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: 카테고리
 *         required: true
 *         example: "삐에"
 */
router.post("/gallery", contentService.findGallery);

module.exports = router;
