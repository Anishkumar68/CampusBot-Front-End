import { getRefreshToken, saveToken, removeToken } from "../utils/auth";
import { API_BASE_URL } from "../components/config";

// Track ongoing refresh requests to prevent multiple simultaneous refreshes
let refreshPromise = null;

export async function refreshAccessToken() {
	// If a refresh is already in progress, return that promise
	if (refreshPromise) {
		return refreshPromise;
	}

	refreshPromise = performRefresh();
	const result = await refreshPromise;
	refreshPromise = null; // Clear the promise after completion
	return result;
}

async function performRefresh() {
	try {
		const refreshToken = getRefreshToken();
		if (!refreshToken) {
			console.error("No refresh token available");
			// Clean up invalid state
			removeToken();
			return false;
		}

		console.log("🔄 Attempting to refresh access token...");

		const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// Some APIs expect the refresh token in Authorization header
				// "Authorization": `Bearer ${refreshToken}`
			},
			body: JSON.stringify({ refresh_token: refreshToken }),
		});

		// Handle different error scenarios
		if (response.status === 401 || response.status === 403) {
			console.error("❌ Refresh token expired or invalid");
			removeToken(); // Clear all tokens
			// Redirect to login
			if (typeof window !== "undefined") {
				window.location.href = "/login";
			}
			return false;
		}

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`❌ Refresh token failed (${response.status}):`, errorText);

			// If it's a server error (5xx), don't remove tokens - might be temporary
			if (response.status >= 500) {
				console.log("Server error - keeping tokens for retry");
				return false;
			}

			// For client errors (4xx), remove tokens
			removeToken();
			return false;
		}

		const data = await response.json();

		// Validate response structure
		if (!data.access_token) {
			console.error("❌ Refresh response missing access_token:", data);
			return false;
		}

		// Save the new access token
		saveToken(data.access_token);

		// If new refresh token is provided, save it too
		if (data.refresh_token) {
			// Assuming you have a saveRefreshToken function
			// saveRefreshToken(data.refresh_token);
			console.log("🔄 New refresh token received");
		}

		console.log("✅ Access token refreshed successfully!");
		return true;
	} catch (error) {
		console.error("❌ Network error refreshing access token:", error);

		// Don't remove tokens on network errors - might be temporary
		if (error.name === "NetworkError" || error.name === "TypeError") {
			console.log("Network error - keeping tokens for retry");
			return false;
		}

		// For other errors, clean up
		removeToken();
		return false;
	}
}

// Helper function to automatically refresh token and retry failed requests
export async function fetchWithAutoRefresh(url, options = {}) {
	try {
		// First attempt
		let response = await fetch(url, options);

		// If unauthorized, try refreshing token
		if (response.status === 401) {
			console.log("🔄 Got 401, attempting token refresh...");

			const refreshed = await refreshAccessToken();
			if (refreshed) {
				// Update the Authorization header with new token
				const newToken = getToken(); // Assuming you have a getToken function
				const updatedOptions = {
					...options,
					headers: {
						...options.headers,
						Authorization: `Bearer ${newToken}`,
					},
				};

				// Retry the original request
				response = await fetch(url, updatedOptions);
			} else {
				// Refresh failed, redirect to login
				if (typeof window !== "undefined") {
					window.location.href = "/login";
				}
				throw new Error("Authentication failed");
			}
		}

		return response;
	} catch (error) {
		console.error("fetchWithAutoRefresh error:", error);
		throw error;
	}
}

// Usage example for your chat API calls:
export async function sendMessageWithAuth(messageData, token) {
	return fetchWithAutoRefresh(`${API_BASE_URL}/chat/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(messageData),
	});
}
