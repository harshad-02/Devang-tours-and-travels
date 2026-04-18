const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL = envApiBaseUrl || "";

export function getApiUrl(path) {
  if (!path.startsWith("/")) {
    throw new Error("API paths must start with '/'.");
  }

  return `${API_BASE_URL}${path}`;
}

export async function readJsonResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json();
}
