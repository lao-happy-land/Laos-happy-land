export type APIResponse<T> = {
  data: T;
  meta: {
    page: number;
    limit: number;
    total: number;
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
};

export type Property = {
  id: string;
  title: string;
  description: string;
  price: string;
  priceHistory: {
    date: string;
    price: string;
  }[];
  isVerified: boolean;
  details: {
    area: number;
    bedrooms: number;
    bathrooms: number;
  };
  viewsCount: number;
  legalStatus: string;
  location: string;
  priority: number;
  transactionType: "rent" | "sale";
  images: string[];
  mainImage: string;
  owner: string;
  type: {
    id: string;
    name: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    deletedAt: string;
    deletedBy: string;
  };
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt: string;
  deletedBy: string;
};
