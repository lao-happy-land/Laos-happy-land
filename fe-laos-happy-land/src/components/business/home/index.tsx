const HomeContent = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="heading-1 mb-6 max-w-4xl mx-auto">
            Khám phá vẻ đẹp thiên nhiên và văn hóa độc đáo của 
            <span className="text-yellow-400"> Lào</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Trải nghiệm những chuyến du lịch đáng nhớ với dịch vụ chuyên nghiệp 
            và hướng dẫn viên bản địa am hiểu văn hóa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-primary text-lg px-8 py-4">
              Khám phá ngay
            </button>
            <button className="btn btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-900">
              Xem tour
            </button>
          </div>
        </div>
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-400 rounded-full"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-green-400 rounded-full"></div>
          <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-red-400 rounded-full"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4 text-gray-900">
              Tại sao chọn Laos Happy Land?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi mang đến trải nghiệm du lịch tuyệt vời với dịch vụ chất lượng cao
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Hướng dẫn viên chuyên nghiệp</h3>
              <p className="text-gray-600">
                Đội ngũ hướng dẫn viên bản địa giàu kinh nghiệm, am hiểu sâu sắc về văn hóa và lịch sử Lào
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">An toàn & Tin cậy</h3>
              <p className="text-gray-600">
                Cam kết về an toàn và chất lượng dịch vụ. Bảo hiểm du lịch toàn diện cho mọi hành trình
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Giá cả hợp lý</h3>
              <p className="text-gray-600">
                Mức giá cạnh tranh với chất lượng dịch vụ tốt nhất. Nhiều gói tour phù hợp với mọi ngân sách
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4 text-gray-900">
              Điểm đến phổ biến
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá những địa điểm du lịch nổi tiếng và hấp dẫn nhất tại Lào
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Destination cards would be populated from API */}
            <div className="card overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Vientiane</h3>
                <p className="text-gray-600 mb-4">
                  Thủ đô xinh đẹp với những ngôi chùa cổ kính và kiến trúc Pháp độc đáo
                </p>
                <button className="btn btn-primary">Xem chi tiết</button>
              </div>
            </div>

            <div className="card overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-green-400 to-green-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Luang Prabang</h3>
                <p className="text-gray-600 mb-4">
                  Di sản thế giới UNESCO với vẻ đẹp cổ kính và văn hóa phong phú
                </p>
                <button className="btn btn-primary">Xem chi tiết</button>
              </div>
            </div>

            <div className="card overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Pakse</h3>
                <p className="text-gray-600 mb-4">
                  Cổng vào miền Nam Lào với thác Khone Phapheng hùng vĩ
                </p>
                <button className="btn btn-primary">Xem chi tiết</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-blue-600 text-white">
        <div className="container text-center">
          <h2 className="heading-2 mb-4">
            Sẵn sàng cho chuyến phiêu lưu tiếp theo?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Liên hệ với chúng tôi ngay hôm nay để lên kế hoạch cho chuyến du lịch Lào trong mơ của bạn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
              Liên hệ ngay
            </button>
            <button className="btn btn-outline border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4">
              Xem tất cả tour
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeContent;
