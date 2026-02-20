// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { MdShoppingCart, MdInventory, MdTrendingUp, MdPeople } from 'react-icons/md';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    lowStock: 0,
    totalValue: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (data.success) {
        const products = data.data;
        const categories = Array.from(new Set(products.map((p: any) => p.category)));
        const lowStockProducts = products.filter((p: any) => p.stock < 10);
        const totalValue = products.reduce((sum: number, p: any) => sum + (p.price * p.stock), 0);
        
        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          lowStock: lowStockProducts.length,
          totalValue
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <MdShoppingCart className="text-2xl text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalProducts}</h3>
            <p className="text-sm text-gray-600">Total Produk</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <MdInventory className="text-2xl text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalCategories}</h3>
            <p className="text-sm text-gray-600">Kategori</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <MdTrendingUp className="text-2xl text-orange-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.lowStock}</h3>
            <p className="text-sm text-gray-600">Stok Rendah</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <MdPeople className="text-2xl text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatPrice(stats.totalValue)}</h3>
            <p className="text-sm text-gray-600">Total Nilai Inventori</p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Selamat Datang</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Ini adalah dashboard e-commerce SnowCommerce. Dashboard ini menampilkan statistik produk dan inventori.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Proyek ini dibuat untuk praktikum Keamanan Siber</strong> dengan vulnerability SQL Injection yang disengaja pada endpoint API.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-red-600">PERINGATAN</span>
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="bg-red-50 rounded-lg p-4">
                <p className="font-semibold text-red-700 mb-2">Vulnerable Endpoint:</p>
                <code className="text-xs bg-white px-2 py-1 rounded border border-red-200 block">
                  /api/check-product?id=1
                </code>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="font-semibold text-orange-700 mb-2">Testing Manual:</p>
                <p className="text-xs text-gray-600">
                  Coba akses endpoint dengan berbagai payload SQL Injection untuk test vulnerability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
