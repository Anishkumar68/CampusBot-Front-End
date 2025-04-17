// Input section of user where user can type their message and send it to the chatbot
import { useState } from "react";

export default function ChatInput({ onSend }) {
	const [text, setText] = useState("");

	const handleSubmit = () => {
		if (!text.trim() || text.length > 2000) return;
		onSend(text.trim());
		setText("");
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	return (
		<div className="flex sticky bottom-5 items-center justify-center border px-3 py-2 rounded-xl  bg-white w-full max-w-screen-md h-16 shadow-md mx-auto z-10 ">
			{/* text area for user 2000 text input limit  */}
			{/* we can set limit from maxLength */}
			<textarea
				rows={1}
				maxLength={2000}
				className="flex-1 resize-none overflow-hidden px-3 py-2 w-full  focus:outline-none  text-sm hover:outline-none"
				placeholder="Type your message (max 2000 chars)..."
				value={text}
				onChange={(e) => setText(e.target.value)}
				onKeyDown={handleKeyDown}
				style={{ maxHeight: "100px" }}
			/>

			{/* send button to send the message */}
			<button
				onClick={handleSubmit}
				className="ml-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
			>
				&#x2191;
			</button>
		</div>
	);
}
