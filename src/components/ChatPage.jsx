import { useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatWindow from "./Chatwindow";
import { getToken, isTokenExpired, removeToken } from "../utils/auth";
import { API_BASE_URL } from "./config";

export default function ChatPage() {
	const [messages, setMessages] = useState([
		{
			sender: "bot",
			type: "welcome",
			text: `Hi, I’m CampusBot, your university assistant. I'm here to answer commonly asked questions.\nI do best when you ask a short question, like "How do I apply?" How can I help you?`,
			options: [
				"How do I apply?",
				"When is tuition due?",
				"How do I set up parent access?",
				"How do I register for a campus visit?",
				"Are test scores optional?",
			],
			followupsEnabled: true,
		},
	]);

	const handleSend = async (userText) => {
		if (!userText?.trim()) return;

		// Add user message and bot loader
		setMessages((prev) => [
			...prev,
			{ sender: "user", text: userText },
			{ sender: "bot", type: "loader" },
		]);

		try {
			const token = getToken();

			const response = await fetch(`${API_BASE_URL}/chat`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...(token && { Authorization: `Bearer ${token}` }),
				},
				body: JSON.stringify({
					message: userText,
					model: "openai",
					temperature: 0.7,
				}),
			});

			const data = await response.json();
			const botReply = data?.response || "Sorry, no reply received.";
			const followups = data?.followups || {};

			console.log("🤖 Bot Reply:", botReply);
			console.log("💡 Follow-ups:", followups);

			// Replace loader with bot message
			setMessages((prev) =>
				prev.map((msg) =>
					msg.type === "loader"
						? {
								sender: "bot",
								text: botReply,
								followups,
								followupsEnabled: true,
						  }
						: msg
				)
			);
		} catch (error) {
			console.error("Send message error:", error);
			setMessages((prev) =>
				prev.map((msg) =>
					msg.type === "loader"
						? {
								sender: "bot",
								text: "Server Error. Please try again later.",
						  }
						: msg
				)
			);
		}
	};

	// 🔁 Handles when user clicks a follow-up suggestion
	const handleQuickSelect = (optionText, msgIndex) => {
		setMessages((prev) =>
			prev.map((msg, idx) =>
				idx === msgIndex ? { ...msg, followupsEnabled: false } : msg
			)
		);
		handleSend(optionText);
	};

	return (
		<div className="bg-gray-100 h-[100vh] flex flex-col justify-between">
			<ChatHeader />
			<ChatWindow
				messages={messages}
				onQuickSelect={handleQuickSelect}
				onSend={handleSend}
			/>
		</div>
	);
}
