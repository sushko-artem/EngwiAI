class ApiClient {
  private baseURL: string;
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL;
    if (!this.baseURL) throw new Error("VITE_API_URL is not defined");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
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

    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorResponse = await response.json();
        errorMessage = errorResponse.message || response.statusText;
      } catch {
        errorMessage = (await response.text()) || response.statusText;
      }
      throw new Error(errorMessage, {
        cause: response.status,
      });
    }

    if (response.status === 204) return {} as T;
    return response.json();
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
