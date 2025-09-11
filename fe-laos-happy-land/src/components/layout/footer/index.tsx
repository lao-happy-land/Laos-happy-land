import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 21l4-4 4 4"
                  />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">Lào BDS</div>
                <div className="-mt-1 text-xs text-gray-400">
                  Bất động sản Lào
                </div>
              </div>
            </div>
            <p className="mb-4 text-gray-300">
              Nền tảng bất động sản hàng đầu tại Lào. Kết nối người mua, người
              bán và nhà đầu tư với những cơ hội bất động sản tốt nhất.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-400 transition-colors hover:text-blue-400"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-gray-400 transition-colors hover:text-blue-400"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-gray-400 transition-colors hover:text-blue-400"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/mua-ban"
                  className="text-gray-300 transition-colors hover:text-blue-400"
                >
                  Mua bán BDS
                </Link>
              </li>
              <li>
                <Link
                  href="/cho-thue"
                  className="text-gray-300 transition-colors hover:text-blue-400"
                >
                  Cho thuê BDS
                </Link>
              </li>
              <li>
                <Link
                  href="/du-an"
                  className="text-gray-300 transition-colors hover:text-blue-400"
                >
                  Dự án BDS
                </Link>
              </li>
              <li>
                <Link
                  href="/tin-tuc"
                  className="text-gray-300 transition-colors hover:text-blue-400"
                >
                  Tin tức thị trường
                </Link>
              </li>
              <li>
                <Link
                  href="/dang-tin"
                  className="text-gray-300 transition-colors hover:text-blue-400"
                >
                  Đăng tin miễn phí
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Loại hình BDS</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/can-ho"
                  className="text-gray-300 transition-colors hover:text-blue-400"
                >
                  Căn hộ/Chung cư
                </Link>
              </li>
              <li>
                <Link
                  href="/nha-o"
                  className="text-gray-300 transition-colors hover:text-blue-400"
                >
                  Nhà ở
                </Link>
              </li>
              <li>
                <Link
                  href="/dat"
                  className="text-gray-300 transition-colors hover:text-blue-400"
                >
                  Đất
                </Link>
              </li>
              <li>
                <Link
                  href="/van-phong"
                  className="text-gray-300 transition-colors hover:text-blue-400"
                >
                  Văn phòng
                </Link>
              </li>
              <li>
                <Link
                  href="/mat-bang"
                  className="text-gray-300 transition-colors hover:text-blue-400"
                >
                  Mặt bằng kinh doanh
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Thông tin liên hệ</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start space-x-3">
                <svg
                  className="mt-1 h-5 w-5 flex-shrink-0 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p>123 Đường Setthathirath, Chanthabouly, Vientiane, Lào</p>
              </div>
              <div className="flex items-center space-x-3">
                <svg
                  className="h-5 w-5 flex-shrink-0 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <div>
                  <p>Hotline: +856 20 123 4567</p>
                  <p className="text-sm text-gray-400">Hỗ trợ 24/7</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <svg
                  className="h-5 w-5 flex-shrink-0 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <p>info@laobds.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Links */}
        <div className="mt-8 border-t border-gray-800 pt-8">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h4 className="mb-3 font-semibold">Hỗ trợ khách hàng</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link
                    href="/huong-dan"
                    className="transition-colors hover:text-blue-400"
                  >
                    Hướng dẫn đăng tin
                  </Link>
                </li>
                <li>
                  <Link
                    href="/bao-gia"
                    className="transition-colors hover:text-blue-400"
                  >
                    Bảng giá dịch vụ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="transition-colors hover:text-blue-400"
                  >
                    Câu hỏi thường gặp
                  </Link>
                </li>
                <li>
                  <Link
                    href="/lien-he"
                    className="transition-colors hover:text-blue-400"
                  >
                    Liên hệ hỗ trợ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-semibold">Về chúng tôi</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link
                    href="/gioi-thieu"
                    className="transition-colors hover:text-blue-400"
                  >
                    Giới thiệu
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="transition-colors hover:text-blue-400"
                  >
                    Blog BDS
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tuyen-dung"
                    className="transition-colors hover:text-blue-400"
                  >
                    Tuyển dụng
                  </Link>
                </li>
                <li>
                  <Link
                    href="/chinh-sach-bao-mat"
                    className="transition-colors hover:text-blue-400"
                  >
                    Chính sách bảo mật
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-gray-400">
              © 2025 Lào BDS. Bản quyền thuộc về Lào BDS.
              <Link
                href="/dieu-khoan"
                className="ml-2 transition-colors hover:text-blue-400"
              >
                Điều khoản sử dụng
              </Link>
            </p>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/chinh-sach-bao-mat"
                className="text-gray-400 transition-colors hover:text-blue-400"
              >
                Chính sách bảo mật
              </Link>
              <Link
                href="/dieu-khoan"
                className="text-gray-400 transition-colors hover:text-blue-400"
              >
                Điều khoản sử dụng
              </Link>
              <Link
                href="/sitemap"
                className="text-gray-400 transition-colors hover:text-blue-400"
              >
                Sơ đồ trang web
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
