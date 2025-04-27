import axios from "axios";
import { getToken, isTokenExpired, removeToken } from "../utils/auth";
import { refreshAccessToken } from "./authService"; // we will build this next

const BASE_URL = "http://localhost:8000";
const CHAT_API = `${BASE_URL}/chat`;

const HEADERS = () => {
	const token = getToken();
	return {
		"Content-Type": "application/json",
		...(token && { Authorization: `Bearer ${token}` }),
	};
};

// ✅ Helper: Automatically refresh token if expired
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

// ✅ Send message to LLM bot
export async function sendMessageToBot(message, chat_id = null) {
	try {
		const valid = await ensureValidToken();
		if (!valid) return "Session expired. Please log in again.";

		const response = await axios.post(
			`${CHAT_API}/`,
			{
				message,
				chat_id,
				model: "openai", // or "huggingface"
				temperature: 0.7,
			},
			{ headers: HEADERS() }
		);
		return response.data.response;
	} catch (error) {
		console.error("API Error:", error.response?.data || error.message);
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
