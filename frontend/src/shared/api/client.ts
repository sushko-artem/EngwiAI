class ApiClient {
  private baseURL: string;
  private isRefreshing = false;
  private refreshPromise: Promise<void> | null = null;
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL;
    if (!this.baseURL) throw new Error("VITE_API_URL is not defined");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retry = true
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
      ...options,
    };

    const response = await fetch(url, config);

    if (
      response.status === 401 &&
      retry &&
      !endpoint.includes("/auth/refresh")
    ) {
      try {
        await this.handleRefreshToken();
        return this.request<T>(endpoint, options, false);
      } catch {
        throw new Error("Session expired", { cause: 401 });
      }
    }

    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorResponse = await response.json();
        errorMessage = errorResponse.message || response.statusText;
      } catch {
        errorMessage = response.statusText;
      }
      throw new Error(errorMessage, {
        cause: response.status,
      });
    }

    if (response.status === 204) return {} as T;
    return response.json();
  }

  private async handleRefreshToken(): Promise<void> {
    if (this.isRefreshing) {
      return this.refreshPromise as Promise<void>;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.refreshTokenRequest();

    try {
      await this.refreshPromise;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async refreshTokenRequest(): Promise<void> {
    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Refresh failed");
    }
  }

  get = <T>(endpoint: string, options?: RequestInit): Promise<T> =>
    this.request(endpoint, { ...options, method: "GET" });

  post = <T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> =>
    this.request(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
}

export const apiClient = new ApiClient();
