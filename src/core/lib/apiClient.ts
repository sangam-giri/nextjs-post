import { API_BASE_URL } from "@/core/config/apiConfig";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiOptions extends RequestInit {
    body?: any; // Allow plain objects (auto-serialized to JSON)
}

async function request<T>(
    endpoint: string,
    method: HttpMethod,
    options: ApiOptions = {}
): Promise<T> {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        cache: "no-store", // adjust caching strategy if needed
        body: options.body ? JSON.stringify(options.body) : undefined,
        ...options,
    });

    if (!res.ok) {
        let errorMessage = `API Error: ${res.status} ${res.statusText}`;
        try {
            const errorData = await res.json();
            errorMessage = errorData?.message || errorMessage;
        } catch {
            // ignore JSON parse errors
        }
        throw new Error(errorMessage);
    }

    return res.json() as Promise<T>;
}

export const apiClient = {
    get: <T>(endpoint: string, options?: ApiOptions) =>
        request<T>(endpoint, "GET", options),
    post: <T>(endpoint: string, body?: any, options?: ApiOptions) =>
        request<T>(endpoint, "POST", { ...options, body }),
    put: <T>(endpoint: string, body?: any, options?: ApiOptions) =>
        request<T>(endpoint, "PUT", { ...options, body }),
    patch: <T>(endpoint: string, body?: any, options?: ApiOptions) =>
        request<T>(endpoint, "PATCH", { ...options, body }),
    delete: <T>(endpoint: string, options?: ApiOptions) =>
        request<T>(endpoint, "DELETE", options),
};
