import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/login";
import Signup from "./components/Auth/signup";
import ChatHeader from "./components/ChatHeader";
import ChatWindow from "./components/Chatwindow";
import { sendMessageToBot } from "./services/chatService";
import { getToken } from "./utils/auth";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
	return getToken() ? children : <Navigate to="/login" />;
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

	const handleSend = async (text) => {
		setMessages((prev) => [...prev, { sender: "user", text }]);
		setMessages((prev) => [
			...prev,
			{ sender: "bot", text: "typing...", type: "loader" },
		]);

		const botReply = await sendMessageToBot(text);

		setMessages((prev) =>
			prev
				.filter((m) => m.type !== "loader")
				.concat({ sender: "bot", text: botReply })
		);
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
				{/* <Route path="/" element={<ChatPage />} /> */}

				<Route
					path="/chat"
					element={
						<PrivateRoute>
							<ChatPage />
						</PrivateRoute>
					}
				/>
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
			</Routes>
		</Router>
	);
}

export default App;
