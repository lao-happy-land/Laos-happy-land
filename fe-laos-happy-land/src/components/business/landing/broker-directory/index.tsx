"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUrlLocale } from "@/utils/locale";
import { useTranslations } from "next-intl";
import { Input, Select, Button, Pagination, Spin, App } from "antd";
import { Search, MapPin, Star, Filter } from "lucide-react";
import Image from "next/image";

const { Search: SearchInput } = Input;
const { Option } = Select;

interface Broker {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  company?: string;
  location?: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  experience: number;
  propertiesCount: number;
  verified: boolean;
}

export default function BrokerDirectory() {
  const t = useTranslations();
  const router = useRouter();
  const locale = useUrlLocale();
  const { message } = App.useApp();
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Mock data - replace with actual API call
  const mockBrokers: Broker[] = useMemo(
    () => [
      {
        id: "1",
        name: t("admin.sampleUser1"),
        email: "minh.nguyen@example.com",
        phone: "+856 20 1234 5678",
        avatar: "/images/admin/avatar.png",
        company: "Lao Real Estate Co.",
        location: "Vientiane",
        rating: 4.8,
        reviewCount: 127,
        specialties: [
          t("search.propertyTypes.streetHouse"),
          t("search.propertyTypes.apartment"),
          t("search.propertyTypes.land"),
        ],
        experience: 8,
        propertiesCount: 45,
        verified: true,
      },
      {
        id: "2",
        name: "Somsak Phommachanh",
        email: "somsak@example.com",
        phone: "+856 20 2345 6789",
        avatar: "/images/admin/avatar.png",
        company: "Vientiane Properties",
        location: "Vientiane",
        rating: 4.6,
        reviewCount: 89,
        specialties: [
          t("search.propertyTypes.villa"),
          t("search.propertyTypes.streetHouse"),
        ],
        experience: 6,
        propertiesCount: 32,
        verified: true,
      },
      {
        id: "3",
        name: "Khamla Vongsa",
        email: "khamla@example.com",
        phone: "+856 20 3456 7890",
        avatar: "/images/admin/avatar.png",
        company: "Luang Prabang Realty",
        location: "Luang Prabang",
        rating: 4.9,
        reviewCount: 156,
        specialties: [
          t("search.propertyTypes.apartment"),
          t("search.propertyTypes.land"),
          t("search.propertyTypes.streetHouse"),
        ],
        experience: 10,
        propertiesCount: 67,
        verified: true,
      },
      {
        id: "4",
        name: "Bounmy Chanthavong",
        email: "bounmy@example.com",
        phone: "+856 20 4567 8901",
        avatar: "/images/admin/avatar.png",
        company: "Pakse Properties",
        location: "Pakse",
        rating: 4.7,
        reviewCount: 73,
        specialties: [
          t("search.propertyTypes.villa"),
          t("search.propertyTypes.land"),
        ],
        experience: 5,
        propertiesCount: 28,
        verified: false,
      },
      {
        id: "5",
        name: "Sengdao Keomany",
        email: "sengdao@example.com",
        phone: "+856 20 5678 9012",
        avatar: "/images/admin/avatar.png",
        company: "Savannakhet Real Estate",
        location: "Savannakhet",
        rating: 4.5,
        reviewCount: 94,
        specialties: [
          t("search.propertyTypes.streetHouse"),
          t("search.propertyTypes.apartment"),
        ],
        experience: 7,
        propertiesCount: 41,
        verified: true,
      },
      {
        id: "6",
        name: "Khamphone Sisouphanh",
        email: "khamphone@example.com",
        phone: "+856 20 6789 0123",
        avatar: "/images/admin/avatar.png",
        company: "Champasak Properties",
        location: "Champasak",
        rating: 4.8,
        reviewCount: 112,
        specialties: [
          t("search.propertyTypes.villa"),
          t("search.propertyTypes.streetHouse"),
          t("search.propertyTypes.land"),
        ],
        experience: 9,
        propertiesCount: 53,
        verified: true,
      },
    ],
    [],
  );

  useEffect(() => {
    // Simulate API call
    const fetchBrokers = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setBrokers(mockBrokers);
      setLoading(false);
    };

    void fetchBrokers();
  }, [mockBrokers]);

  const filteredBrokers = brokers.filter((broker) => {
    const matchesSearch =
      broker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      broker.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      !locationFilter || broker.location === locationFilter;
    const matchesSpecialty =
      !specialtyFilter || broker.specialties.includes(specialtyFilter);

    return matchesSearch && matchesLocation && matchesSpecialty;
  });

  const paginatedBrokers = filteredBrokers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const locations = Array.from(
    new Set(brokers.map((broker) => broker.location).filter(Boolean)),
  );
  const specialties = Array.from(
    new Set(brokers.flatMap((broker) => broker.specialties)),
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-neutral-900">
                Danh sách Môi giới Bất động sản
              </h1>
              <p className="text-lg text-neutral-600">
                Tìm kiếm môi giới chuyên nghiệp và đáng tin cậy
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  {t("broker.searchBrokers")}
                </label>
                <SearchInput
                  placeholder={t("broker.searchPlaceholder")}
                  size="large"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  prefix={<Search className="h-4 w-4 text-neutral-400" />}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  {t("search.location")}
                </label>
                <Select
                  placeholder={t("broker.selectLocation")}
                  size="large"
                  value={locationFilter}
                  onChange={setLocationFilter}
                  allowClear
                  className="w-full"
                >
                  {locations.map((location) => (
                    <Option key={location} value={location}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        {location}
                      </div>
                    </Option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  {t("broker.specialty")}
                </label>
                <Select
                  placeholder={t("broker.selectSpecialty")}
                  size="large"
                  value={specialtyFilter}
                  onChange={setSpecialtyFilter}
                  allowClear
                  className="w-full"
                >
                  {specialties.map((specialty) => (
                    <Option key={specialty} value={specialty}>
                      {specialty}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-neutral-600">
            {t("broker.foundResults", { count: filteredBrokers.length })}
          </p>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-neutral-400" />
            <span className="text-sm text-neutral-500">
              {t("broker.sortByRating")}
            </span>
          </div>
        </div>

        {/* Brokers Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedBrokers.map((broker) => (
              <div
                key={broker.id}
                className="group cursor-pointer rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
                onClick={() => router.push(`/${locale}/brokers/${broker.id}`)}
              >
                <div className="p-6 text-center">
                  {/* Avatar */}
                  <div className="relative mx-auto mb-4 h-20 w-20">
                    <Image
                      src={broker.avatar ?? "/images/admin/avatar.png"}
                      alt={broker.name}
                      className="rounded-full object-cover"
                      width={80}
                      height={80}
                    />
                    {broker.verified && (
                      <div className="bg-primary-500 absolute -right-1 -bottom-1 rounded-full p-1">
                        <svg
                          className="h-3 w-3 text-white"
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

                  {/* Name and Company */}
                  <h3 className="mb-1 text-lg font-semibold text-neutral-900">
                    {broker.name}
                  </h3>
                  <p className="mb-2 text-sm text-neutral-600">
                    {broker.company}
                  </p>

                  {/* Location */}
                  <div className="mb-3 flex items-center justify-center gap-1 text-sm text-neutral-500">
                    <MapPin className="h-4 w-4" />
                    {broker.location}
                  </div>

                  {/* Rating */}
                  <div className="mb-3 flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-neutral-900">
                      {broker.rating}
                    </span>
                    <span className="text-sm text-neutral-500">
                      ({broker.reviewCount} {t("broker.reviews")})
                    </span>
                  </div>

                  {/* Specialties */}
                  <div className="mb-4 flex flex-wrap justify-center gap-1">
                    {broker.specialties.slice(0, 2).map((specialty) => (
                      <span
                        key={specialty}
                        className="bg-primary-100 text-primary-700 rounded-full px-2 py-1 text-xs"
                      >
                        {specialty}
                      </span>
                    ))}
                    {broker.specialties.length > 2 && (
                      <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600">
                        +{broker.specialties.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="mb-4 grid grid-cols-2 gap-2 text-xs text-neutral-600">
                    <div>
                      <span className="font-medium">{broker.experience}</span>{" "}
                      {t("broker.yearsExperience")}
                    </div>
                    <div>
                      <span className="font-medium">
                        {broker.propertiesCount}
                      </span>{" "}
                      {t("broker.properties")}
                    </div>
                  </div>

                  {/* Contact Button */}
                  <Button
                    type="primary"
                    size="small"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      message.success(
                        t("broker.contactRequestSent", { name: broker.name }),
                      );
                    }}
                  >
                    {t("broker.contact")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredBrokers.length > pageSize && (
          <div className="mt-8 flex justify-center">
            <Pagination
              current={currentPage}
              total={filteredBrokers.length}
              pageSize={pageSize}
              onChange={setCurrentPage}
              showSizeChanger={false}
              showQuickJumper
            />
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredBrokers.length === 0 && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
              <Search className="h-8 w-8 text-neutral-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-neutral-900">
              {t("broker.noBrokersFound")}
            </h3>
            <p className="text-neutral-600">{t("broker.tryDifferentSearch")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
