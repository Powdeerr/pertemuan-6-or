// src/controllers/books.controller.js
// Controller untuk buku — berisi semua business logic CRUD buku

const { z } = require("zod");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ================================================================
// SCHEMA VALIDASI BUKU (Zod)
// ================================================================
const bookSchema = z.object({
  title: z.string().min(1, "Judul buku tidak boleh kosong"),
  author: z.string().min(1, "Nama penulis tidak boleh kosong"),
  price: z.number().positive("Harga harus lebih dari 0"),
  stock: z.number().int().min(0, "Stok tidak boleh negatif"),
});

// ================================================================
// HANDLER: Get All Books
// ================================================================
const getAllBooks = async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "Daftar buku berhasil diambil",
      data: books,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil daftar buku.",
    });
  }
};

// ================================================================
// HANDLER: Get Book By ID
// ================================================================
const getBookById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const book = await prisma.book.findUnique({
      where: { id },
      include: { user: { select: { name: true, email: true } } },
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Buku dengan ID ${id} tidak ditemukan.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Detail buku berhasil diambil",
      data: book,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data buku.",
    });
  }
};

// ================================================================
// HANDLER: Create Book
// ================================================================
const createBook = async (req, res) => {
  try {
    const validatedData = bookSchema.parse(req.body);

    const newBook = await prisma.book.create({
      data: {
        ...validatedData,
        userId: req.user.id, // Dari JWT middleware
      },
    });

    return res.status(201).json({
      success: true,
      message: "Buku berhasil ditambahkan!",
      data: newBook,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
      });
    }
    return res.status(500).json({
      success: false,
      message: "Gagal menambahkan buku.",
    });
  }
};

// ================================================================
// HANDLER: Update Book
// ================================================================
const updateBook = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const validatedData = bookSchema.parse(req.body);

    const existingBook = await prisma.book.findUnique({ where: { id } });
    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: `Buku dengan ID ${id} tidak ditemukan.`,
      });
    }

    const updatedBook = await prisma.book.update({
      where: { id },
      data: validatedData,
    });

    return res.status(200).json({
      success: true,
      message: "Buku berhasil diupdate!",
      data: updatedBook,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
      });
    }
    return res.status(500).json({
      success: false,
      message: "Gagal mengupdate buku.",
    });
  }
};

// ================================================================
// HANDLER: Delete Book
// ================================================================
const deleteBook = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const existingBook = await prisma.book.findUnique({ where: { id } });
    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: `Buku dengan ID ${id} tidak ditemukan.`,
      });
    }

    await prisma.book.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: `Buku "${existingBook.title}" berhasil dihapus!`,
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal menghapus buku.",
    });
  }
};

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };
