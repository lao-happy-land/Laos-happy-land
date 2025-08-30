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
};

export type Property = {
  id: string;
  title: string;
  description: string;
  price: string;
  priceHistory: {
    date: string;
    price: string | number;
  }[];
  status: "pending" | "approved" | "rejected";
  details: {
    area: number;
    bedrooms: number;
    bathrooms: number;
  } | null;
  viewsCount: number;
  legalStatus: string | null;
  location: string | null;
  priority: number;
  transactionType: "rent" | "sale";
  images: string[] | null;
  mainImage: string | null;
  owner: User | null;
  type?: {
    id: string;
    name: string;
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
