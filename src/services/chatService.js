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
		console.log("Token expired. Trying to refresh...");
		const success = await refreshAccessToken();
		if (!success) {
			console.log("Failed to refresh token. Logging out.");
			removeToken();
			window.location.href = "/login";
			return false;
		}
	}
	return true;
}

export async function sendMessageToBot(message, chat_id = null) {
	try {
		const valid = await ensureValidToken();
		if (!valid) return "Session expired. Please log in again.";

		const response = await axios.post(
			CHAT_API,
			{
				message,
				chat_id,
				model: "openai",
				temperature: 0.7,
			},
			{ headers: HEADERS() }
		);
		return response.data.response;
	} catch (error) {
		console.error("API Error:", error.response?.data || error.message);

		if (error.response?.status === 401) {
			removeToken();
			window.location.href = "/login";
		}

		return "Sorry, I couldn't connect to the server.";
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
