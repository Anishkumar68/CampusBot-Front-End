import axios from "axios";
import {
	getToken,
	isTokenExpired,
	removeToken,
	getRefreshToken,
} from "../utils/auth";
import { refreshAccessToken } from "./authService";
import { API_BASE_URL } from "../components/config";

const CHAT_API = `${API_BASE_URL}/chat`;

const HEADERS = () => {
	const token = getToken();
	return {
		"Content-Type": "application/json",
		...(token && { Authorization: `Bearer ${token}` }),
	};
};

async function ensureValidToken() {
	if (isTokenExpired()) {
		console.log("🔄 Token expired. Refreshing...");
		const success = await refreshAccessToken();
		if (!success) {
			console.log("❌ Refresh failed. Redirecting to login...");
			removeToken();
			window.location.href = "/login";
			return false;
		}
	}
	return true;
}

export async function sendMessageToBot(message, session_id = null) {
	try {
		const valid = await ensureValidToken();
		if (!valid) return { success: false, error: "Session expired." };

		const response = await axios.post(
			CHAT_API,
			{
				message,
				session_id, // ✅ Changed from chat_id to session_id
				model: "gpt-4.1-mini-2025-04-14", // ✅ Changed from "openai" to "gpt-4.1-mini-2025-04-14-mini"
				temperature: 0.2,
				active_pdf_type: "default", // ✅ Added missing field
			},
			{ headers: HEADERS() }
		);

		return {
			success: true,
			response: response.data.response,
			session_id: response.data.session_id, // ✅ Return session_id for future use
		};
	} catch (error) {
		console.error("API Error:", error.response?.data || error.message);

		if (error.response?.status === 401) {
			removeToken();
			window.location.href = "/login";
		}

		// ✅ Better error handling - show actual error details in development
		const errorMessage =
			error.response?.data?.detail ||
			error.response?.data?.message ||
			"Sorry, I couldn't connect to the server.";

		return {
			success: false,
			error: errorMessage,
		};
	}
}

// ✅ Universal GET Helper
async function apiGet(url) {
	try {
		const valid = await ensureValidToken();
		if (!valid) return [];

		const response = await axios.get(url, { headers: HEADERS() });
		return response.data;
	} catch (error) {
		console.error("API Error:", error.response?.data || error.message);
		return [];
	}
}

// ✅ Get full chat history
export async function getChatHistory(chatId) {
	return apiGet(`${CHAT_API}/history/${chatId}`);
}

// ✅ Get all sessions for a user
export async function getAllChatSessions(userId) {
	return apiGet(`${CHAT_API}/sessions/${userId}`);
}

// ✅ Get chat summary
export async function getChatSummary(chatId) {
	return apiGet(`${CHAT_API}/summary/${chatId}`);
}

// ✅ Get chat sentiment
export async function getChatSentiment(chatId) {
	return apiGet(`${CHAT_API}/sentiment/${chatId}`);
}

// ✅ Get chat intent
export async function getChatIntent(chatId) {
	return apiGet(`${CHAT_API}/intent/${chatId}`);
}

// ✅ Get chat entities
export async function getChatEntities(chatId) {
	return apiGet(`${CHAT_API}/entities/${chatId}`);
}

// ✅ Get chat topics
export async function getChatTopics(chatId) {
	return apiGet(`${CHAT_API}/topics/${chatId}`);
}

export async function createNewChatSession(userId) {
	try {
		const valid = await ensureValidToken();
		if (!valid) return null;

		const response = await axios.post(`${CHAT_API}/sessions`, {
			headers: HEADERS(),
		});
		return response.data;
	} catch (error) {
		console.error("API Error:", error.response?.data || error.message);
		return null;
	}
}

export async function deleteChatSession(sessionId) {
	try {
		const valid = await ensureValidToken();
		if (!valid) return false;

		await axios.delete(`${CHAT_API}/sessions/${sessionId}`, {
			headers: HEADERS(),
		});
		return true;
	} catch (error) {
		console.error("API Error:", error.response?.data || error.message);
		return false;
	}
}

export async function updateChatSessionTitle(sessionId, title) {
	try {
		const valid = await ensureValidToken();
		if (!valid) return false;

		await axios.put(
			`${CHAT_API}/sessions/${sessionId}`,
			{ title },
			{ headers: HEADERS() }
		);
		return true;
	} catch (error) {
		console.error("API Error:", error.response?.data || error.message);
		return false;
	}
}

export async function getChatFollowups(chatId) {
	try {
		const valid = await ensureValidToken();
		if (!valid) return {};

		const response = await axios.get(`${CHAT_API}/followups/${chatId}`, {
			headers: HEADERS(),
		});
		return response.data;
	} catch (error) {
		console.error("API Error:", error.response?.data || error.message);
		return {};
	}
}
