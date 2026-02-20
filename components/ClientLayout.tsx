// components/ClientLayout.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdDashboard, MdShoppingCart, MdCategory, MdInfo, MdEmail, MdLogout, MdPerson } from 'react-icons/md';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Public routes yang tidak perlu auth
  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    // Check authentication
    const userStr = localStorage.getItem('user');
    
    if (userStr) {
      setUser(JSON.parse(userStr));
    } else if (!isPublicRoute) {
      router.push('/login');
    }
    
    setIsLoading(false);
  }, [pathname, isPublicRoute, router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  // Loading state
  if (isLoading && !isPublicRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Jika public route, tampilkan tanpa navbar
  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Navbar dengan Glassmorphism Effect */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center space-x-2 group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-gray-600 rounded-lg transform group-hover:rotate-12 transition-transform" />
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                Snow<span className="text-gray-500">Commerce</span>
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                <MdDashboard className="text-lg" />
                Dashboard
              </Link>
              <Link 
                href="/" 
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                <MdShoppingCart className="text-lg" />
                Products
              </Link>
              <Link 
                href="/categories" 
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                <MdCategory className="text-lg" />
                Categories
              </Link>
              <Link 
                href="/about" 
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                <MdInfo className="text-lg" />
                About
              </Link>
              <Link 
                href="/contact" 
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                <MdEmail className="text-lg" />
                Contact
              </Link>
              
              {/* User Menu */}
              {user && (
                <>
                  <div className="w-px h-6 bg-gray-300 mx-2"></div>
                  <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700">
                    <MdPerson className="text-lg" />
                    <span className="max-w-[120px] truncate">{user.name}</span>
                    {user.role === 'admin' && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <MdLogout className="text-lg" />
                    Logout
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">SnowCommerce</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Platform e-commerce modern dengan teknologi web terkini untuk pengalaman belanja online yang menyenangkan.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/" className="hover:text-gray-900">Products</Link></li>
                <li><Link href="/categories" className="hover:text-gray-900">Categories</Link></li>
                <li><Link href="/about" className="hover:text-gray-900">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-gray-900">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Team 5</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li></li>
                <li>Haidar Tafazul Fikri (24051130004)</li>
                <li>Glenferdinza Aghis Asyadda Rayndika Efian (24051130005)</li>
                <li>Aulia Nur Fatmi (24051130011)</li>
                <li>Kevin Beding (24051130017)</li>
                <li>Benedikta Anyarita Pratiwi (24051130019)</li>
                <li></li>
                <li></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>2026 SnowCommerce. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
