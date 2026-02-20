// app/about/page.tsx

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Tentang SnowCommerce
        </h1>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Apa itu SnowCommerce?
            </h2>
            <p className="text-gray-700 leading-relaxed">
              SnowCommerce adalah platform e-commerce minimalis yang mengusung
              tema "Snow White" dengan desain yang bersih, modern, dan elegan.
              Kami menyediakan berbagai produk elektronik dan aksesoris
              berkualitas dengan pengalaman berbelanja yang mudah dan
              menyenangkan.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Visi & Misi
            </h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Visi</h3>
                <p>
                  Menjadi platform e-commerce terpercaya yang memberikan
                  pengalaman belanja online terbaik dengan produk berkualitas
                  dan harga kompetitif.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Misi</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Menyediakan produk elektronik dan aksesoris berkualitas
                    tinggi
                  </li>
                  <li>Memberikan pengalaman berbelanja yang aman dan nyaman</li>
                  <li>Melayani pelanggan dengan cepat dan profesional</li>
                  <li>Terus berinovasi dalam teknologi dan layanan</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Mengapa Memilih Kami?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Produk Terpercaya
                </h3>
                <p className="text-sm text-gray-600">
                  Semua produk 100% original dan bergaransi resmi
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Pengiriman Cepat
                </h3>
                <p className="text-sm text-gray-600">
                  Pengiriman ke seluruh Indonesia dengan estimasi maksimal 3
                  hari kerja
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Pembayaran Aman
                </h3>
                <p className="text-sm text-gray-600">
                  Berbagai metode pembayaran yang aman dan terpercaya
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Customer Service 24/7
                </h3>
                <p className="text-sm text-gray-600">
                  Siap membantu kapan saja untuk kepuasan Anda
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
