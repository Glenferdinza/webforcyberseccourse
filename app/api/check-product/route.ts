// app/api/check-product/route.ts
// VULNERABLE ENDPOINT - UNTUK PRAKTIKUM SQL INJECTION
// Endpoint ini SENGAJA dibuat vulnerable untuk keperluan edukasi
// JANGAN GUNAKAN pattern ini di production!

import { NextRequest, NextResponse } from 'next/server';
import { vulnerableQuery } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // VULNERABILITY: String concatenation tanpa sanitasi
    // Input dari user langsung digabungkan ke SQL query
    // Ini membuat endpoint vulnerable terhadap SQL Injection
    
    if (!id) {
      return NextResponse.json(
        { 
          error: 'Parameter id diperlukan',
          example: '/api/check-product?id=1',
          warning: 'Endpoint ini vulnerable terhadap SQL Injection untuk tujuan praktikum'
        },
        { status: 400 }
      );
    }

    // VULNERABLE CODE: Direct string concatenation
    // Tidak menggunakan prepared statements atau parameterized queries
    const query = "SELECT * FROM products WHERE id = " + id;
    
    console.log('[VULNERABLE] Executing query:', query);
    
    const results = vulnerableQuery(query);

    if (results.length === 0) {
      return NextResponse.json(
        { 
          message: 'Produk tidak ditemukan',
          query_executed: query
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: results,
      query_executed: query,
      warning: 'Endpoint ini vulnerable. Coba exploit dengan: ?id=1 OR 1=1--'
    });

  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        error: 'Database error',
        message: error.message,
        hint: 'Error ini mungkin hasil dari SQL Injection attempt'
      },
      { status: 500 }
    );
  }
}

// Export untuk metode lain juga vulnerable
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Field id diperlukan di request body' },
        { status: 400 }
      );
    }

    // VULNERABLE: String concatenation di POST method juga
    const query = "SELECT * FROM products WHERE id = " + id;
    
    console.log('[VULNERABLE] Executing POST query:', query);
    
    const results = vulnerableQuery(query);

    return NextResponse.json({
      success: true,
      data: results,
      query_executed: query
    });

  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Database error',
        message: error.message
      },
      { status: 500 }
    );
  }
}
