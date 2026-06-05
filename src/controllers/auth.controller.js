// src/controllers/auth.controller.js
// Controller untuk autentikasi — berisi semua business logic register & login

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ================================================================
// SCHEMA VALIDASI (Zod)
// ================================================================
const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password tidak boleh kosong"),
});

// ================================================================
// HANDLER: Register
// ================================================================
const register = async (req, res) => {
  try {
    // 1. Validasi input
    const validatedData = registerSchema.parse(req.body);
    const { name, email, password } = validatedData;

    // 2. Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email sudah terdaftar. Gunakan email lain.",
      });
    }

    // 3. Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Simpan user baru ke database
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    return res.status(201).json({
      success: true,
      message: "Registrasi berhasil! Silakan login.",
      data: newUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: error.errors.map((e) => e.message),
      });
    }
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
    });
  }
};

// ================================================================
// HANDLER: Login
// ================================================================
const login = async (req, res) => {
  try {
    // 1. Validasi input
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // 2. Cari user berdasarkan email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah.",
      });
    }

    // 3. Bandingkan password dengan hash di database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah.",
      });
    }

    // 4. Buat JWT Token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login berhasil!",
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: error.errors.map((e) => e.message),
      });
    }
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
    });
  }
};

module.exports = { register, login };
