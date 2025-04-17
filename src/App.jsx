// BuckeyeUI/src/App.jsx
import { useState } from "react";
import ChatHeader from "./components/Chatheader";
import ChatWindow from "./components/Chatwindow";

function App() {
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

	// Function to handle the sending of messages
	const handleSend = (text) => {
		setMessages((prev) => [...prev, { sender: "user", text }]);

		// Simulated bot response with quick buttons
		setTimeout(() => {
			setMessages((prev) => [
				...prev,
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
		}, 500);
	};

	// Function to handle quick button selection
	// This function is called when a quick button is selected
	// It sends the selected option as a message
	// and updates the chat messages accordingly
	// It simulates a bot response after a short delay
	// In a real application, this would be replaced with an API call
	// to get the bot's response based on the selected option
	// It updates the chat messages with the user's selection
	// and the bot's response
	// It also clears the quick buttons after selection
	const handleQuickSelect = (option) => {
		handleSend(option); // Treat quick button like user input
	};

	return (
		<>
			<div className="bg-gray-100 h-[100vh] flex flex-col justify-between">
				<ChatHeader> </ChatHeader>
				<ChatWindow
					messages={messages}
					onQuickSelect={handleQuickSelect}
					onSend={handleSend}
				/>

				{/* let it be don't remove for till the end of project */}
				{/* <QuickButtons onSelect={handleQuickSelect} /> */}
			</div>
		</>
	);
}

export default App;

// This is the main component of the chatbot application. It manages the state of the chat messages and handles user input. The component includes a header, a chat window for displaying messages, quick buttons for predefined responses, and an input field for user messages. The handleSend function updates the chat messages when the user sends a message, and the handleQuickSelect function allows users to select predefined options from the quick buttons.
