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
   * Location Info ID of the user
   * @example "f2f6f4f0-6b6b-4b8c-9b87-5f6a6c6a6c6a"
   */
  locationInfoId?: string;
  /**
   * Avatar of the user
   * @format binary
   */
  image?: File;
  /**
   * Years of experience (default 0)
   * @example 2
   */
  experienceYears?: number;
  /**
   * Specialties of the user
   * @example ["Apartment","Land"]
   */
  specialties?: string[];
  /**
   * Languages the user can speak
   * @example ["Vietnamese","English"]
   */
  languages?: string[];
  /**
   * Certifications of the user
   * @example ["Broker License","Real Estate Certificate"]
   */
  certifications?: string[];
  /**
   * Company name of the user
   * @example "ABC Real Estate"
   */
  company?: string;
}

export interface UpdateUserDto {
  /**
   * Full name of the user
   * @example "Nguyen Van A"
   */
  fullName?: string;
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
   * Location Info ID of the user
   * @example "f2f6f4f0-6b6b-4b8c-9b87-5f6a6c6a6c6a"
   */
  locationInfoId?: string;
  /**
   * Avatar of the user
   * @format binary
   */
  image?: File;
  /**
   * Years of experience (default 0)
   * @example 2
   */
  experienceYears?: number;
  /**
   * Specialties of the user
   * @example ["Apartment","Land"]
   */
  specialties?: string[];
  /**
   * Languages the user can speak
   * @example ["Vietnamese","English"]
   */
  languages?: string[];
  /**
   * Certifications of the user
   * @example ["Broker License","Real Estate Certificate"]
   */
  certifications?: string[];
  /**
   * Company name of the user
   * @example "ABC Real Estate"
   */
  company?: string;
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

export interface RefreshTokenDto {
  /** Refresh token JWT */
  refresh_token: string;
}

export interface ResetPasswordDto {
  /** Email of the user */
  email: string;
  /** New password for the user */
  newPassword: string;
}

export interface LocationDto {
  /** @example 21.028511 */
  latitude?: number;
  /** @example 105.804817 */
  longitude?: number;
  /** @example "123 Nguyễn Huệ, Quận 1, TP.HCM" */
  address?: string;
  /** @example "Hà Nội" */
  city?: string;
  /** @example "Vietnam" */
  country?: string;
  /** @example "12A" */
  buildingNumber?: string;
  /** @example "Nguyễn Huệ" */
  street?: string;
  /** @example "Quận 1" */
  district?: string;
  /** @example "TP.HCM" */
  province?: string;
  /** @example "700000" */
  postalCode?: string;
  /** @example "Bến Nghé" */
  neighborhood?: string;
}

export interface CreatePropertyDto {
  /**
   * ID loại bất động sản (PropertyType)
   * @example "f2f6f4f0-6b6b-4b8c-9b87-5f6a6c6a6c6a"
   */
  typeId: string;
  /**
   * ID của LocationInfo
   * @example "d7f6a6a0-1234-5678-9876-abcdefabcdef"
   */
  locationInfoId: string;
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
   * Tình trạng pháp lý
   * @example "Sổ hồng đầy đủ"
   */
  legalStatus?: string;
  /**
   * Độ ưu tiên
   * @example 0
   */
  priority?: number;
  /** Vị trí bất động sản (Mapbox object) */
  location?: LocationDto;
  /**
   * Hình thức giao dịch
   * @example "sale"
   */
  transactionType: "rent" | "sale" | "project";
  /** main image */
  mainImage?: string;
  /** Danh sách hình anh */
  images?: string[];
  /**
   * Nguồn đơn vị tiền tệ cho giá (lấy từ header price-source)
   * @example "USD"
   */
  priceSource?: "USD" | "LAK" | "THB";
}

export interface UpdatePropertyDto {
  /**
   * ID loại bất động sản (PropertyType)
   * @example "f2f6f4f0-6b6b-4b8c-9b87-5f6a6c6a6c6a"
   */
  typeId?: string;
  /**
   * ID của LocationInfo
   * @example "d7f6a6a0-1234-5678-9876-abcdefabcdef"
   */
  locationInfoId?: string;
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
   * Tình trạng pháp lý
   * @example "Sổ hồng đầy đủ"
   */
  legalStatus?: string;
  /**
   * Độ ưu tiên
   * @example 0
   */
  priority?: number;
  /** Vị trí bất động sản (Mapbox object) */
  location?: LocationDto;
  /**
   * Hình thức giao dịch
   * @example "sale"
   */
  transactionType?: "rent" | "sale" | "project";
  /**
   * Ảnh chính của bất động sản
   * @format binary
   */
  mainImage?: File;
  /** Danh sách ảnh phụ của bất động sản */
  images?: File[];
  /**
   * Nguồn đơn vị tiền tệ cho giá (lấy từ header price-source)
   * @example "USD"
   */
  priceSource?: "USD" | "LAK" | "THB";
}

export interface RejectPropertyDto {
  /** Lý do từ chối */
  reason?: string;
}

export interface CreatePropertyTypeDto {
  /**
   * Name of the property type
   * @example "Apartment"
   */
  name: string;
  /**
   * Hình thức giao dịch
   * @example "sale"
   */
  transactionType: "rent" | "sale" | "project";
}

export interface CreateUserRoleDto {
  /**
   * Role name
   * @example "User"
   */
  name: string;
}

export interface CreateSettingDto {
  /** Description setting */
  description?: string;
  /** Hotline setting */
  hotline?: string;
  /** Facebook url */
  facebook?: string;
  /** List images setting */
  images?: string[];
  /** Banner image setting */
  banner?: string;
}

export interface CreateExchangeRateDto {
  /**
   * currency off exchange rate
   * @example "USD"
   */
  currency: string;
  /**
   * rate of exchange rate
   * @example 1
   */
  rate: number;
}

export interface UpdateExchangeRateDto {
  /**
   * rate of exchange rate
   * @example 1
   */
  rate: number;
}

export interface CreateLocationInfoDto {
  /**
   * Tên địa điểm hoặc khu vực
   * @example "Vinhomes Central Park"
   */
  name: string;
  /**
   * Ảnh đại diện của địa điểm (upload file)
   * @format binary
   */
  image?: File;
  /**
   * JSON string mảng các khu vực
   * @example "["District 1","Binh Thanh"]"
   */
  strict?: string[];
}

export interface CreateNewsTypeDto {
  /**
   * Name of the news type
   * @example "Notification"
   */
  name: string;
}

export interface CreateNewsDto {
  /**
   * Tiêu đề của tin tức
   * @example "Chính sách mới về BĐS"
   */
  title: string;
  /**
   * Nội dung chi tiết dạng JSON
   * @example [{"type":"p","value":"Nội dung chi tiết của tin tức..."},{"type":"img","value":"https://example.com/image.jpg"}]
   */
  details?: object;
  /**
   * ID của loại tin tức (NewsType)
   * @example "b12f8b63-4f0a-4c85-9c48-4e9fa0d1a1f1"
   */
  newsTypeId?: string;
}

export interface UpdateNewsDto {
  /**
   * Tiêu đề của tin tức
   * @example "Chính sách mới về BĐS"
   */
  title?: string;
  /**
   * Nội dung chi tiết dạng JSON
   * @example [{"type":"p","value":"Nội dung chi tiết của tin tức..."},{"type":"img","value":"https://example.com/image.jpg"}]
   */
  details?: object;
  /**
   * ID của loại tin tức (NewsType)
   * @example "b12f8b63-4f0a-4c85-9c48-4e9fa0d1a1f1"
   */
  newsTypeId?: string;
}

export interface UpdateAboutUsDto {
  /**
   * Title of the about us page
   * @example "about us"
   */
  title?: string;
  /**
   * Content of the about us page
   * @example {"header":"about us","abc":"abcd"}
   */
  content?: string;
}

export interface CreateUserFeedbackDto {
  /**
   * ID của môi giới (user được đánh giá)
   * @example "a3f6b6de-34c9-4f5d-9a62-4b9e6e9b7d21"
   */
  userId: string;
  /**
   * Điểm đánh giá (1-5)
   * @example 5
   */
  rating: number;
  /**
   * Nội dung nhận xét
   * @example "Môi giới rất nhiệt tình và chuyên nghiệp."
   */
  comment?: string;
}

export interface TermRateDto {
  /**
   * Kỳ hạn gửi
   * @example "3 tháng"
   */
  term: string;
  /**
   * Lãi suất (%) tương ứng với kỳ hạn
   * @example 0.5
   */
  interestRate: number;
}

export interface CreateBankDto {
  /**
   * Tên ngân hàng
   * @example "Banque pour le Commerce Extérieur Lao (BCEL)"
   */
  name: string;
  /** Danh sách kỳ hạn và lãi suất */
  termRates: TermRateDto[];
  /** image Bank */
  imageUrl?: string;
}

export interface UpdateBankDto {
  /**
   * Tên ngân hàng
   * @example "Banque pour le Commerce Extérieur Lao (BCEL)"
   */
  name?: string;
  /** Danh sách kỳ hạn và lãi suất */
  termRates?: TermRateDto[];
  /** image Bank */
  imageUrl?: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
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

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
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
    this.instance = instance ?? axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
    this.injectHeaders = injectHeaders;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
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
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
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

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    let headers = {
      ...(requestParams.headers || {}),
      ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
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
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
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
        page?: number;
        perPage?: number;
        /** Search of the user */
        search?: string;
        /** Role of the user */
        role?: string;
        /** Filter by specialty */
        specialty?: string;
        /** Filter by location info ID */
        locationInfoId?: string;
        /** Filter users who requested role upgrade */
        requestedRoleUpgrade?: boolean;
        /**
         * Ngôn ngữ hiển thị (VND = Tiếng Việt, USD = English, LAK = Lao)
         * @example "USD"
         */
        lang?: "VND" | "USD" | "LAK";
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
        page?: number;
        perPage?: number;
        /** Search of the user */
        search?: string;
        /** Role of the user */
        role?: string;
        /** Filter by specialty */
        specialty?: string;
        /** Filter by location info ID */
        locationInfoId?: string;
        /** Filter users who requested role upgrade */
        requestedRoleUpgrade?: boolean;
        /**
         * Ngôn ngữ hiển thị (VND = Tiếng Việt, USD = English, LAK = Lao)
         * @example "USD"
         */
        lang?: "VND" | "USD" | "LAK";
        fullName?: string;
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
     * @name UserControllerGetRandomUser
     * @request GET:/api/user/random-from-bank
     */
    userControllerGetRandomUser: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/user/random-from-bank`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserControllerGet
     * @request GET:/api/user/{id}
     */
    userControllerGet: (
      id: string,
      query?: {
        /**
         * Ngôn ngữ hiển thị (VND = Tiếng Việt, USD = English, LAK = Lao)
         * @example "USD"
         */
        lang?: "VND" | "USD" | "LAK";
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/user/${id}`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserControllerUpdate
     * @request PATCH:/api/user/{id}
     */
    userControllerUpdate: (id: string, data: UpdateUserDto, params: RequestParams = {}) =>
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
        phone?: string | null;
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
     * @secure
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
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserControllerRequestRoleUpgrade
     * @request PATCH:/api/user/{id}/request-role-upgrade
     */
    userControllerRequestRoleUpgrade: (
      id: string,
      data: {
        note?: string | null;
        phone?: string | null;
        /** @format binary */
        image?: File | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/user/${id}/request-role-upgrade`,
        method: "PATCH",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserControllerApproveRoleUpgrade
     * @request PATCH:/api/user/{id}/approve-role-upgrade
     * @secure
     */
    userControllerApproveRoleUpgrade: (
      id: string,
      data: {
        approve?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/user/${id}/approve-role-upgrade`,
        method: "PATCH",
        body: data,
        secure: true,
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
     * @name AuthControllerRefresh
     * @summary Refresh access token
     * @request POST:/api/auth/refresh
     */
    authControllerRefresh: (data: RefreshTokenDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/auth/refresh`,
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
     * @tags Auth
     * @name AuthControllerResetPassword
     * @summary Reset user password
     * @request POST:/api/auth/reset-password
     */
    authControllerResetPassword: (data: ResetPasswordDto, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/auth/reset-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Property
     * @name PropertyControllerCreate
     * @request POST:/api/property
     * @secure
     */
    propertyControllerCreate: (data: CreatePropertyDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/property`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Property
     * @name PropertyControllerGetAll
     * @request GET:/api/property
     * @secure
     */
    propertyControllerGetAll: (
      query?: {
        page?: number;
        perPage?: number;
        /** Loại bất động sản (có thể truyền nhiều, cách nhau dấu phẩy) */
        type?: string[];
        /** ID của location */
        locationId?: string;
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
        transaction?: "rent" | "sale" | "project";
        /** Trạng thái hệ thống */
        status?: "pending" | "approved" | "rejected";
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/property`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Property
     * @name PropertyControllerGetByUser
     * @request GET:/api/property/owner
     * @secure
     */
    propertyControllerGetByUser: (
      query?: {
        page?: number;
        perPage?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/property/owner`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Property
     * @name PropertyControllerGetByUserId
     * @request GET:/api/property/user/{userId}
     */
    propertyControllerGetByUserId: (
      userId: string,
      query?: {
        page?: number;
        perPage?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/property/user/${userId}`,
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
     * @secure
     */
    propertyControllerUpdate: (id: string, data: UpdatePropertyDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/property/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Property
     * @name PropertyControllerRemove
     * @request DELETE:/api/property/{id}
     * @secure
     */
    propertyControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/property/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Property
     * @name PropertyControllerGetSimilarProperties
     * @request GET:/api/property/{id}/similar
     */
    propertyControllerGetSimilarProperties: (
      id: string,
      query?: {
        page?: number;
        perPage?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/property/${id}/similar`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Property
     * @name PropertyControllerApprove
     * @summary Approve a property
     * @request PATCH:/api/property/{id}/approve
     * @secure
     */
    propertyControllerApprove: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/property/${id}/approve`,
        method: "PATCH",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Property
     * @name PropertyControllerReject
     * @summary Reject a property
     * @request PATCH:/api/property/{id}/reject
     * @secure
     */
    propertyControllerReject: (id: string, data: RejectPropertyDto, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/property/${id}/reject`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
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
    propertyTypeControllerCreate: (data: CreatePropertyTypeDto, params: RequestParams = {}) =>
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
    propertyTypeControllerGetAll: (
      query?: {
        page?: number;
        perPage?: number;
        /** Trạng thái */
        transaction?: "rent" | "sale" | "project";
        /** Từ khóa tìm kiếm tên bất động sản */
        search?: string;
        /**
         * Ngôn ngữ hiển thị (VND = Tiếng Việt, USD = English, LAK = Lao)
         * @example "USD"
         */
        lang?: "VND" | "USD" | "LAK";
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/property-type`,
        method: "GET",
        query: query,
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
    propertyTypeControllerGet: (
      id: string,
      query?: {
        /**
         * Ngôn ngữ hiển thị (VND = Tiếng Việt, USD = English, LAK = Lao)
         * @example "USD"
         */
        lang?: "VND" | "USD" | "LAK";
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/property-type/${id}`,
        method: "GET",
        query: query,
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
    propertyTypeControllerUpdate: (id: string, data: CreatePropertyTypeDto, params: RequestParams = {}) =>
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
    userRoleControllerCreate: (data: CreateUserRoleDto, params: RequestParams = {}) =>
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
    userRoleControllerGetAll: (
      query?: {
        page?: number;
        perPage?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/user-role`,
        method: "GET",
        query: query,
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

    /**
     * No description
     *
     * @tags images
     * @name ImageControllerUploadImage
     * @request POST:/api/images/upload
     */
    imageControllerUploadImage: (
      data: {
        /** @format binary */
        image?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/images/upload`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Setting
     * @name SettingControllerGet
     * @request GET:/api/setting
     */
    settingControllerGet: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/setting`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Setting
     * @name SettingControllerUpdate
     * @request PATCH:/api/setting
     */
    settingControllerUpdate: (data: CreateSettingDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/setting`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ExchangeRate
     * @name ExchangeRateControllerCreate
     * @summary Create exchange rate
     * @request POST:/api/exchange-rate
     */
    exchangeRateControllerCreate: (data: CreateExchangeRateDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/exchange-rate`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ExchangeRate
     * @name ExchangeRateControllerGetAll
     * @summary Get all exchange rates
     * @request GET:/api/exchange-rate
     */
    exchangeRateControllerGetAll: (
      query?: {
        page?: number;
        perPage?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/exchange-rate`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ExchangeRate
     * @name ExchangeRateControllerGet
     * @summary Get exchange rate by id
     * @request GET:/api/exchange-rate/{id}
     */
    exchangeRateControllerGet: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/exchange-rate/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ExchangeRate
     * @name ExchangeRateControllerUpdate
     * @summary Update exchange rate by id
     * @request PATCH:/api/exchange-rate/{id}
     */
    exchangeRateControllerUpdate: (id: string, data: UpdateExchangeRateDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/exchange-rate/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ExchangeRate
     * @name ExchangeRateControllerRemove
     * @summary Delete exchange rate by id
     * @request DELETE:/api/exchange-rate/{id}
     */
    exchangeRateControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/exchange-rate/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags LocationInfo
     * @name LocationInfoControllerCreate
     * @request POST:/api/location-info
     */
    locationInfoControllerCreate: (data: CreateLocationInfoDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/location-info`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags LocationInfo
     * @name LocationInfoControllerGetAll
     * @request GET:/api/location-info
     */
    locationInfoControllerGetAll: (
      query?: {
        page?: number;
        perPage?: number;
        /** Search of the location Info */
        search?: string;
        /**
         * Ngôn ngữ hiển thị (VND = Tiếng Việt, USD = English, LAK = Lao)
         * @example "USD"
         */
        lang?: "VND" | "USD" | "LAK";
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/location-info`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags LocationInfo
     * @name LocationInfoControllerGetTrendingLocations
     * @request GET:/api/location-info/trending
     */
    locationInfoControllerGetTrendingLocations: (
      query?: {
        /**
         * Ngôn ngữ hiển thị (VND = Tiếng Việt, USD = English, LAK = Lao)
         * @example "USD"
         */
        lang?: "VND" | "USD" | "LAK";
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/location-info/trending`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags LocationInfo
     * @name LocationInfoControllerGet
     * @request GET:/api/location-info/{id}
     */
    locationInfoControllerGet: (
      id: string,
      query?: {
        /**
         * Ngôn ngữ hiển thị (VND = Tiếng Việt, USD = English, LAK = Lao)
         * @example "USD"
         */
        lang?: "VND" | "USD" | "LAK";
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/location-info/${id}`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags LocationInfo
     * @name LocationInfoControllerUpdate
     * @request PATCH:/api/location-info/{id}
     */
    locationInfoControllerUpdate: (id: string, data: CreateLocationInfoDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/location-info/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags LocationInfo
     * @name LocationInfoControllerRemove
     * @request DELETE:/api/location-info/{id}
     */
    locationInfoControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/location-info/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags NewsType
     * @name NewsTypeControllerCreateNewsType
     * @summary Create news type
     * @request POST:/api/news-type
     */
    newsTypeControllerCreateNewsType: (data: CreateNewsTypeDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/news-type`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags NewsType
     * @name NewsTypeControllerGetAll
     * @summary Get all news types
     * @request GET:/api/news-type
     */
    newsTypeControllerGetAll: (
      query?: {
        page?: number;
        perPage?: number;
        /**
         * Ngôn ngữ hiển thị (VND = Tiếng Việt, USD = English, LAK = Lao)
         * @example "USD"
         */
        lang?: "VND" | "USD" | "LAK";
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/news-type`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags NewsType
     * @name NewsTypeControllerGet
     * @summary Get news type by id
     * @request GET:/api/news-type/{id}
     */
    newsTypeControllerGet: (
      id: string,
      query?: {
        /**
         * Ngôn ngữ hiển thị (VND = Tiếng Việt, USD = English, LAK = Lao)
         * @example "USD"
         */
        lang?: "VND" | "USD" | "LAK";
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/news-type/${id}`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags NewsType
     * @name NewsTypeControllerUpdate
     * @summary Update news type by id
     * @request PATCH:/api/news-type/{id}
     */
    newsTypeControllerUpdate: (id: string, data: CreateNewsTypeDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/news-type/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags NewsType
     * @name NewsTypeControllerRemove
     * @summary Delete news type by id
     * @request DELETE:/api/news-type/{id}
     */
    newsTypeControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/news-type/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags News
     * @name NewsControllerCreate
     * @summary Create news
     * @request POST:/api/news
     */
    newsControllerCreate: (data: CreateNewsDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/news`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags News
     * @name NewsControllerGetAll
     * @summary Get all news
     * @request GET:/api/news
     */
    newsControllerGetAll: (
      query?: {
        page?: number;
        perPage?: number;
        /** Type */
        newsTypeId?: string;
        /** Từ khóa tìm kiếm tên tin tức */
        search?: string;
        /**
         * Ngôn ngữ hiển thị (VND = Tiếng Việt, USD = English, LAK = Lao)
         * @example "USD"
         */
        lang?: "VND" | "USD" | "LAK";
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/news`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags News
     * @name NewsControllerGet
     * @summary Get news by id
     * @request GET:/api/news/{id}
     */
    newsControllerGet: (
      id: string,
      query?: {
        /**
         * Ngôn ngữ hiển thị (VND = Tiếng Việt, USD = English, LAK = Lao)
         * @example "USD"
         */
        lang?: "VND" | "USD" | "LAK";
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/news/${id}`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags News
     * @name NewsControllerUpdate
     * @summary Update news by id
     * @request PATCH:/api/news/{id}
     */
    newsControllerUpdate: (id: string, data: UpdateNewsDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/news/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags News
     * @name NewsControllerRemove
     * @summary Delete news by id
     * @request DELETE:/api/news/{id}
     */
    newsControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/news/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AboutUs
     * @name AboutUsControllerGet
     * @request GET:/api/about-us
     */
    aboutUsControllerGet: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/about-us`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AboutUs
     * @name AboutUsControllerUpdate
     * @request PATCH:/api/about-us
     */
    aboutUsControllerUpdate: (data: UpdateAboutUsDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/about-us`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags UserFeedback
     * @name UserFeedbackControllerCreate
     * @summary Create user feedback
     * @request POST:/api/user-feedback
     * @secure
     */
    userFeedbackControllerCreate: (data: CreateUserFeedbackDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/user-feedback`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags UserFeedback
     * @name UserFeedbackControllerGetByUserId
     * @summary Get feedback list by user id
     * @request GET:/api/user-feedback/user/{userId}
     */
    userFeedbackControllerGetByUserId: (
      userId: string,
      query?: {
        page?: number;
        perPage?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/user-feedback/user/${userId}`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags UserFeedback
     * @name UserFeedbackControllerGetById
     * @summary Get feedback detail by id
     * @request GET:/api/user-feedback/{id}
     */
    userFeedbackControllerGetById: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/user-feedback/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bank
     * @name BankControllerCreateBank
     * @summary Create bank
     * @request POST:/api/bank
     */
    bankControllerCreateBank: (data: CreateBankDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/bank`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bank
     * @name BankControllerGetAll
     * @summary Get all bank
     * @request GET:/api/bank
     */
    bankControllerGetAll: (
      query?: {
        page?: number;
        perPage?: number;
        /** Search of the bank */
        search?: string;
        /**
         * Ngôn ngữ hiển thị (VND = Tiếng Việt, USD = English, LAK = Lao)
         * @example "USD"
         */
        lang?: "VND" | "USD" | "LAK";
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/bank`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bank
     * @name BankControllerGet
     * @summary Get bank by id
     * @request GET:/api/bank/{id}
     */
    bankControllerGet: (
      id: string,
      query?: {
        /**
         * Ngôn ngữ hiển thị (VND = Tiếng Việt, USD = English, LAK = Lao)
         * @example "USD"
         */
        lang?: "VND" | "USD" | "LAK";
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/bank/${id}`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bank
     * @name BankControllerUpdate
     * @summary Update bank by id
     * @request PATCH:/api/bank/{id}
     */
    bankControllerUpdate: (id: string, data: UpdateBankDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/bank/${id}`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bank
     * @name BankControllerRemove
     * @summary Delete bank by id
     * @request DELETE:/api/bank/{id}
     */
    bankControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/bank/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Dashboard
     * @name DashboardControllerGetDashboard
     * @summary Get Dashboard
     * @request GET:/api/dashboard
     */
    dashboardControllerGetDashboard: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/dashboard`,
        method: "GET",
        ...params,
      }),
  };
}
