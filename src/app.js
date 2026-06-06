// src/app.js
// Entry point utama aplikasi Manajemen Buku
// Pertemuan 5 — API Dokumentasi dengan Swagger

require("dotenv").config(); // Load variabel dari file .env

const express = require("express");
const { setupSwagger } = require("./config/swagger");

// Import routes
const authRoutes = require("./routes/auth.routes");
const bookRoutes = require("./routes/books.routes");

// ================================================================
// INISIALISASI EXPRESS
// ================================================================
const app = express();
const PORT = process.env.PORT || 3000;

// ================================================================
// GLOBAL MIDDLEWARE
// ================================================================

// Parsing body request sebagai JSON
app.use(express.json());

// Logging sederhana — setiap request dicatat di console
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ================================================================
// ROUTES
// ================================================================

// Route dasar — untuk cek apakah server berjalan
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Selamat datang di API Manajemen Buku!",
    info: {
      docs: `https://pertemuan-6-or-production-1a29.up.railway.app/api-docs`,
      version: "1.0.0",
      bootcamp: "OR 15 — Neo Telemetri",
    },
  });
});

// Route autentikasi (register, login)
app.use("/api/auth", authRoutes);

// Route buku (CRUD)
app.use("/api/books", bookRoutes);

// ================================================================
// SETUP SWAGGER (Pertemuan 5 — ini yang kita pelajari hari ini!)
// ================================================================
setupSwagger(app);

// ================================================================
// GLOBAL ERROR HANDLER
// Middleware error ditandai dengan 4 parameter (err, req, res, next)
// ================================================================
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Terjadi kesalahan internal server.",
  });
});

// ================================================================
// JALANKAN SERVER
// ================================================================
app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log(`🚀 Server berjalan di: http://localhost:${PORT}`);
  console.log(`📖 Swagger UI      di: http://localhost:${PORT}/api-docs`);
  console.log("=".repeat(50));
});
