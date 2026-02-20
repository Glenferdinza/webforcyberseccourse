// app/api/products/route.ts
// API untuk mendapatkan semua produk (secure version)

import { NextResponse } from 'next/server';
import { safeQuery } from '@/lib/db';

export async function GET() {
  try {
    // Menggunakan safe query
    const products = safeQuery('products');

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length
    });

  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch products',
        message: error.message
      },
      { status: 500 }
    );
  }
}
