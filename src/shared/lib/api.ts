// ═══════════════════════════════════════════
// Base API Client
// ═══════════════════════════════════════════

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function baseFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  let url = `${API_BASE}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    ...fetchOptions,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new ApiError(response.status, errorBody || response.statusText);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, params?: Record<string, string>) =>
    baseFetch<T>(endpoint, { method: "GET", params }),

  post: <T>(endpoint: string, body?: unknown) =>
    baseFetch<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),

  put: <T>(endpoint: string, body?: unknown) =>
    baseFetch<T>(endpoint, { method: "PUT", body: JSON.stringify(body) }),

  patch: <T>(endpoint: string, body?: unknown) =>
    baseFetch<T>(endpoint, { method: "PATCH", body: JSON.stringify(body) }),

  delete: <T>(endpoint: string) =>
    baseFetch<T>(endpoint, { method: "DELETE" }),
};