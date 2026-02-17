const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function request<TResponse>(
  path: string,
  options: RequestInit = {}
): Promise<TResponse> {
  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null as TResponse;
  }

  const contentType = response.headers.get("Content-Type") || "";

  if (contentType.includes("application/json")) {
    return (await response.json()) as TResponse;
  }

  return (await response.text()) as unknown as TResponse;
}

export const http = {
  request,
};

export type HttpClient = typeof http;
