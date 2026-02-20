// app/api/products/[id]/route.ts
// API untuk mendapatkan detail produk by ID (secure version)

import { NextRequest, NextResponse } from 'next/server';
import { safeQueryOne } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Menggunakan safe query
    const product = safeQueryOne('products', { id });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product
    });

  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch product',
        message: error.message
      },
      { status: 500 }
    );
  }
}
