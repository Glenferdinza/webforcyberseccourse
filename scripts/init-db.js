// scripts/init-db.js
// Script untuk inisialisasi database SQLite dengan tabel products dan admin_credentials

const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'ecommerce.db');

console.log('🔧 Memulai inisialisasi database...');

async function initDatabase() {
  // Untuk Node.js, kita tidak perlu locateFile karena sql.js otomatis detect
  const SQL = await initSqlJs();
  
  const db = new SQL.Database();
  
  // Buat tabel products
  try {
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        category TEXT,
        stock INTEGER DEFAULT 0,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabel products berhasil dibuat');
  } catch (err) {
    console.error('❌ Error membuat tabel products:', err);
  }
  
  // Buat tabel admin_credentials (target eksploitasi SQL Injection)
  try {
    db.run(`
      CREATE TABLE IF NOT EXISTS admin_credentials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT,
        role TEXT DEFAULT 'admin',
        secret_key TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabel admin_credentials berhasil dibuat (target eksploitasi)');
  } catch (err) {
    console.error('❌ Error membuat tabel admin_credentials:', err);
  }
  
  // Insert data produk sample
  const products = [
    {
      name: 'Laptop Premium',
      description: 'Laptop performa tinggi dengan desain minimalis dan elegan',
      price: 15000000,
      category: 'Electronics',
      stock: 10,
      image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'
    },
    {
      name: 'Wireless Mouse',
      description: 'Mouse ergonomis dengan koneksi wireless yang stabil',
      price: 250000,
      category: 'Accessories',
      stock: 50,
      image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'
    },
    {
      name: 'Mechanical Keyboard',
      description: 'Keyboard mekanikal dengan RGB lighting dan desain premium',
      price: 1200000,
      category: 'Accessories',
      stock: 25,
      image_url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400'
    },
    {
      name: 'USB-C Hub',
      description: 'Hub multifungsi dengan berbagai port untuk produktivitas maksimal',
      price: 350000,
      category: 'Accessories',
      stock: 30,
      image_url: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400'
    },
    {
      name: 'Webcam HD',
      description: 'Webcam berkualitas HD untuk meeting dan streaming',
      price: 800000,
      category: 'Electronics',
      stock: 15,
      image_url: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400'
    },
    {
      name: 'Monitor 4K',
      description: 'Monitor 27 inch dengan resolusi 4K dan color accuracy tinggi',
      price: 4500000,
      category: 'Electronics',
      stock: 8,
      image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400'
    },
    {
      name: 'Laptop Stand',
      description: 'Stand aluminium untuk laptop dengan desain minimalis',
      price: 250000,
      category: 'Accessories',
      stock: 40,
      image_url: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=400'
    },
    {
      name: 'Wireless Headphones',
      description: 'Headphones premium dengan noise cancellation',
      price: 2500000,
      category: 'Audio',
      stock: 20,
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
    }
  ];
  
  products.forEach((product) => {
    db.run(`
      INSERT OR IGNORE INTO products (name, description, price, category, stock, image_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      product.name,
      product.description,
      product.price,
      product.category,
      product.stock,
      product.image_url
    ]);
  });
  
  console.log('✅ Data produk sample berhasil diinsert');
  
  // Insert data admin credentials (target untuk SQL Injection exploitation)
  const adminCredentials = [
    {
      username: 'admin',
      password: 'SuperSecretPassword123!',
      email: 'admin@ecommerce.local',
      role: 'superadmin',
      secret_key: 'FLAG{SQL_INJ3CT10N_VULN3R4BL3_2026}'
    },
    {
      username: 'manager',
      password: 'Manager@2026',
      email: 'manager@ecommerce.local',
      role: 'manager',
      secret_key: 'MNG-KEY-9876543210'
    },
    {
      username: 'staff',
      password: 'StaffAccess2026',
      email: 'staff@ecommerce.local',
      role: 'staff',
      secret_key: 'STAFF-TOKEN-ABC123XYZ'
    }
  ];
  
  adminCredentials.forEach((admin) => {
    db.run(`
      INSERT OR IGNORE INTO admin_credentials (username, password, email, role, secret_key)
      VALUES (?, ?, ?, ?, ?)
    `, [
      admin.username,
      admin.password,
      admin.email,
      admin.role,
      admin.secret_key
    ]);
  });
  
  console.log('✅ Data admin_credentials berhasil diinsert (berisi flag untuk praktikum)');
  
  // Save database to file
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
  
  db.close();
  
  console.log('');
  console.log('🎉 Database berhasil diinisialisasi!');
  console.log('📁 Lokasi: ecommerce.db');
  console.log('');
  console.log('⚠️  PERINGATAN KEAMANAN:');
  console.log('   Tabel admin_credentials berisi data sensitif untuk praktikum SQL Injection');
  console.log('   API endpoint /api/check-product sengaja dibuat vulnerable');
  console.log('   Gunakan sqlmap untuk testing: sqlmap -u "http://localhost:3000/api/check-product?id=1"');
  console.log('');
}

initDatabase().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
