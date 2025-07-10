import { useState, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatWindow from "./Chatwindow";
import Sidebar from "./Sidebar";
import { getToken, getUserId } from "../utils/auth";
import { API_BASE_URL } from "./config";

export default function ChatPage() {
	const token = getToken();
	const userId = getUserId();

	// 1. Hooks always run unconditionally
	const [sessions, setSessions] = useState([]);
	const [activeId, setActiveId] = useState(null);
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

	// 2. Fallback UI *after* hooks
	if (!token || !userId) {
		return (
			<div className="flex items-center justify-center h-screen text-red-600 font-semibold">
				Authentication error. Please log in again.
			</div>
		);
	}

	// 3. Load chat sessions
	useEffect(() => {
		fetch(`${API_BASE_URL}/chat/sessions/${userId}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => {
				if (!res.ok) throw new Error(`Failed to load sessions: ${res.status}`);
				return res.json();
			})
			.then((data) => {
				if (Array.isArray(data)) {
					setSessions(data);
					if (data.length) setActiveId(data[0].session_id);
				} else {
					console.warn("Sessions response not an array:", data);
					setSessions([]);
				}
			})
			.catch((err) => {
				console.error(err);
				setSessions([]);
			});
	}, [userId, token]);

	// 4. Load messages for active session
	useEffect(() => {
		if (!activeId) return;

		fetch(`${API_BASE_URL}/chat/sessions/${activeId}/messages`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => {
				if (res.status === 404) {
					console.warn("No messages yet — new session.");
					// Do not overwrite the existing welcome message
					return null;
				}
				if (!res.ok) throw new Error(`Failed to load messages: ${res.status}`);
				return res.json();
			})
			.then((data) => {
				if (data === null) return; // skip if 404
				if (Array.isArray(data)) {
					setMessages(
						data.map((m) => ({
							sender: m.role === "user" ? "user" : "bot",
							text: m.content,
							followupsEnabled: false,
						}))
					);
				} else {
					console.warn("Unexpected messages data format:", data);
				}
			})
			.catch((err) => {
				console.error(err);
				// Optional: keep existing messages or show UI alert
			});
	}, [activeId, token]);

	// 5. Send a chat message
	const handleSend = async (userText) => {
		if (!userText.trim()) return;
		setMessages((prev) => [
			...prev,
			{ sender: "user", text: userText },
			{ sender: "bot", type: "loader" },
		]);

		try {
			const res = await fetch(`${API_BASE_URL}/chat`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					message: userText,

					model: "openai",
					temperature: 0.7,
					chat_id: activeId,
				}),
			});
			if (!res.ok) throw new Error(`Chat API error: ${res.status}`);
			const data = await res.json();

			setMessages((prev) =>
				prev.map((msg) =>
					msg.type === "loader"
						? {
								sender: "bot",
								text: data.response || "Sorry, no reply received.",
								followups: data.followups || {},
								followupsEnabled: true,
						  }
						: msg
				)
			);
		} catch (error) {
			console.error(error);
			setMessages((prev) =>
				prev.map((msg) =>
					msg.type === "loader"
						? { sender: "bot", text: "Server Error. Please try again later." }
						: msg
				)
			);
		}
	};

	// 6. Create a new chat session (no user_id in body!)
	const handleNewChat = async () => {
		try {
			const res = await fetch(`${API_BASE_URL}/chat/sessions`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					title: "Untitled Chat",
					active_pdf_type: "default",
				}),
			});
			if (!res.ok) throw new Error(`Create session failed: ${res.status}`);
			const newSession = await res.json();

			setSessions((prev) => [newSession, ...prev]);
			setActiveId(newSession.session_id);
			setMessages([
				{
					sender: "bot",
					type: "welcome",
					text: "Hi, I’m CampusBot, your university assistant. How can I help you today?",
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
		} catch (error) {
			console.error(error);
		}
	};

	// 7. Quick-select followups
	const handleQuickSelect = (optionText, msgIndex) => {
		setMessages((prev) =>
			prev.map((m, i) =>
				i === msgIndex ? { ...m, followupsEnabled: false } : m
			)
		);
		handleSend(optionText);
	};

	return (
		<div className="flex h-screen overflow-hidden">
			<Sidebar
				sessions={sessions}
				activeId={activeId}
				onSelectSession={setActiveId}
				onNewChat={handleNewChat}
				setSessions={setSessions}
				setActiveId={setActiveId}
			/>

			<div className="flex-1 flex flex-col bg-gray-100">
				<ChatHeader />
				<ChatWindow
					messages={messages}
					onQuickSelect={handleQuickSelect}
					onSend={handleSend}
				/>
			</div>
		</div>
	);
}
