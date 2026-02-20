// app/categories/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdCategory } from 'react-icons/md';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (data.success) {
        const products = data.data;
        const categoryMap = new Map();
        
        products.forEach((product: any) => {
          if (!categoryMap.has(product.category)) {
            categoryMap.set(product.category, {
              name: product.category,
              count: 0,
              products: []
            });
          }
          const cat = categoryMap.get(product.category);
          cat.count++;
          cat.products.push(product);
        });
        
        setCategories(Array.from(categoryMap.values()));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Kategori Produk</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <MdCategory className="text-2xl text-gray-700" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count} produk</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {category.products.slice(0, 3).map((product: any) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="block text-sm text-gray-700 hover:text-gray-900 hover:underline"
                  >
                    {product.name}
                  </Link>
                ))}
                {category.products.length > 3 && (
                  <p className="text-xs text-gray-500">
                    +{category.products.length - 3} produk lainnya
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
