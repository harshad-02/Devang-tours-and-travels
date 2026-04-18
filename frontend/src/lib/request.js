import { readJsonResponse } from "./api.js";

export async function fetchJson(path, options = {}) {
  let response;

  try {
    response = await fetch(path, options);
  } catch (error) {
    throw new Error(
      "Unable to reach the server. Make sure the backend is running on port 5000.",
    );
  }

  const data = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(data?.message || "Request failed.");
  }

  return data;
}
