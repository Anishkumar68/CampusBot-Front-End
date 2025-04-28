import { useState } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Login from "./components/Auth/login";
import Signup from "./components/Auth/signup";
import ChatHeader from "./components/ChatHeader";
import ChatWindow from "./components/Chatwindow";
import { getToken, isTokenExpired, removeToken } from "./utils/auth";
import { API_BASE_URL } from "./components/config";

function PrivateRoute({ children }) {
	if (!getToken() || isTokenExpired()) {
		removeToken();
		return <Navigate to="/login" />;
	}
	return children;
}

function ChatPage() {
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
		},
	]);

	// ✅ Corrected handleSend
	const handleSend = async (userText) => {
		// Add User Message first
		setMessages((prev) => [...prev, { sender: "user", text: userText }]);
		// Add loader for bot
		setMessages((prev) => [
			...prev,
			{ sender: "bot", text: "typing...", type: "loader" },
		]);

		try {
			const token = getToken();

			const response = await fetch(`${API_BASE_URL}/chat/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...(token && { Authorization: `Bearer ${token}` }),
				},
				body: JSON.stringify({
					message: userText,
					model: "openai", // You can adjust this if you want to switch model
					temperature: 0.7,
				}),
			});

			const data = await response.json();

			let botText = data?.response || "Sorry, no reply received.";

			// Remove loader and add Bot Message
			setMessages((prev) =>
				prev
					.filter((m) => m.type !== "loader")
					.concat({ sender: "bot", text: botText })
			);
		} catch (error) {
			console.error("Send message error:", error.message);
			setMessages((prev) =>
				prev
					.filter((m) => m.type !== "loader")
					.concat({ sender: "bot", text: "Server Error. Please try again." })
			);
		}
	};

	const handleQuickSelect = (option) => {
		handleSend(option);
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

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route
					path="/"
					element={
						<PrivateRoute>
							<ChatPage />
						</PrivateRoute>
					}
				/>
			</Routes>
		</Router>
	);
}

export default App;
