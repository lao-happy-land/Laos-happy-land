/* eslint-disable */
/*
 * ----------------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API-ES            ##
 * ## SOURCE: https://github.com/hunghg255/swagger-typescript-api-es   ##
 * ----------------------------------------------------------------------
 */

export interface CreateUserDto {
  /**
   * Full name of the user
   * @example "Nguyen Van A"
   */
  fullName: string;
  /**
   * Email of the user
   * @example "nguyenvana@example.com"
   */
  email: string;
  /**
   * Phone number of the user
   * @example "0123456789"
   */
  phone: string;
  /**
   * Password of the user
   * @example "password123"
   */
  password: string;
  /**
   * Role ID of the user
   * @example "f2f6f4f0-6b6b-4b8c-9b87-5f6a6c6a6c6a"
   */
  roleId: string;
  /**
   * Avatar of the user
   * @format binary
   */
  image?: File;
}

export interface UpdateUserDto {
  /**
   * Full name of the user
   * @example "Nguyen Van A"
   */
  fullName?: string;
  /**
   * Email of the user
   * @example "nguyenvana@example.com"
   */
  email?: string;
  /**
   * Phone number of the user
   * @example "0123456789"
   */
  phone?: string;
  /**
   * Password of the user
   * @example "password123"
   */
  password?: string;
  /**
   * Role ID of the user
   * @example "f2f6f4f0-6b6b-4b8c-9b87-5f6a6c6a6c6a"
   */
  roleId?: string;
  /**
   * Avatar of the user
   * @format binary
   */
  image?: File;
}

export interface RegisterDto {
  /**
   * User email address
   * @example "john@example.com"
   */
  email: string;
  /**
   * Full name of the user
   * @example "John Doe"
   */
  fullName: string;
  /**
   * Password with minimum 6 characters
   * @example "strongpassword123"
   */
  password: string;
  /**
   * Phone number of the user
   * @example "0123456789"
   */
  phone: string;
}

export interface LoginDto {
  /**
   * Registered email address
   * @example "john@example.com"
   */
  email: string;
  /**
   * Password of the user
   * @example "strongpassword123"
   */
  password: string;
}

export interface CreatePropertyDto {
  /**
   * ID loại bất động sản (PropertyType)
   * @example "f2f6f4f0-6b6b-4b8c-9b87-5f6a6c6a6c6a"
   */
  typeId: string;
  /**
   * User ID associated with the order
   * @example "6933c706-3180-47a0-b56b-c98180d8afda"
   */
  user_id: string;
  /**
   * Tiêu đề tin rao
   * @example "Căn hộ cao cấp 2PN tại Quận 1, view sông tuyệt đẹp"
   */
  title: string;
  /**
   * Mô tả chi tiết bất động sản
   * @example "Căn hộ mới, nội thất đầy đủ, gần trung tâm thương mại, trường học..."
   */
  description?: string;
  /**
   * Giá bán/cho thuê
   * @example 2500000000
   */
  price?: number;
  /**
   * Chi tiết bổ sung (JSON)
   * @example {"area":75,"bedrooms":3,"bathrooms":2}
   */
  details?: object;
  /**
   * Trạng thái xác minh
   * @example true
   */
  isVerified?: boolean;
  /**
   * Tình trạng pháp lý
   * @example "Sổ hồng đầy đủ"
   */
  legalStatus?: string;
  /**
   * Vị trí bất động sản
   * @example "123 Nguyễn Huệ, Quận 1, TP.HCM"
   */
  location?: string;
  /**
   * Hình thức giao dịch
   * @example "sale"
   */
  transactionType: "rent" | "sale";
  /**
   * Ảnh chính của bất động sản
   * @format binary
   */
  mainImage?: File;
  /** Danh sách ảnh phụ của bất động sản */
  images?: File[];
}

export interface UpdatePropertyDto {
  /**
   * ID loại bất động sản (PropertyType)
   * @example "f2f6f4f0-6b6b-4b8c-9b87-5f6a6c6a6c6a"
   */
  typeId?: string;
  /**
   * Tiêu đề tin rao
   * @example "Căn hộ cao cấp 2PN tại Quận 1, view sông tuyệt đẹp"
   */
  title?: string;
  /**
   * Mô tả chi tiết bất động sản
   * @example "Căn hộ mới, nội thất đầy đủ..."
   */
  description?: string;
  /**
   * Giá bán/cho thuê
   * @example 2500000000
   */
  price?: number;
  /**
   * Chi tiết bổ sung (JSON)
   * @example {"area":75,"bedrooms":3,"bathrooms":2}
   */
  details?: object;
  /**
   * Trạng thái xác minh
   * @example true
   */
  isVerified?: boolean;
  /**
   * Tình trạng pháp lý
   * @example "Sổ hồng đầy đủ"
   */
  legalStatus?: string;
  /**
   * Vị trí bất động sản
   * @example "123 Nguyễn Huệ, Quận 1, TP.HCM"
   */
  location?: string;
  /**
   * Hình thức giao dịch
   * @example "sale"
   */
  transactionType?: "rent" | "sale";
  /**
   * Ảnh chính của bất động sản
   * @format binary
   */
  mainImage?: File;
  /** Danh sách ảnh phụ của bất động sản */
  images?: File[];
}

export interface CreatePropertyTypeDto {
  /**
   * Name of the property type
   * @example "Apartment"
   */
  name: string;
}

export interface CreateUserRoleDto {
  /**
   * Role name
   * @example "User"
   */
  name: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;

  instance?: AxiosInstance;
  injectHeaders?: (data: any) => any;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;
  private injectHeaders?: (data: any) => any;

  constructor({
    securityWorker,
    secure,
    format,
    instance,
    injectHeaders,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance =
      instance ??
      axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
    this.injectHeaders = injectHeaders;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T, _E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    let headers = {
      ...(requestParams.headers || {}),
      ...(type && type !== ContentType.FormData
        ? { "Content-Type": type }
        : {}),
    };

    if (this.injectHeaders) {
      headers = await this.injectHeaders(headers);
    }

    return this.instance.request({
      ...requestParams,
      headers,
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title API Documentation
 * @version 1.0
 * @contact
 *
 * API cho website bất động sản
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags User
     * @name UserControllerCreate
     * @request POST:/api/user
     */
    userControllerCreate: (data: CreateUserDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/user`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserControllerGetAll
     * @request GET:/api/user
     */
    userControllerGetAll: (
      query?: {
        /** Full name of the user */
        fullName?: string;
        /** Email of the user */
        email?: string;
        /** Phone number of the user */
        phone?: string;
        /** Role of the user */
        role?: string;
        /** Avatar url of the user */
        avatarUrl?: string;
        take?: number;
        skip?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/user`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserControllerGetBankRequests
     * @request GET:/api/user/bank-requests
     */
    userControllerGetBankRequests: (
      query?: {
        /** Full name of the user */
        fullName?: string;
        /** Email of the user */
        email?: string;
        /** Phone number of the user */
        phone?: string;
        /** Role of the user */
        role?: string;
        /** Avatar url of the user */
        avatarUrl?: string;
        take?: number;
        skip?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/user/bank-requests`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserControllerGet
     * @request GET:/api/user/{id}
     */
    userControllerGet: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/user/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserControllerUpdate
     * @request PATCH:/api/user/{id}
     */
    userControllerUpdate: (
      id: string,
      data: FormData,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/user/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserControllerRemove
     * @request DELETE:/api/user/{id}
     */
    userControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/user/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserControllerRequestIsFromBank
     * @request PATCH:/api/user/{id}/request
     */
    userControllerRequestIsFromBank: (
      id: string,
      data: {
        note?: string | null;
        /** @format binary */
        image?: File | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/user/${id}/request`,
        method: "PATCH",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserControllerApproveIsFromBank
     * @request PATCH:/api/user/{id}/approve
     */
    userControllerApproveIsFromBank: (
      id: string,
      data: {
        approve?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/user/${id}/approve`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerRegister
     * @summary Register a new user
     * @request POST:/api/auth/register
     */
    authControllerRegister: (data: RegisterDto, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/auth/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerLogin
     * @summary Login an existing user
     * @request POST:/api/auth/login
     */
    authControllerLogin: (data: LoginDto, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerHandleGoogleLogin
     * @summary Login via Google
     * @request GET:/api/auth/google/login
     */
    authControllerHandleGoogleLogin: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/google/login`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerGoogleAuthRedirect
     * @summary Google OAuth callback
     * @request GET:/api/auth/google/redirect
     */
    authControllerGoogleAuthRedirect: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/google/redirect`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Property
     * @name PropertyControllerCreate
     * @request POST:/api/property
     */
    propertyControllerCreate: (
      data: CreatePropertyDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/property`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Property
     * @name PropertyControllerGetAll
     * @request GET:/api/property
     */
    propertyControllerGetAll: (
      query?: {
        /** Loại bất động sản */
        type?: string;
        /** Từ khóa tìm kiếm tiêu đề/mô tả */
        keyword?: string;
        /** Giá tối thiểu */
        minPrice?: number;
        /** Giá tối đa */
        maxPrice?: number;
        /** Diện tích tối thiểu (m²) */
        minArea?: number;
        /** Diện tích tối đa (m²) */
        maxArea?: number;
        /** Số phòng ngủ */
        bedrooms?: number;
        /** Số phòng tắm */
        bathrooms?: number;
        /** Vị trí */
        location?: string;
        /** Trạng thái bán/cho thuê */
        transaction?: "rent" | "sale";
        /** Trạng thái xác minh */
        isVerified?: boolean;
        take?: number;
        skip?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/property`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Property
     * @name PropertyControllerGet
     * @request GET:/api/property/{id}
     */
    propertyControllerGet: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/property/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Property
     * @name PropertyControllerUpdate
     * @request PATCH:/api/property/{id}
     */
    propertyControllerUpdate: (
      id: string,
      data: UpdatePropertyDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/property/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Property
     * @name PropertyControllerRemove
     * @request DELETE:/api/property/{id}
     */
    propertyControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/property/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags PropertyType
     * @name PropertyTypeControllerCreate
     * @summary Create a new property type
     * @request POST:/api/property-type
     */
    propertyTypeControllerCreate: (
      data: CreatePropertyTypeDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/property-type`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags PropertyType
     * @name PropertyTypeControllerGetAll
     * @summary Get all property types with pagination
     * @request GET:/api/property-type
     */
    propertyTypeControllerGetAll: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/property-type`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags PropertyType
     * @name PropertyTypeControllerGet
     * @summary Get a property type by ID
     * @request GET:/api/property-type/{id}
     */
    propertyTypeControllerGet: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/property-type/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags PropertyType
     * @name PropertyTypeControllerUpdate
     * @summary Update a property type by ID
     * @request PATCH:/api/property-type/{id}
     */
    propertyTypeControllerUpdate: (
      id: string,
      data: CreatePropertyTypeDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/property-type/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags PropertyType
     * @name PropertyTypeControllerRemove
     * @summary Delete a property type by ID
     * @request DELETE:/api/property-type/{id}
     */
    propertyTypeControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/property-type/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UserRole
     * @name UserRoleControllerCreate
     * @summary Create user role
     * @request POST:/api/user-role
     */
    userRoleControllerCreate: (
      data: CreateUserRoleDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/user-role`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags UserRole
     * @name UserRoleControllerGetAll
     * @summary Get all user roles
     * @request GET:/api/user-role
     */
    userRoleControllerGetAll: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/user-role`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UserRole
     * @name UserRoleControllerGet
     * @summary Get user role by id
     * @request GET:/api/user-role/{id}
     */
    userRoleControllerGet: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/user-role/${id}`,
        method: "GET",
        ...params,
      }),
  };
}
