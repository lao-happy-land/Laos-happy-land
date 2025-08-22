'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ProjectItem {
  id: string;
  name: string;
  rating: number;
  status: string;
  area: string;
  apartments: string;
  buildings: string;
  address: string;
  description: string;
  developer: string;
  image: string;
}

const ProjectPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [filters, setFilters] = useState({
    area: 'Toàn quốc',
    type: 'Tất cả',
    price: 'Tất cả',
    status: 'Tất cả'
  });

  const backgroundImages = [
    "/images/landingpage/hero-slider/hero-banner-1.jpg",
    "/images/landingpage/hero-slider/hero-banner-2.jpg",
    "/images/landingpage/hero-slider/hero-banner-3.jpg",
    "/images/landingpage/hero-slider/hero-banner-4.jpg",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [backgroundImages.length]);

  const projects: ProjectItem[] = [
    {
      id: 'pj6418',
      name: 'Spana Tower',
      rating: 5,
      status: 'Đang cập nhật',
      area: '4.213 m²',
      apartments: '1281 căn hộ',
      buildings: '2 tòa nhà',
      address: 'Đường Nguyễn Phước Lan, Phường Hòa Xuân, Quận Cẩm Lệ, Đà Nẵng',
      description: 'Spana Tower là tổ hợp căn hộ cao cấp tọa lạc ngay trung tâm khu đô thị sinh thái Hòa Xuân, do Tập đoàn Sun Group phát triển. Dự án gồm 2 tòa tháp cao 22 tầng nổi và 02 tầng hầm, với hơn 1.200 căn hộ, đa dạng diện tích từ 1 phòng ngủ đến 3 phòng ngủ, Penthouse.',
      developer: 'Tập đoàn Sun Group',
      image: '/images/landingpage/project/project-1.jpg'
    },
    {
      id: 'pj6422',
      name: 'Happy Home Thanh Hóa',
      rating: 8,
      status: 'Đang mở bán',
      area: '9,19 ha',
      apartments: '2824 căn hộ',
      buildings: '18 tòa nhà',
      address: 'Đường Đại lộ Nam Sông Mã, Phường Đông Hải và Phường Đông Hương, Thành phố Thanh Hóa, Thanh Hóa',
      description: 'Happy Home Thanh Hóa là dự án chung cư nhà ở xã hội nằm trong khu đô thị Vinhomes Star City, thuộc phường Đông Hương và Đông Hải, giáp với đại lộ Nam Sông Mã, bên cạnh trung tâm hành chính mới của thành phố.',
      developer: 'Tập đoàn Vingroup',
      image: '/images/landingpage/project/project-2.jpg'
    },
    {
      id: 'pj6416',
      name: 'AVA Center',
      rating: 7,
      status: 'Đang cập nhật',
      area: '7.342,9 m²',
      apartments: '845 căn hộ',
      buildings: '2 Block',
      address: 'Đường Thủ Khoa Huân, Phường An Phú, Thành phố Thuận An, Bình Dương',
      description: 'AVA Center là dự án căn hộ chung cư kết hợp thương mại dịch vụ và văn phòng, nằm ngay mặt tiền đường Thủ Khoa Huân, Thuận An, Bình Dương.',
      developer: 'Công ty TNHH Tyson An Phú',
      image: '/images/landingpage/project/project-3.jpg'
    },
    {
      id: 'pj6414',
      name: 'Baia Retreat Hội Vân',
      rating: 9,
      status: 'Đang cập nhật',
      area: '42ha',
      apartments: '3 phân khu',
      buildings: 'The Thera, The Signature, The Heritage',
      address: 'Xã Cát Hiệp, Huyện Phù Cát, Bình Định',
      description: 'Baia Retreat Hội Vân là Khu đô thị nghỉ dưỡng khoáng nóng tiên phong tại Bình Định, được phát triển theo mô hình "Di sản và Chữa lành" độc đáo.',
      developer: 'Tập đoàn Trường Thành Việt Nam',
      image: '/images/landingpage/apartment/apart-1.jpg'
    },
    {
      id: 'pj6415',
      name: 'Sundora Tower',
      rating: 6,
      status: 'Đang cập nhật',
      area: '2.647,8 m²',
      apartments: '236 căn hộ',
      buildings: '1 tòa tháp',
      address: 'Đường Như Nguyệt, Phường Thuận Phước, Quận Hải Châu, Đà Nẵng',
      description: 'Sundora Tower là tổ hợp thương mại dịch vụ, văn phòng và căn hộ lưu trú cao cấp nằm ngay bên bờ sông Hàn.',
      developer: 'Công ty Cổ phần Tập đoàn Phúc Hoàng Nguyên',
      image: '/images/landingpage/apartment/apart-2.jpg'
    },
    {
      id: 'pj6417',
      name: 'Starlight Quảng Ngãi',
      rating: 10,
      status: 'Đang mở bán',
      area: '2,8 ha',
      apartments: '133 căn hộ',
      buildings: '133 Shophouse',
      address: 'Đường Huỳnh Thúc Kháng, Phường Nghĩa Lộ, Thành phố Quảng Ngãi, Quảng Ngãi',
      description: 'Starlight Quảng Ngãi là dự án khu dân cư phía Bắc đường Huỳnh Thúc Kháng, tọa lạc tại phường Nghĩa Lộ, TP Quảng Ngãi.',
      developer: 'Liên danh Tổng công ty CP Xuất nhập khẩu và Xây dựng Việt Nam',
      image: '/images/landingpage/apartment/apart-3.jpg'
    }
  ];

  const newsArticles = [
    {
      title: 'Noble Palace Tay Thang Long Tiếp Tục Lên Sóng Livestream Ngày 22/8, Giá Khởi Điểm 9,2 Tỷ Đồng',
      time: 'Hôm nay',
      link: '#'
    },
    {
      title: 'Mệnh Thổ Hợp Cây Gì? Top 10 Cây Phong Thủy Mang Lại May Mắn Và Thịnh Vượng Cho Người Mệnh Thổ',
      time: 'Hôm nay',
      link: '#'
    },
    {
      title: 'Đại Khê Thủy Là Gì? Khám Phá Màu Sắc Và Hướng Nhà Hợp Phong Thủy',
      time: 'Hôm nay',
      link: '#'
    }
  ];

  const evaluationVideos = [
    {
      title: 'Có Còn Căn Hộ Dưới 100 triệu/m2 Ở Quận 2 TP.HCM Không?',
      time: '2 năm trước',
      link: '#'
    },
    {
      title: 'Những Dự Án Căn Hộ View Sông Sài Gòn Tại Thủ Thiêm',
      time: '2 năm trước',
      link: '#'
    },
    {
      title: 'Haven Park Residence - có thực sự là không gian sống "chạm tay vào thiên nhiên"?',
      time: '3 năm trước',
      link: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 
                ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }
                `}
              style={{
                backgroundImage: `url(${image})`,
              }}
            />
          ))}
        </div>


        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-7xl mx-auto px-6 pb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Masteri Rivera Danang</h1>
            <p className="text-white/90 text-lg">Đường Quy Mỹ, Phường Hòa Cường Nam, Quận Hải Châu, Đà Nẵng</p>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 z-20">
          <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>

        <button 
          onClick={() => setCurrentSlide(currentSlide === 0 ? backgroundImages.length - 1 : currentSlide - 1)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button 
          onClick={() => setCurrentSlide((currentSlide + 1) % backgroundImages.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="absolute bottom-10 right-20 z-20 flex gap-1 ">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-2 rounded-full transition-all  ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>


      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="text-sm text-gray-500">
          <span>Dự án / Dự án BĐS Toàn Quốc</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">            
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Khu vực</label>
                  <select 
                    value={filters.area}
                    onChange={(e) => setFilters({...filters, area: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Toàn quốc</option>
                    <option>Hà Nội</option>
                    <option>TP.HCM</option>
                    <option>Đà Nẵng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại hình</label>
                  <select 
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Tất cả</option>
                    <option>Căn hộ chung cư</option>
                    <option>Biệt thự, liền kề</option>
                    <option>Shophouse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mức giá</label>
                  <select 
                    value={filters.price}
                    onChange={(e) => setFilters({...filters, price: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Tất cả</option>
                    <option>Dưới 1 tỷ</option>
                    <option>1-3 tỷ</option>
                    <option>3-5 tỷ</option>
                    <option>Trên 5 tỷ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                  <select 
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Tất cả</option>
                    <option>Đang mở bán</option>
                    <option>Đang cập nhật</option>
                    <option>Sắp mở bán</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex gap-4">
                <button className="text-blue-600 hover:text-blue-800">Xóa tiêu chí lọc</button>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-600">Hiện đang có <span className="font-semibold">5.772</span> dự án</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-gray-500">Sắp xếp:</span>
                <button className="text-blue-600 font-semibold text-sm">Mới nhất</button>
              </div>
            </div>

            <div className="space-y-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <Image
                          src={project.image}
                          alt={project.name}
                          width={200}
                          height={150}
                          className="w-48 h-36 object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-semibold text-gray-900">{project.name}</h3>
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
                              {project.rating}
                            </span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            project.status === 'Đang mở bán' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3">
                          <span>{project.area}</span> · 
                          <span className="ml-1">{project.apartments}</span> · 
                          <span className="ml-1">{project.buildings}</span>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-3 font-medium">{project.address}</p>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                        
                        <p className="text-sm text-blue-600 font-medium">{project.developer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50">1</button>
                <button className="px-3 py-2 text-gray-500 border border-gray-300 rounded hover:bg-gray-50">2</button>
                <button className="px-3 py-2 text-gray-500 border border-gray-300 rounded hover:bg-gray-50">3</button>
                <button className="px-3 py-2 text-gray-500 border border-gray-300 rounded hover:bg-gray-50">4</button>
                <button className="px-3 py-2 text-gray-500 border border-gray-300 rounded hover:bg-gray-50">5</button>
                <span className="px-3 py-2 text-gray-500">...</span>
                <button className="px-3 py-2 text-gray-500 border border-gray-300 rounded hover:bg-gray-50">578</button>
                <button className="px-3 py-2 text-gray-500 border border-gray-300 rounded hover:bg-gray-50">→</button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Đánh giá dự án</h3>
                <a href="#" className="text-blue-600 text-sm hover:text-blue-800">Xem tất cả</a>
              </div>
              <div className="space-y-4">
                {evaluationVideos.map((video, index) => (
                  <div key={index} className="group cursor-pointer">
                    <div className="flex gap-3">
                      <div className="w-16 h-12 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2">
                          {video.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">{video.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Tin tức</h3>
                <a href="#" className="text-blue-600 text-sm hover:text-blue-800">Xem tất cả</a>
              </div>
              <div className="space-y-4">
                {newsArticles.map((article, index) => (
                  <div key={index} className="group cursor-pointer">
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2 mb-1">
                      {article.title}
                    </h4>
                    <p className="text-xs text-gray-500">{article.time}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Chủ đề nổi bật</h4>
                <div className="space-y-2">
                  <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">Tin tức bất động sản</a>
                  <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">Bất động sản Hà Nội</a>
                  <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">Bất động sản Hồ Chí Minh</a>
                  <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">Báo cáo thị trường</a>
                  <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">Mua bất động sản</a>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-800 mt-2">Xem thêm</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Bất động sản bán</h3>
              <div className="space-y-2 text-sm">
                <a href="#" className="block hover:text-blue-400">Bán căn hộ chung cư Hà Nội</a>
                <a href="#" className="block hover:text-blue-400">Bán chung cư mini, căn hộ dịch vụ Hà Nội</a>
                <a href="#" className="block hover:text-blue-400">Bán nhà riêng Hà Nội</a>
                <a href="#" className="block hover:text-blue-400">Bán nhà biệt thự, liền kề Hà Nội</a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Bất động sản cho thuê</h3>
              <div className="space-y-2 text-sm">
                <a href="#" className="block hover:text-blue-400">Cho thuê căn hộ chung cư Hà Nội</a>
                <a href="#" className="block hover:text-blue-400">Cho thuê chung cư mini, căn hộ dịch vụ Hà Nội</a>
                <a href="#" className="block hover:text-blue-400">Cho thuê nhà riêng Hà Nội</a>
                <a href="#" className="block hover:text-blue-400">Cho thuê nhà biệt thự, liền kề Hà Nội</a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Khoảng giá tìm kiếm nhiều nhất</h3>
              <div className="space-y-2 text-sm">
                <a href="#" className="block hover:text-blue-400">Bán căn hộ chung cư Hà Nội từ 3 đến 5 tỷ</a>
                <a href="#" className="block hover:text-blue-400">Bán căn hộ chung cư Hồ Chí Minh từ 3 đến 5 tỷ</a>
                <a href="#" className="block hover:text-blue-400">Bán nhà riêng Hà Nội từ 10 đến 20 tỷ</a>
                <a href="#" className="block hover:text-blue-400">Bán nhà riêng Hồ Chí Minh từ 10 đến 20 tỷ</a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
              <div className="space-y-2 text-sm">
                <p>CÔNG TY CỔ PHẦN PROPERTYGURU VIỆT NAM</p>
                <p>Tầng 31, Keangnam Hanoi Landmark Tower</p>
                <p>Phường Yên Hòa, Thành phố Hà Nội, Việt Nam</p>
                <p>(024) 3562 5939 - (024) 3562 5940</p>
                <div className="flex items-center space-x-4 mt-4">
                  <a href="tel:19001881" className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
                    Hotline 1900 1881
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>Ghi rõ nguồn &quot;Batdongsan.com.vn&quot; khi phát hành lại thông tin từ website này.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProjectPage;