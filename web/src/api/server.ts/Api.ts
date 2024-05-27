/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CreateTaskRequest {
  description?: string;
  title?: string;
}

export interface CreateUserRequest {
  firstname: string;
  lastname: string;
  seat: string;
}

export interface LoginRequest {
  firstname?: string;
  lastname?: string;
  seat_code?: string;
}

export interface Task {
  description?: string;
  id?: number;
  title?: string;
}

export interface User {
  created_at?: string;
  firstname: string;
  id: number;
  lastname: string;
  seat: string;
  updated_at?: string;
}

export interface ModelStep {
  created_at?: string;
  id?: number;
  task_id?: number;
  updated_at?: string;
  user_id?: number;
}

export interface ModelUser {
  created_at?: string;
  firstname?: string;
  id?: number;
  lastname?: string;
  seat?: string;
  updated_at?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title SIT IoT Workshop API
 * @version 1.0
 * @contact Sirawit Pratoomsuwan
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * No description
     *
     * @tags auth
     * @name Login
     * @summary Login
     * @request POST:/auth/login
     */
    login: (user: LoginRequest, params: RequestParams = {}) =>
      this.request<ModelUser, any>({
        path: `/auth/login`,
        method: "POST",
        body: user,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name Me
     * @summary Get current user
     * @request GET:/auth/me
     */
    me: (
      query: {
        /** Seat code */
        seat_code: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<ModelUser, any>({
        path: `/auth/me`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
  tasks = {
    /**
     * No description
     *
     * @tags task
     * @name GetTasks
     * @summary Get all tasks
     * @request GET:/tasks
     */
    getTasks: (params: RequestParams = {}) =>
      this.request<Task[], any>({
        path: `/tasks`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags task
     * @name CreateTask
     * @summary Create a new task
     * @request POST:/tasks
     */
    createTask: (task: CreateTaskRequest, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/tasks`,
        method: "POST",
        body: task,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name GetStepsByTaskId
     * @summary Get steps by task ID
     * @request GET:/tasks/{task_id}/steps
     */
    getStepsByTaskId: (taskId: number, params: RequestParams = {}) =>
      this.request<ModelStep[], any>({
        path: `/tasks/${taskId}/steps`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags user
     * @name GetUsers
     * @summary Get all users
     * @request GET:/users
     */
    getUsers: (params: RequestParams = {}) =>
      this.request<User[], any>({
        path: `/users`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name CreateUser
     * @summary Create a new user
     * @request POST:/users
     */
    createUser: (user: CreateUserRequest, params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/users`,
        method: "POST",
        body: user,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name GetStepsByUserId
     * @summary Get steps by user ID
     * @request GET:/users/{user_id}/steps
     */
    getStepsByUserId: (userId: number, params: RequestParams = {}) =>
      this.request<ModelStep[], any>({
        path: `/users/${userId}/steps`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MarkStepAsDone
     * @summary Mark step as done
     * @request POST:/users/{user_id}/steps
     */
    markStepAsDone: (
      userId: number,
      query: {
        /** Task ID */
        task_id: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<string, any>({
        path: `/users/${userId}/steps`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name MarkAsUndone
     * @summary Mark step as undone
     * @request DELETE:/users/{user_id}/steps
     */
    markAsUndone: (
      userId: number,
      query: {
        /** Task ID */
        task_id: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<string, any>({
        path: `/users/${userId}/steps`,
        method: "DELETE",
        query: query,
        format: "json",
        ...params,
      }),
  };
}
