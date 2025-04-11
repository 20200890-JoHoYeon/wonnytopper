const express = require("express");
const router = express.Router();
const userService = require("../service/user.service");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User API
 */

/**
 * @swagger
 * /user/logout:
 *   get:
 *     tags: [User]
 *     summary: Logout
 */
router.get("/logout", userService.logout);
/**
 * @swagger
 * /user:
 *   post:
 *     tags: [User]
 *     summary: Save User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               member_id:
 *                 type: string
 *               pwd:
 *                 type: string
 *               name:
 *                 type: string
 *             example:
 *               member_id: admin1
 *               pwd: "1234"
 *               name : admin
 *     responses:
 *       200:
 *         description: Successful login
 */
router.post("/", userService.register);

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags: [User]
 *     summary: Login User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               member_id:
 *                 type: string
 *               pwd:
 *                 type: string
 *               isAuto:
 *                 type: boolena
 *             example:
 *               member_id: admin1
 *               pwd: "1234"
 *               isAuto : true
 *     responses:
 *       200:
 *         description: Successful login
 */
router.post("/login", userService.login);

module.exports = router;
