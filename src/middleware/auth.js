// src/middleware/auth.js
// Middleware untuk memverifikasi JWT token
// Middleware ini dipasang di depan route yang butuh autentikasi

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // 1. Ambil token dari header Authorization

  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Akses ditolak. Tidak ada token yang diberikan.",
    });
  }

  // 2. Pisahkan kata "Bearer" dari token-nya
 
  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      success: false,
      message: "Format token tidak valid. Gunakan format: Bearer <token>",
    });
  }

  const token = parts[1];

  // 3. Verifikasi token menggunakan JWT_SECRET
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Simpan data user ke dalam request agar bisa diakses di route handler
    // decoded berisi: { id, name, email, iat, exp }
    req.user = decoded;

    // Lanjut ke route handler berikutnya
    next();
  } catch (error) {
    // Token tidak valid atau sudah expired
    return res.status(403).json({
      success: false,
      message: "Token tidak valid atau sudah kedaluwarsa. Silakan login ulang.",
    });
  }
};

module.exports = { authMiddleware };
