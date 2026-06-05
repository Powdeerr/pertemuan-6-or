// src/routes/books.routes.js

const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/books.controller");

const router = express.Router();

/**
 * @swagger
 * /api/books:
 *   get:
 *     tags: [Books]
 *     summary: Lihat semua buku (publik)
 *     responses:
 *       200:
 *         description: Daftar buku berhasil diambil
 */
router.get("/", getAllBooks);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     tags: [Books]
 *     summary: Lihat detail buku (publik)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Detail buku berhasil diambil
 *       404:
 *         description: Buku tidak ditemukan
 */
router.get("/:id", getBookById);

/**
 * @swagger
 * /api/books:
 *   post:
 *     tags: [Books]
 *     summary: Tambah buku baru (perlu login)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, author, price, stock]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Clean Code
 *               author:
 *                 type: string
 *                 example: Robert C. Martin
 *               price:
 *                 type: number
 *                 example: 150000
 *               stock:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Buku berhasil ditambahkan
 *       400:
 *         description: Validasi gagal
 *       401:
 *         description: Unauthorized
 */
router.post("/", authMiddleware, createBook);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     tags: [Books]
 *     summary: Update buku (perlu login)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Buku berhasil diupdate
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Buku tidak ditemukan
 */
router.put("/:id", authMiddleware, updateBook);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     tags: [Books]
 *     summary: Hapus buku (perlu login)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Buku berhasil dihapus
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Buku tidak ditemukan
 */
router.delete("/:id", authMiddleware, deleteBook);

module.exports = router;
