// src/routes/auth.routes.js

const express = require("express");
const { register, login } = require("../controllers/auth.controller");

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrasi pengguna baru
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sheva Arafah
 *               email:
 *                 type: string
 *                 example: sheva@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *       400:
 *         description: Validasi gagal atau email sudah terdaftar
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login dan dapatkan JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: sheva@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login berhasil, mengembalikan JWT token
 *       401:
 *         description: Email atau password salah
 */
router.post("/login", login);

module.exports = router;
