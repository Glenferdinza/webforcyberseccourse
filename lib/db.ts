// lib/db.ts
// Simple JSON-based database system

import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'database.json');

// Load database
export function getDatabase() {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
}

// Save database
export function saveDatabase(data: any) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Safe query untuk products
export function safeQuery(table: string, conditions?: any) {
  const db = getDatabase();
  let results = db[table] || [];
  
  if (conditions) {
    results = results.filter((item: any) => {
      return Object.keys(conditions).every(key => item[key] === conditions[key]);
    });
  }
  
  return results;
}

// Safe query single item
export function safeQueryOne(table: string, conditions: any) {
  const results = safeQuery(table, conditions);
  return results.length > 0 ? results[0] : null;
}

// VULNERABLE FUNCTION - untuk SQL Injection simulation
// Fungsi ini simulate SQL injection vulnerability
export function vulnerableQuery(queryString: string) {
  const db = getDatabase();
  
  // Parse query string untuk simulate SQL
  // Contoh: "SELECT * FROM products WHERE id = 1"
  // Atau: "SELECT * FROM products WHERE id = 1 OR 1=1"
  
  // Cek apakah ada UNION attack
  if (queryString.toUpperCase().includes('UNION')) {
    // Extract table name dari UNION query
    const unionMatch = queryString.match(/UNION\s+SELECT\s+.*\s+FROM\s+(\w+)/i);
    if (unionMatch) {
      const tableName = unionMatch[1];
      // Return data dari tabel yang disebutkan
      return db[tableName] || [];
    }
  }
  
  // Cek apakah ada OR 1=1 attack
  if (queryString.toUpperCase().includes('OR 1=1') || queryString.toUpperCase().includes('OR 1 = 1')) {
    // Return semua products
    return db.products;
  }
  
  // Normal query - extract id
  const idMatch = queryString.match(/WHERE\s+id\s*=\s*(\d+)/i);
  if (idMatch) {
    const id = parseInt(idMatch[1]);
    const product = db.products.find((p: any) => p.id === id);
    return product ? [product] : [];
  }
  
  // Default return products
  return db.products;
}

// VULNERABLE LOGIN - untuk authentication bypass
// Tidak menggunakan prepared statements (intentional vulnerability)
export function vulnerableLogin(email: string, password: string) {
  const db = getDatabase();
  
  // Simulate SQL query dengan string concatenation (VULNERABLE!)
  // Contoh: SELECT * FROM users WHERE email = 'input' AND password = 'input'
  const queryString = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;
  
  // Check untuk basic SQL injection patterns
  if (email.includes("' OR '1'='1") || email.includes("' OR 1=1") || 
      password.includes("' OR '1'='1") || password.includes("' OR 1=1")) {
    // Return first admin user (authentication bypass)
    return db.users.find((u: any) => u.role === 'admin') || db.users[0];
  }
  
  if (email.includes("'--") || password.includes("'--")) {
    // SQL comment attack - bypass password check
    const user = db.users.find((u: any) => u.email === email.split("'")[0]);
    return user || null;
  }
  
  // Normal authentication
  const user = db.users.find((u: any) => u.email === email && u.password === password);
  return user || null;
}

// Add new user
export function addUser(name: string, email: string, password: string) {
  const db = getDatabase();
  
  // Check if email already exists
  const existingUser = db.users.find((u: any) => u.email === email);
  if (existingUser) {
    return null;
  }
  
  const newUser = {
    id: db.users.length + 1,
    name,
    email,
    password,
    role: 'user',
    created_at: new Date().toISOString()
  };
  
  db.users.push(newUser);
  saveDatabase(db);
  
  return newUser;
}

// Get all users
export function getUsers() {
  const db = getDatabase();
  return db.users || [];
}

export default getDatabase;
