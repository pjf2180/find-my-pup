import { LOGOUT_ENDPOINT } from "../../api.types";

export async function logout(): Promise<Response> {
  try {
    const response = await fetch(LOGOUT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
}
