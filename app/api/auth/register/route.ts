// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addUser } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validasi input
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    // Simpan user baru
    const newUser = addUser(name, email, password);

    if (newUser) {
      // Registrasi berhasil
      const { password: _, ...userWithoutPassword } = newUser;
      return NextResponse.json({
        success: true,
        message: 'Registrasi berhasil',
        user: userWithoutPassword,
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Email sudah terdaftar' },
        { status: 409 }
      );
    }
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
