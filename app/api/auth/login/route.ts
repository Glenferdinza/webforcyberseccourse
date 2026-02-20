// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { vulnerableLogin } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email dan password harus diisi' },
        { status: 400 }
      );
    }

    // VULNERABLE LOGIN - tidak menggunakan prepared statements
    // Memungkinkan SQL injection attack
    const user = vulnerableLogin(email, password);

    if (user) {
      // Login berhasil - return user tanpa password
      const { password: _, ...userWithoutPassword } = user;
      return NextResponse.json({
        success: true,
        message: 'Login berhasil',
        user: userWithoutPassword,
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Email atau password salah' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
