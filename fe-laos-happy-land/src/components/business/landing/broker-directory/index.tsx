"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRequest } from "ahooks";
import { Input, Pagination, Spin, App } from "antd";
import { Search, MapPin, Star, Filter } from "lucide-react";
import Image from "next/image";
import { userService } from "@/share/service/user.service";
import type { User } from "@/@types/types";
import { useTranslations } from "next-intl";
import { useUrlLocale } from "@/utils/locale";

const { Search: SearchInput } = Input;

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
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // TODO: no longer needed?
  // const [locationFilter, setLocationFilter] = useState("");
  // const [specialtyFilter, setSpecialtyFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Fetch brokers from API
  const {
    data: brokersData = { data: [], meta: { itemCount: 0, pageCount: 0 } },
    loading: brokersLoading,
  } = useRequest(
    async () => {
      const response = await userService.getAllUsers({
        search: searchTerm ?? undefined,
        role: "Broker", // Filter only brokers
        page: currentPage,
        perPage: pageSize,
      });
      return response as unknown as {
        data: User[];
        meta: {
          itemCount: number;
          pageCount: number;
          hasPreviousPage: boolean;
          hasNextPage: boolean;
        };
      };
    },
    {
      refreshDeps: [searchTerm, currentPage, pageSize],
      onSuccess: (data) => {
        setTotal(data.meta.itemCount ?? 0);
      },
      onError: (error) => {
        console.error("Error loading brokers:", error);
        message.error(t("errors.cannotLoadBrokers"));
      },
    },
  );

  const brokers = brokersData.data || [];

  // Search functionality
  const handleSearch = () => {
    setSearchTerm(searchInputValue);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchInputValue(value);
  };

  // Pagination functionality
  const handlePaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // Transform User data to Broker format for display
  const transformedBrokers: Broker[] = brokers.map((user) => ({
    id: user.id,
    name: user.fullName,
    email: user.email,
    phone: user.phone,
    avatar: user.avatarUrl ?? user.image ?? "/images/admin/avatar.png",
    // TODO: Add company field to User API model
    company: "Real Estate Company", // Default value since User doesn't have company
    location: user.locationInfo?.name ?? user.location ?? "",
    rating: user.ratingAverage ?? 0,
    reviewCount: user.ratingCount ?? 0,
    specialties: user.specialties ?? [
      t("broker.townhouse"),
      t("broker.apartment"),
      t("broker.land"),
    ],
    experience: user.experienceYears ?? 0,
    propertiesCount: user.propertyCount ?? 0,
    // TODO: Add verified field to User API model
    verified: true, // Default verified status
  }));

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-neutral-900">
                {t("broker.brokerDirectory")}
              </h1>
              <p className="text-lg text-neutral-600">
                {t("broker.findProfessionalBrokers")}
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
                  value={searchInputValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onSearch={handleSearch}
                  prefix={<Search className="h-4 w-4 text-neutral-400" />}
                />
              </div>
              {/* TODO: Add filters when */}
              {/* <div>
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
              </div> */}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-neutral-600">
            {t("broker.foundResults", { count: total })}
          </p>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-neutral-400" />
            <span className="text-sm text-neutral-500">
              {t("broker.sortByRating")}
            </span>
          </div>
        </div>

        {/* Brokers Grid */}
        {brokersLoading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {transformedBrokers.map((broker) => (
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
                    {broker.company ?? t("common.notUpdated")}
                  </p>

                  {/* Location */}
                  <div className="mb-3 flex items-center justify-center gap-1 text-sm text-neutral-500">
                    <MapPin className="h-4 w-4" />
                    {broker.location ?? t("common.notUpdated")}
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

                  {/* TODO: Contact Button */}
                  {/* <Button
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
                    Liên hệ
                  </Button> */}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > pageSize && (
          <Pagination
            align="center"
            current={currentPage}
            total={total}
            pageSize={pageSize}
            onChange={handlePaginationChange}
            showSizeChanger={false}
          />
        )}

        {/* Empty State */}
        {!brokersLoading && transformedBrokers.length === 0 && (
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
