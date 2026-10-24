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
  /** @minLength 3 */
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
      id: string;
      /** @minLength 3 */
      email: string;
      name: string;
      emailVerified: boolean;
    };
  };
}

export interface ForgotPasswordBody {
  /** @minLength 3 */
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

export interface VerifyEmailResponse {
  /** @minLength 1 */
  code: string;
  /** @minLength 1 */
  message: string;
  data: object;
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
     * @tags Auth
     * @name AuthControllerSignUpEmail
     * @request POST:/api/v1/auth/sign-up/email
     */
    authControllerSignUpEmail: (
      data: SignUpEmailBody,
      params: RequestParams = {},
    ) =>
      this.request<SignUpEmailResponse, any>({
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
     * @tags Auth
     * @name AuthControllerSignInEmail
     * @request POST:/api/v1/auth/sign-in/email
     */
    authControllerSignInEmail: (
      data: SignInEmailBody,
      params: RequestParams = {},
    ) =>
      this.request<SignInEmailResponse, any>({
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
     * @tags Auth
     * @name AuthControllerSignOut
     * @request POST:/api/v1/auth/sign-out
     */
    authControllerSignOut: (params: RequestParams = {}) =>
      this.request<SignOutResponse, any>({
        path: `/api/v1/auth/sign-out`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerGetSession
     * @request GET:/api/v1/auth/session
     */
    authControllerGetSession: (params: RequestParams = {}) =>
      this.request<GetSessionResponse, any>({
        path: `/api/v1/auth/session`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerForgotPassword
     * @request POST:/api/v1/auth/forgot-password
     */
    authControllerForgotPassword: (
      data: ForgotPasswordBody,
      params: RequestParams = {},
    ) =>
      this.request<ForgotPasswordResponse, any>({
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
     * @tags Auth
     * @name AuthControllerResetPassword
     * @request POST:/api/v1/auth/reset-password
     */
    authControllerResetPassword: (
      data: ResetPasswordBody,
      params: RequestParams = {},
    ) =>
      this.request<ResetPasswordResponse, any>({
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
     * @tags Auth
     * @name AuthControllerVerifyEmail
     * @request GET:/api/v1/auth/verify-email
     */
    authControllerVerifyEmail: (
      query: {
        /** @minLength 1 */
        token: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<VerifyEmailResponse, any>({
        path: `/api/v1/auth/verify-email`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
}
