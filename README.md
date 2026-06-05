# 📚 Aplikasi Manajemen Buku — API
### Backend Bootcamp OR 15 | UKM Neo Telemetri

Program demo untuk **Pertemuan 5: API Dokumentasi dengan Swagger**.

---

## 🛠️ Tech Stack

| Teknologi | Fungsi |
|---|---|
| **Express.js** | Web framework (P2) |
| **Prisma** | ORM — koneksi ke database (P3) |
| **MySQL** | Database (P3) |
| **JWT** | Autentikasi (P4) |
| **bcrypt** | Hash password (P4) |
| **Zod** | Validasi input (P4) |
| **swagger-jsdoc** | Generate dokumentasi dari kode ⭐ (P5) |
| **swagger-ui-express** | Tampilkan dokumentasi di browser (P5) |

---

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js (v18 atau lebih baru)
- MySQL (berjalan di localhost)

### Langkah 1: Clone & Install Dependencies
```bash
# Masuk ke folder
cd demo-app

# Install semua package
npm install
```

### Langkah 2: Setup Environment
```bash
# Salin file .env.example menjadi .env
cp .env.example .env

# Edit file .env — sesuaikan dengan konfigurasi MySQL kamu
# DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/buku_db"
```

### Langkah 3: Setup Database
```bash
# Buat database & jalankan migration
npm run migrate
```
> Prisma akan otomatis membuat tabel `User` dan `Book` di MySQL.

### Langkah 4: Jalankan Server
```bash
npm run dev
```

Server akan berjalan di: **http://localhost:3000**

---

## 📖 Dokumentasi API

Buka browser dan kunjungi: **http://localhost:3000/api-docs**

Kamu akan melihat Swagger UI yang interaktif!

---

## 🔗 Endpoint yang Tersedia

### 🔓 Publik (tanpa login)
| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/` | Cek status server |
| POST | `/api/auth/register` | Registrasi user baru |
| POST | `/api/auth/login` | Login & dapatkan JWT |
| GET | `/api/books` | Lihat semua buku |
| GET | `/api/books/:id` | Lihat detail buku |

### 🔒 Terproteksi (butuh JWT token)
| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/books` | Tambah buku baru |
| PUT | `/api/books/:id` | Update buku |
| DELETE | `/api/books/:id` | Hapus buku |

---

## 🧪 Cara Test di Swagger UI

1. Buka **http://localhost:3000/api-docs**
2. Klik **POST /api/auth/register** → register akun baru
3. Klik **POST /api/auth/login** → login & salin token dari response
4. Klik tombol **Authorize** 🔓 di kanan atas
5. Masukkan: `Bearer <token_kamu>`
6. Klik **Authorize** → sekarang semua endpoint 🔒 bisa diakses!

---

## 📁 Struktur Folder

```
demo-app/
├── prisma/
│   └── schema.prisma      # Definisi model database
├── src/
│   ├── config/
│   │   └── swagger.js     # ⭐ Konfigurasi Swagger (P5)
│   ├── middleware/
│   │   └── auth.js        # JWT middleware (P4)
│   ├── routes/
│   │   ├── auth.routes.js # Route auth + swagger docs (P5)
│   │   └── books.routes.js# Route buku + swagger docs (P5)
│   └── app.js             # Entry point aplikasi
├── .env                   # Variabel environment (jangan di-commit!)
├── .env.example           # Template .env
└── package.json
```

---

*Dibuat untuk Bootcamp Backend OR 15 — UKM Neo Telemetri 2026*
