/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface VerifyEmailResponse {
  /** @minLength 1 */
  code: string;
  /** @minLength 1 */
  message: string;
  data: object;
}

export interface ApiErrorResponse {
  /** @minLength 1 */
  code: string;
  /** @minLength 1 */
  message: string;
  /** @minLength 1 */
  reason: string;
  errors?: {
    path: string;
    message: string;
  }[];
}

export interface ForgotPasswordBody {
  /**
   * @format email
   * @minLength 3
   */
  email: string;
}

export interface ForgotPasswordResponse {
  /** @minLength 1 */
  code: string;
  /** @minLength 1 */
  message: string;
  data: object;
}

export interface ResetPasswordBody {
  /** @minLength 1 */
  token: string;
  /** @minLength 8 */
  password: string;
}

export interface ResetPasswordResponse {
  /** @minLength 1 */
  code: string;
  /** @minLength 1 */
  message: string;
  data: object;
}

export interface SignUpEmailBody {
  /**
   * @format email
   * @minLength 3
   */
  email: string;
  /** @minLength 8 */
  password: string;
  /** @minLength 1 */
  name: string;
  /**
   * @format safe-redirect-path
   * @minLength 1
   * @maxLength 2048
   */
  redirectTo?: string;
}

export interface SignUpEmailResponse {
  /** @minLength 1 */
  code: string;
  /** @minLength 1 */
  message: string;
  data: object;
}

export interface SignInEmailBody {
  /**
   * @format email
   * @minLength 3
   */
  email: string;
  /** @minLength 8 */
  password: string;
}

export interface SignInEmailResponse {
  /** @minLength 1 */
  code: string;
  /** @minLength 1 */
  message: string;
  data: {
    user: {
      /** @format uuid */
      id: string;
      /** @minLength 3 */
      email: string;
      name: string;
      emailVerified: boolean;
    };
  };
}

export interface SignOutResponse {
  /** @minLength 1 */
  code: string;
  /** @minLength 1 */
  message: string;
  data: object;
}

export interface GetSessionResponse {
  /** @minLength 1 */
  code: string;
  /** @minLength 1 */
  message: string;
  data: {
    authenticated: boolean;
    user?: {
      /** @format uuid */
      id: string;
      /** @minLength 3 */
      email: string;
      name: string;
      emailVerified: boolean;
    };
  };
}

export interface ListMySubscriptionsResponse {
  /** @minLength 1 */
  code: string;
  /** @minLength 1 */
  message: string;
  data: {
    /** @format uuid */
    id: string;
    status: "active" | "cancelled" | "expired";
    billingPeriod: "monthly" | "yearly";
    bundle: {
      /** @format uuid */
      id: string;
      name: string;
    } | null;
    applications: {
      /** @format uuid */
      id: string;
      slug: string;
      name: string;
    }[];
    /** @format date-time */
    currentPeriodStart: string;
    /** @format date-time */
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    licenseKeyHint: string | null;
  }[];
}

export interface CancelMySubscriptionResponse {
  /** @minLength 1 */
  code: string;
  /** @minLength 1 */
  message: string;
  data: object;
}

export type StoreSelectionBody =
  | {
      billingPeriod: "monthly" | "yearly";
      /** @format uuid */
      bundleId: string;
    }
  | {
      billingPeriod: "monthly" | "yearly";
      /**
       * @maxItems 50
       * @minItems 1
       */
      applicationIds: string[];
    };

export interface RequestMySubscriptionAdjustmentResponse {
  /** @minLength 1 */
  code: string;
  /** @minLength 1 */
  message: string;
  data: {
    /** @format uuid */
    orderId: string;
    kind: "purchase" | "adjustment" | "renewal";
    status: "pending" | "paid" | "failed" | "cancelled" | "expired";
    billingPeriod: "monthly" | "yearly";
    /** @min 0 */
    totalAmountMinor: number;
    currency: "PLN";
    paymentProvider: "mock";
    paymentReference: string;
    /** @format date-time */
    expiresAt: string;
  };
}

export interface GetCatalogResponse {
  /** @minLength 1 */
  code: string;
  /** @minLength 1 */
  message: string;
  data: {
    currency: "PLN";
    applications: {
      /** @format uuid */
      id: string;
      slug: string;
      name: string;
      description: string;
      prices: {
        billingPeriod: "monthly" | "yearly";
        /** @min 0 */
        amountMinor: number;
      }[];
    }[];
    bundles: {
      /** @format uuid */
      id: string;
      slug: string;
      name: string;
      description: string;
      applicationIds: string[];
      prices: {
        billingPeriod: "monthly" | "yearly";
        /** @min 0 */
        amountMinor: number;
      }[];
    }[];
  };
}

export interface QuoteCustomSelectionBody {
  billingPeriod: "monthly" | "yearly";
  /**
   * @maxItems 50
   * @minItems 1
   */
  applicationIds: string[];
}

export interface QuoteCustomSelectionResponse {
  /** @minLength 1 */
  code: string;
  /** @minLength 1 */
  message: string;
  data: {
    billingPeriod: "monthly" | "yearly";
    currency: "PLN";
    /** @min 0 */
    totalAmountMinor: number;
    items: {
      /** @format uuid */
      applicationId: string;
      /** @min 0 */
      amountMinor: number;
    }[];
    suggestedBundle: {
      /** @format uuid */
      bundleId: string;
      slug: string;
      name: string;
      /** @min 0 */
      amountMinor: number;
      /** @min 0 */
      savingsMinor: number;
    } | null;
  };
}

export interface CheckoutSelectionResponse {
  /** @minLength 1 */
  code: string;
  /** @minLength 1 */
  message: string;
  data: {
    /** @format uuid */
    orderId: string;
    kind: "purchase" | "adjustment" | "renewal";
    status: "pending" | "paid" | "failed" | "cancelled" | "expired";
    billingPeriod: "monthly" | "yearly";
    /** @min 0 */
    totalAmountMinor: number;
    currency: "PLN";
    paymentProvider: "mock";
    paymentReference: string;
    /** @format date-time */
    expiresAt: string;
  };
}

export interface ConfirmMockPaymentResponse {
  /** @minLength 1 */
  code: string;
  /** @minLength 1 */
  message: string;
  data: {
    /** @format uuid */
    orderId: string;
    /** @format uuid */
    subscriptionId: string;
    licenseKey: string | null;
  };
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
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
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

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
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
    if (input instanceof FormData) {
      return input;
    }
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
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
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

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title BNG Store API
 * @version 1.0.0
 * @contact
 *
 * BNG Store backend API documentation
 */
export class BngStoreApi<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags AuthRegistration
     * @name AuthRegistrationControllerSignUpEmail
     * @request POST:/api/v1/auth/sign-up/email
     */
    authRegistrationControllerSignUpEmail: (
      data: SignUpEmailBody,
      params: RequestParams = {},
    ) =>
      this.request<SignUpEmailResponse, ApiErrorResponse>({
        path: `/api/v1/auth/sign-up/email`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AuthSession
     * @name AuthSessionControllerSignInEmail
     * @request POST:/api/v1/auth/sign-in/email
     */
    authSessionControllerSignInEmail: (
      data: SignInEmailBody,
      params: RequestParams = {},
    ) =>
      this.request<SignInEmailResponse, ApiErrorResponse>({
        path: `/api/v1/auth/sign-in/email`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AuthSession
     * @name AuthSessionControllerSignOut
     * @request POST:/api/v1/auth/sign-out
     */
    authSessionControllerSignOut: (params: RequestParams = {}) =>
      this.request<SignOutResponse, ApiErrorResponse>({
        path: `/api/v1/auth/sign-out`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AuthSession
     * @name AuthSessionControllerGetSession
     * @request GET:/api/v1/auth/session
     */
    authSessionControllerGetSession: (params: RequestParams = {}) =>
      this.request<GetSessionResponse, ApiErrorResponse>({
        path: `/api/v1/auth/session`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AuthPassword
     * @name AuthPasswordControllerForgotPassword
     * @request POST:/api/v1/auth/forgot-password
     */
    authPasswordControllerForgotPassword: (
      data: ForgotPasswordBody,
      params: RequestParams = {},
    ) =>
      this.request<ForgotPasswordResponse, ApiErrorResponse>({
        path: `/api/v1/auth/forgot-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AuthPassword
     * @name AuthPasswordControllerResetPassword
     * @request POST:/api/v1/auth/reset-password
     */
    authPasswordControllerResetPassword: (
      data: ResetPasswordBody,
      params: RequestParams = {},
    ) =>
      this.request<ResetPasswordResponse, ApiErrorResponse>({
        path: `/api/v1/auth/reset-password`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AuthEmailVerification
     * @name AuthEmailVerificationControllerVerifyEmail
     * @request GET:/api/v1/auth/verify-email
     */
    authEmailVerificationControllerVerifyEmail: (
      query: {
        /** @minLength 1 */
        token: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<VerifyEmailResponse, ApiErrorResponse>({
        path: `/api/v1/auth/verify-email`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags StoreCatalog
     * @name StoreCatalogControllerGetCatalog
     * @request GET:/api/v1/store/catalog
     */
    storeCatalogControllerGetCatalog: (params: RequestParams = {}) =>
      this.request<GetCatalogResponse, ApiErrorResponse>({
        path: `/api/v1/store/catalog`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags StoreCatalog
     * @name StoreCatalogControllerQuoteCustomSelection
     * @request POST:/api/v1/store/quote
     */
    storeCatalogControllerQuoteCustomSelection: (
      data: QuoteCustomSelectionBody,
      params: RequestParams = {},
    ) =>
      this.request<QuoteCustomSelectionResponse, ApiErrorResponse>({
        path: `/api/v1/store/quote`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags StoreCheckout
     * @name StoreCheckoutControllerCheckoutSelection
     * @request POST:/api/v1/store/checkout
     */
    storeCheckoutControllerCheckoutSelection: (
      data: StoreSelectionBody,
      params: RequestParams = {},
    ) =>
      this.request<CheckoutSelectionResponse, ApiErrorResponse>({
        path: `/api/v1/store/checkout`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags StoreCheckout
     * @name StoreCheckoutControllerConfirmMockPayment
     * @request POST:/api/v1/store/payments/mock/{paymentReference}/confirm
     */
    storeCheckoutControllerConfirmMockPayment: (
      paymentReference: string,
      params: RequestParams = {},
    ) =>
      this.request<ConfirmMockPaymentResponse, ApiErrorResponse>({
        path: `/api/v1/store/payments/mock/${paymentReference}/confirm`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MySubscriptions
     * @name MySubscriptionsControllerListMySubscriptions
     * @request GET:/api/v1/me/subscriptions
     */
    mySubscriptionsControllerListMySubscriptions: (
      params: RequestParams = {},
    ) =>
      this.request<ListMySubscriptionsResponse, ApiErrorResponse>({
        path: `/api/v1/me/subscriptions`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MySubscriptions
     * @name MySubscriptionsControllerCancelMySubscription
     * @request POST:/api/v1/me/subscriptions/{subscriptionId}/cancel
     */
    mySubscriptionsControllerCancelMySubscription: (
      subscriptionId: string,
      params: RequestParams = {},
    ) =>
      this.request<CancelMySubscriptionResponse, ApiErrorResponse>({
        path: `/api/v1/me/subscriptions/${subscriptionId}/cancel`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MySubscriptions
     * @name MySubscriptionsControllerRequestMySubscriptionAdjustment
     * @request POST:/api/v1/me/subscriptions/{subscriptionId}/adjustments
     */
    mySubscriptionsControllerRequestMySubscriptionAdjustment: (
      subscriptionId: string,
      data: StoreSelectionBody,
      params: RequestParams = {},
    ) =>
      this.request<RequestMySubscriptionAdjustmentResponse, ApiErrorResponse>({
        path: `/api/v1/me/subscriptions/${subscriptionId}/adjustments`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
