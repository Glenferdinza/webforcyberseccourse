// app/products/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MdError, MdRemove, MdAdd, MdShoppingCart, MdShoppingBag } from 'react-icons/md';
import { FaTruck, FaCreditCard, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';
import { BsStarFill } from 'react-icons/bs';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url: string;
  created_at: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        setProduct(data.data);
      } else {
        setError('Produk tidak ditemukan');
      }
    } catch (err) {
      setError('Error menghubungi server');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && product && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MdError className="text-6xl text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-700 mb-4">{error || 'Produk tidak ditemukan'}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 hover:scale-105"
          >
            ← Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-gray-900 hover:scale-105">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/" className="text-gray-600 hover:text-gray-900 hover:scale-105">
              Produk
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 cursor-pointer hover:border-gray-400 hover:scale-105"
                >
                  <img
                    src={product.image_url}
                    alt={`${product.name} ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg mb-3">
                {product.category}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="border-t border-b border-gray-200 py-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                <span className="text-gray-500 line-through">
                  {formatPrice(product.price * 1.2)}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-md font-medium">
                  -17%
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Stok tersedia:</span>
                <span className={`font-semibold ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                  {product.stock} unit
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Jumlah:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-lg border border-gray-300 hover:border-gray-900 hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 flex items-center justify-center font-bold"
                  >
                    <MdRemove />
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 rounded-lg border border-gray-300 hover:border-gray-900 hover:scale-110 disabled:opacity-30 disabled:hover:scale-100 flex items-center justify-center font-bold"
                  >
                    <MdAdd />
                  </button>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button className="w-full py-4 bg-gray-900 text-white rounded-xl font-semibold text-lg hover:bg-gray-800 hover:scale-105 hover:shadow-xl transform transition-all flex items-center justify-center gap-2">
                  <MdShoppingBag className="text-xl" />
                  Beli Sekarang
                </button>
                <button className="w-full py-4 border-2 border-gray-900 text-gray-900 rounded-xl font-semibold text-lg hover:bg-gray-50 hover:scale-105 transform transition-all flex items-center justify-center gap-2">
                  <MdShoppingCart className="text-xl" />
                  Tambah ke Keranjang
                </button>
              </div>
            </div>

            <div className="glass-strong rounded-xl p-6 space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <BsStarFill className="text-yellow-500" />
                Keunggulan Produk
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-600" />
                  Garansi resmi 1 tahun
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-600" />
                  Gratis ongkir seluruh Indonesia
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-600" />
                  Bisa tukar barang dalam 7 hari
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-600" />
                  Customer service 24/7
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass rounded-xl p-6 text-center hover:scale-105">
            <FaTruck className="text-4xl text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-2">Pengiriman Cepat</h3>
            <p className="text-sm text-gray-600">Estimasi 1-3 hari kerja</p>
          </div>
          <div className="glass rounded-xl p-6 text-center hover:scale-105">
            <FaCreditCard className="text-4xl text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-2">Pembayaran Aman</h3>
            <p className="text-sm text-gray-600">Berbagai metode pembayaran</p>
          </div>
          <div className="glass rounded-xl p-6 text-center hover:scale-105">
            <FaShieldAlt className="text-4xl text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-2">Jaminan Kualitas</h3>
            <p className="text-sm text-gray-600">100% produk original</p>
          </div>
        </div>
      </div>
    </div>
  );
}
