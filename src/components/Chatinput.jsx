import { useState } from "react";

export default function ChatInput({ onSend }) {
	const [text, setText] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSend = () => {
		const trimmedText = text.trim();
		if (!trimmedText || loading) return;

		onSend(trimmedText); // delegate to ChatPage or parent logic
		setText("");
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			if (text.trim()) {
				handleSend();
			}
		}
	};

	return (
		<div className="flex flex-col bg-white border-t border-gray-300 rounded-b-lg shadow-md">
			<div className="relative flex flex-col justify-between items-center">
				<textarea
					rows={2}
					maxLength={2000}
					className="w-full p-4 border-none shadow-sm focus:outline-none resize-none"
					placeholder="Type your message..."
					value={text}
					onChange={(e) => setText(e.target.value)}
					onKeyDown={handleKeyDown}
					disabled={loading}
				/>
				{loading && (
					<div className="absolute inset-y-0 right-3 flex items-center">
						<div className="loader border-t-2 border-blue-500 border-solid rounded-full w-4 h-4 animate-spin"></div>
					</div>
				)}
				<button
					onClick={handleSend}
					disabled={loading || !text.trim()}
					className="absolute right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
				>
					&#x2191;
				</button>
			</div>
		</div>
	);
}
