import { getRefreshToken, saveToken, removeToken } from "../utils/auth";

const BASE_URL = "http://localhost:8000";

export async function refreshAccessToken() {
	try {
		const refreshToken = getRefreshToken();
		if (!refreshToken) {
			console.error("No refresh token available");
			return false;
		}

		const response = await fetch(`${BASE_URL}/auth/refresh`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ refresh_token: refreshToken }),
		});

		if (!response.ok) {
			console.error("Refresh token failed", await response.text());
			return false;
		}

		const data = await response.json();
		if (data.access_token) {
			saveToken(data.access_token);
			console.log("✅ Access token refreshed!");
			return true;
		} else {
			console.error("Refresh token response missing access_token");
			return false;
		}
	} catch (error) {
		console.error("Error refreshing access token:", error);
		return false;
	}
}
