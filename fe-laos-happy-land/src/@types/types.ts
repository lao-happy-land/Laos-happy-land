export type APIResponse<T> = {
  data: T;
  meta: {
    page: number;
    itemCount: number;
    pageCount: number;
    take: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
};

export type UserRole = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  avatarUrl?: string | null;
  location?: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
  image: string | null;
  fromBank: string | null;
  password: string;
  
  // Broker-specific fields
  propertyCount?: number;
  experienceYears?: number;
  ratingAverage?: number;
  ratingCount?: number;
  specialties?: string[];
  languages?: string[];
  certifications?: string[];
  locationInfo?: LocationInfo | null;
};

export type Content =
  | { type: "heading"; text: string; level?: 1 | 2 | 3 }
  | { type: "paragraph"; text: string }
  | { type: "image"; url: string; caption?: string };

export type LocationDto = {
  latitude: number;
  longitude: number;
  address: string;
  city?: string;
  country?: string;
  buildingNumber?: string;
  street?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  neighborhood?: string;
};

export type LocationInfo = {
  id: string;
  name: string;
  imageURL?: string;
  viewCount?: number;
  strict?: string[];
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
};

export type PropertyPrice = {
  LAK: string;
  USD: string;
  VND: string;
};

export type PropertyPriceHistory = {
  date: string;
  rates: string;
};

export type Property = {
  id: string;
  title: string;
  description: string;
  price: string | PropertyPrice;
  priceHistory: PropertyPriceHistory[];
  status: "pending" | "approved" | "rejected";
  reason?: string | null;
  details: {
    area: number;
    bedrooms: number;
    bathrooms: number;
    // amenities
    wifi?: boolean;
    tv?: boolean;
    airConditioner?: boolean;
    parking?: boolean;
    kitchen?: boolean;
    security?: boolean;
    // project content (used when transactionType = "project")
    content?: Content[];
  } | null;
  viewsCount: number;
  legalStatus: string | null;
  location: LocationDto | null;
  locationInfo?: LocationInfo | null;
  priority: number;
  transactionType: "rent" | "sale" | "project";
  images: string[] | null;
  mainImage: string | null;
  owner: User | null;
  type?: {
    id: string;
    name: string;
    transactionType: "rent" | "sale" | "project";
    createdAt: string;
    createdBy: string | null;
    updatedAt: string;
    updatedBy: string | null;
    deletedAt: string | null;
    deletedBy: string | null;
  } | null;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
};

export type PropertyType = {
  id: string;
  name: string;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
  transactionType: "rent" | "sale" | "project";
};

export type UploadImageResult = {
  url: string;
  message: string;
};

export interface NewsType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string;
  deletedBy?: string;
}

export interface News {
  id: string;
  title: string;
  description?: string;
  details?: Content[];
  viewsCount?: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string;
  deletedBy?: string;
  newsType?: NewsType;
  newsTypeId?: string;
  type?: NewsType;
}

export interface NewsResponse {
  data: News[];
  total: number;
  page: number;
  perPage: number;
}

export interface NewsType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string;
  deletedBy?: string;
}

export interface NewsTypeResponse {
  data: NewsType[];
  total: number;
  page: number;
  perPage: number;
}
