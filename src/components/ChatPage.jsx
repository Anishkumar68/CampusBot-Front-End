import { useState, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatWindow from "./Chatwindow";
import Sidebar from "./Sidebar";
import { getToken, getUserId } from "../utils/auth";
import { API_BASE_URL } from "./config";

export default function ChatPage() {
	const token = getToken();
	const userId = getUserId();

	const [sessions, setSessions] = useState([]);
	const [activeId, setActiveId] = useState(null);
	const [messages, setMessages] = useState([
		{
			sender: "bot",
			type: "welcome",
			text: `Hi, I'm CampusBot, your university assistant. I'm here to answer commonly asked questions.\nI do best when you ask a short question, like "How do I apply?" How can I help you?`,
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

	// Auth fallback
	if (!token || !userId) {
		return (
			<div className="flex items-center justify-center h-screen text-red-600 font-semibold">
				Authentication error. Please log in again.
			</div>
		);
	}

	// Load sessions
	useEffect(() => {
		fetch(`${API_BASE_URL}/chat/sessions/${userId}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => {
				if (!res.ok) throw new Error();
				return res.json();
			})
			.then((data) => {
				if (Array.isArray(data)) {
					setSessions(data);
					if (data.length) setActiveId(data[0].session_id);
				} else {
					setSessions([]);
				}
			})
			.catch(() => setSessions([]));
	}, [userId, token]);

	// Load messages
	useEffect(() => {
		if (!activeId) return;
		fetch(`${API_BASE_URL}/chat/sessions/${activeId}/messages`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => {
				if (res.status === 404) return null;
				if (!res.ok) throw new Error();
				return res.json();
			})
			.then((data) => {
				if (data === null) return;
				if (Array.isArray(data) && data.length > 0) {
					setMessages(
						data.map((m) => ({
							sender: m.role === "user" ? "user" : "bot",
							text: m.content,
							followupsEnabled: false,
						}))
					);
				}
			})
			.catch(() => {});
	}, [activeId, token]);

	const handleSend = async (userText) => {
		if (!userText || !userText.trim()) return;

		const trimmedText = userText.trim();
		const payload = {
			user_id: userId,
			message: trimmedText,
			session_id: activeId,
			model: "gpt-4.1-mini-2025-04-14",
			temperature: 0.2,
			active_pdf_type: "default",
		};

		setMessages((prev) => [
			...prev,
			{ sender: "user", text: trimmedText },
			{ sender: "bot", type: "loader" },
		]);

		try {
			const res = await fetch(`${API_BASE_URL}/chat/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				let errorMessage = "Sorry, I encountered an error. Please try again.";
				if (res.status === 422) {
					try {
						const errorData = await res.json();
						errorMessage =
							errorData.detail || errorData.message || errorMessage;
					} catch {}
				}
				throw new Error(errorMessage);
			}

			const data = await res.json();

			// If new session, update activeId and session list
			if (!activeId && data.session_id) {
				setActiveId(data.session_id);
				const newSession = {
					session_id: data.session_id,
					title:
						trimmedText.length > 47
							? trimmedText.substring(0, 47) + "..."
							: trimmedText,
					created_at: new Date().toISOString(),
					active_pdf_type: "default",
				};
				setSessions((prev) => [newSession, ...prev]);
			}

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
			setMessages((prev) =>
				prev.map((msg) =>
					msg.type === "loader"
						? {
								sender: "bot",
								text: error.message,
						  }
						: msg
				)
			);
		}
	};

	const handleNewChat = async () => {
		try {
			const res = await fetch(`${API_BASE_URL}/chat/sessions`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					title: "New Chat",
					active_pdf_type: "default",
				}),
			});

			if (!res.ok) throw new Error();

			const newSession = await res.json();
			setSessions((prev) => [newSession, ...prev]);
			setActiveId(newSession.session_id);
			setMessages([
				{
					sender: "bot",
					type: "welcome",
					text: "Hi, I'm CampusBot, your university assistant. How can I help you today?",
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
		} catch {
			alert("Failed to create new chat. Please try again.");
		}
	};

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
