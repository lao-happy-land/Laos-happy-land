"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Tabs, Spin, App, Pagination } from "antd";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Star,
  Calendar,
  Award,
  MessageCircle,
  Share2,
  Heart,
} from "lucide-react";
import Image from "next/image";
import type { Property, User, UserFeedback } from "@/@types/types";
import { userService } from "@/share/service/user.service";
import propertyService from "@/share/service/property.service";
import { userFeedbackService } from "@/share/service/user-feedback.service";
import FeedbackInput from "./broker-feedback-form";

const { TabPane } = Tabs;



type BrokerDetailProps = {
  brokerId: string;
};

export default function BrokerDetail({ brokerId }: BrokerDetailProps) {
  const router = useRouter();
  const { message } = App.useApp();
  const [broker, setBroker] = useState<User | null>(null);
  const [reviews, setReviews] = useState<UserFeedback[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [propertiesPagination, setPropertiesPagination] = useState({
    current: 1,
    pageSize: 6,
    total: 0,
  });
  const [reviewsPagination, setReviewsPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Fetch broker data
  const fetchBrokerData = async () => {
    try {
      setLoading(true);
      const response = await userService.getUserById(brokerId);
      setBroker(response.user);
    } catch (error) {
      console.error("Error fetching broker:", error);
      message.error("Không thể tải thông tin môi giới");
    } finally {
      setLoading(false);
    }
  };

  // Fetch properties data
  const fetchProperties = async (page = 1) => {
    try {
      setPropertiesLoading(true);
      const response = await propertyService.getPropertiesByUser({
        page,
        perPage: propertiesPagination.pageSize,
      });
      setProperties(response.data);
      setPropertiesPagination(prev => ({
        ...prev,
        current: page,
        total: response.meta.itemCount,
      }));
    } catch (error) {
      console.error("Error fetching properties:", error);
      message.error("Không thể tải danh sách bất động sản");
    } finally {
      setPropertiesLoading(false);
    }
  };

  // Fetch reviews data
  const fetchReviews = async (page = 1) => {
    try {
      setReviewsLoading(true);
      const response = await userFeedbackService.getFeedbackByUserId(brokerId, {
        page,
        perPage: reviewsPagination.pageSize,
      });
      setReviews(response.data);
      setReviewsPagination(prev => ({
        ...prev,
        current: page,
        total: response.meta.itemCount,
      }));
    } catch (error) {
      console.error("Error fetching reviews:", error);
      message.error("Không thể tải danh sách đánh giá");
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    void fetchBrokerData();
    void fetchProperties(1);
    void fetchReviews(1);
  }, [brokerId, fetchBrokerData, fetchProperties, fetchReviews]);

  const handleContactSubmit = () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      message.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    message.success("Tin nhắn đã được gửi thành công!");
    setContactForm({ name: "", email: "", phone: "", message: "" });
  };

  const handlePropertiesPageChange = (page: number) => {
    void fetchProperties(page);
  };

  const handleReviewsPageChange = (page: number) => {
    void fetchReviews(page);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "LAK",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!broker) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Không tìm thấy môi giới
            </h1>
            <Button
              type="primary"
              onClick={() => router.push("/brokers")}
              className="mt-4"
            >
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Back Button */}
        <Button
          icon={<ArrowLeft />}
          onClick={() => router.push("/brokers")}
          className="mb-6"
        >
          Quay lại danh sách
        </Button>

        {/* Broker Header */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Broker Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Image
                    src={broker.image ?? broker.avatarUrl ?? "/images/admin/avatar.png"}
                    alt={broker.fullName}
                    className="h-24 w-24 rounded-full object-cover"
                    width={96}
                    height={96}
                  />
                  {broker.role?.name === "broker" && (
                    <div className="bg-primary-500 absolute -right-1 -bottom-1 rounded-full p-1">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="mb-2 text-3xl font-bold text-neutral-900">
                    {broker.fullName}
                  </h1>
                  <p className="mb-2 text-lg text-neutral-600">
                    {broker.role?.name === "broker" ? "Môi giới bất động sản" : broker.role?.name}
                  </p>
                  <div className="mb-4 flex items-center gap-1 text-neutral-500">
                    <MapPin className="h-4 w-4" />
                    {broker.location ?? "Chưa cập nhật"}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-lg font-semibold text-neutral-900">
                        {broker.ratingAverage ?? 0}
                      </span>
                      <span className="text-neutral-500">
                        ({broker.ratingCount ?? 0} đánh giá)
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        icon={<Heart />}
                        size="small"
                        onClick={() =>
                          message.success("Đã thêm vào danh sách yêu thích")
                        }
                      >
                        Yêu thích
                      </Button>
                      <Button
                        icon={<Share2 />}
                        size="small"
                        onClick={() =>
                          message.success("Đã chia sẻ thông tin môi giới")
                        }
                      >
                        Chia sẻ
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="lg:col-span-1">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-neutral-900">
                  Liên hệ ngay
                </h3>
                <div className="space-y-3">
                  <Button
                    icon={<Phone />}
                    className="w-full justify-start"
                    size="large"
                    onClick={() => message.success("Đã gửi yêu cầu gọi điện")}
                  >
                    {broker.phone}
                  </Button>
                  <Button
                    icon={<Mail />}
                    className="w-full justify-start"
                    size="large"
                    onClick={() => message.success("Đã gửi yêu cầu email")}
                  >
                    Gửi email
                  </Button>
                  <Button
                    icon={<MessageCircle />}
                    type="primary"
                    className="w-full"
                    size="large"
                    onClick={() => message.success("Đã gửi tin nhắn")}
                  >
                    Nhắn tin
                  </Button>
                </div>
                <div className="mt-4 space-y-2 text-sm text-neutral-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Thứ 2 - Thứ 6: 8:00 - 18:00
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Phản hồi: Trong vòng 2 giờ
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <Tabs defaultActiveKey="about" size="large">
            <TabPane tab="Giới thiệu" key="about">
              <div className="space-y-6">
                {/* Bio */}
                <div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-900">
                    Giới thiệu
                  </h3>
                  <p className="leading-relaxed text-gray-700">
                    {broker.role?.name === "broker" 
                      ? "Môi giới bất động sản chuyên nghiệp với nhiều năm kinh nghiệm trong lĩnh vực bất động sản."
                      : "Thông tin người dùng"}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {broker.experienceYears ?? 0}
                    </div>
                    <div className="text-sm text-gray-600">Năm kinh nghiệm</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {broker.propertyCount ?? 0}
                    </div>
                    <div className="text-sm text-gray-600">Bất động sản</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {broker.ratingAverage ?? 0}
                    </div>
                    <div className="text-sm text-gray-600">Đánh giá</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {broker.ratingCount ?? 0}
                    </div>
                    <div className="text-sm text-gray-600">Đánh giá</div>
                  </div>
                </div>

                {/* Specialties */}
                {broker.specialties && broker.specialties.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-gray-900">
                      Chuyên môn
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {broker.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {broker.languages && broker.languages.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-gray-900">
                      Ngôn ngữ
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {broker.languages.map((language) => (
                        <span
                          key={language}
                          className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {broker.certifications && broker.certifications.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-gray-900">
                      Chứng chỉ
                    </h3>
                    <ul className="space-y-2">
                      {broker.certifications.map((cert, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-gray-700"
                        >
                          <Award className="h-4 w-4 text-yellow-500" />
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabPane>

            <TabPane tab="Bất động sản" key="properties">
              <Spin spinning={propertiesLoading}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {properties.map((property) => (
                    <div
                      key={property.id}
                      className="cursor-pointer rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl"
                      onClick={() => router.push(`/property/${property.id}`)}
                    >
                      <div className="relative h-48 w-full">
                        <Image
                          src={
                            property.mainImage ??
                            property.images?.[0] ??
                            "/images/landingpage/apartment/apart-1.jpg"
                          }
                          alt={property.title}
                          className="rounded-lg object-cover"
                          fill
                        />
                        <div className="absolute top-2 left-2 rounded-full bg-blue-600 px-2 py-1 text-xs text-white">
                          {property.type?.name}
                        </div>
                      </div>
                      <div className="mt-4">
                        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">
                          {property.title}
                        </h3>
                        <div className="mb-2 flex items-center gap-1 text-gray-500">
                          <MapPin className="h-4 w-4" />
                          {property?.location?.address ?? "Chưa cập nhật"}
                        </div>
                        <div className="mb-3 text-xl font-bold text-blue-600">
                          {property.price
                            ? formatPrice(Number(property.price))
                            : "Liên hệ"}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{property.details?.area} m²</span>
                          {property.details?.bedrooms && (
                            <span>{property.details?.bedrooms} PN</span>
                          )}
                          {property.details?.bathrooms && (
                            <span>{property.details?.bathrooms} WC</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {properties.length > 0 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination
                      current={propertiesPagination.current}
                      total={propertiesPagination.total}
                      pageSize={propertiesPagination.pageSize}
                      onChange={handlePropertiesPageChange}
                      showSizeChanger={false}
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} của ${total} bất động sản`
                      }
                    />
                  </div>
                )}
              </Spin>
            </TabPane>

            <TabPane tab="Đánh giá" key="reviews">
              <div className="space-y-6">
                {/* Feedback Input */}
                <FeedbackInput 
                  brokerId={brokerId}
                  onSuccess={() => {
                    void fetchReviews(reviewsPagination.current);
                  }}
                />

                {/* Review Summary */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">
                      {broker.ratingAverage ?? 0}
                    </div>
                    <div className="mb-2 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= (broker.ratingAverage ?? 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-gray-600">
                      Dựa trên {broker.ratingCount ?? 0} đánh giá
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {star} sao
                        </span>
                        <div className="h-2 flex-1 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-yellow-400"
                            style={{ width: `${Math.random() * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {/* TODO */}
                          {Math.floor(Math.random() * 50)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews List */}
                <Spin spinning={reviewsLoading}>
                  <div className="space-y-4">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div
                          key={review.id}
                          className="rounded-2xl border border-gray-100 bg-gray-50 p-6"
                        >
                          <div className="flex items-start gap-4">
                            <Image
                              src={review.reviewer?.avatarUrl ?? review.reviewer?.image ?? "/images/admin/avatar.png"}
                              alt={review.reviewer?.fullName ?? "Anonymous"}
                              className="h-10 w-10 rounded-full object-cover"
                              width={40}
                              height={40}
                            />
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-2">
                                <h4 className="font-semibold text-gray-900">
                                  {review.reviewer?.fullName ?? "Anonymous"}
                                </h4>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                  {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                              </div>
                              {review.comment && (
                                <p className="mb-2 text-gray-700">{review.comment}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Chưa có đánh giá nào
                      </div>
                    )}
                  </div>
                  
                  {/* Reviews Pagination */}
                  {reviews.length > 0 && reviewsPagination.total > reviewsPagination.pageSize && (
                    <div className="mt-6 flex justify-center">
                      <Pagination
                        current={reviewsPagination.current}
                        total={reviewsPagination.total}
                        pageSize={reviewsPagination.pageSize}
                        onChange={handleReviewsPageChange}
                        showSizeChanger={false}
                        showTotal={(total, range) =>
                          `${range[0]}-${range[1]} của ${total} đánh giá`
                        }
                      />
                    </div>
                  )}
                </Spin>
              </div>
            </TabPane>

            {/* No longer needed */}
            {/* <TabPane tab="Liên hệ" key="contact">
              <div className="max-w-2xl">
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  Gửi tin nhắn cho {broker.name}
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input
                      placeholder="Họ và tên *"
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, name: e.target.value })
                      }
                      size="large"
                    />
                    <Input
                      placeholder="Email *"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          email: e.target.value,
                        })
                      }
                      size="large"
                    />
                  </div>
                  <Input
                    placeholder="Số điện thoại"
                    value={contactForm.phone}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, phone: e.target.value })
                    }
                    size="large"
                  />
                  <TextArea
                    placeholder="Tin nhắn của bạn *"
                    rows={6}
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                  />
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleContactSubmit}
                    className="w-full"
                  >
                    Gửi tin nhắn
                  </Button>
                </div>
              </div>
            </TabPane> */}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
