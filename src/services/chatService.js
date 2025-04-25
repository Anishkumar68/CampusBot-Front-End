import axios from "axios";
import { getToken } from "../utils/auth";

const BASE_URL = "http://localhost:8000";
const CHAT_API = `${BASE_URL}/chat`;

const HEADERS = () => {
	const token = getToken();
	return {
		"Content-Type": "application/json",
		...(token && { Authorization: `Bearer ${token}` }),
	};
};

// ✅ Send message to LLM bot
export async function sendMessageToBot(message, chat_id = null) {
	try {
		const response = await axios.post(
			`${CHAT_API}/`,
			{
				message,
				chat_id,
				model: "gpt-4o-mini", // or "huggingface"
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

// ✅ Get full chat history
// export async function getChatHistory(chatId) {
// 	try {
// 		const response = await axios.get(`${CHAT_API}/history/${chatId}`, {
// 			headers: HEADERS(),
// 		});
// 		return response.data;
// 	} catch (error) {
// 		console.error("API Error:", error);
// 		return [];
// 	}
// }

// // ✅ Get all sessions for a user
// export async function getAllChatSessions(userId) {
// 	try {
// 		const response = await axios.get(`${CHAT_API}/sessions/${userId}`, {
// 			headers: HEADERS(),
// 		});
// 		return response.data;
// 	} catch (error) {
// 		console.error("API Error:", error);
// 		return [];
// 	}
// }

// // 🔍 Additional Features

// export async function getChatSummary(chatId) {
// 	try {
// 		const response = await axios.get(`${CHAT_API}/summary/${chatId}`, {
// 			headers: HEADERS(),
// 		});
// 		return response.data;
// 	} catch (error) {
// 		console.error("API Error:", error);
// 		return null;
// 	}
// }

// export async function getChatSentiment(chatId) {
// 	try {
// 		const response = await axios.get(`${CHAT_API}/sentiment/${chatId}`, {
// 			headers: HEADERS(),
// 		});
// 		return response.data;
// 	} catch (error) {
// 		console.error("API Error:", error);
// 		return null;
// 	}
// }

// export async function getChatIntent(chatId) {
// 	try {
// 		const response = await axios.get(`${CHAT_API}/intent/${chatId}`, {
// 			headers: HEADERS(),
// 		});
// 		return response.data;
// 	} catch (error) {
// 		console.error("API Error:", error);
// 		return null;
// 	}
// }

// export async function getChatEntities(chatId) {
// 	try {
// 		const response = await axios.get(`${CHAT_API}/entities/${chatId}`, {
// 			headers: HEADERS(),
// 		});
// 		return response.data;
// 	} catch (error) {
// 		console.error("API Error:", error);
// 		return null;
// 	}
// }

// export async function getChatTopics(chatId) {
// 	try {
// 		const response = await axios.get(`${CHAT_API}/topics/${chatId}`, {
// 			headers: HEADERS(),
// 		});
// 		return response.data;
// 	} catch (error) {
// 		console.error("API Error:", error);
// 		return null;
// 	}
// }

// 🧼 Add more functions as your backend supports
