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
		<div className="flex flex-col border-t border-gray-300 rounded-b-lg shadow-md">
			<div className="flex items-center justify-between rounded-t-lg">
				<div className="relative flex-1">
					{/* Textarea for input */}
					<textarea
						rows={2}
						maxLength={2000}
						className="w-full p-2 border-none shadow-sm focus:outline-none resize-none"
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
				</div>
				<button
					onClick={handleSend}
					disabled={loading || !text.trim()}
					className="px-3 py-2 bg-slate-700 hover:bg-slate-400 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
				>
					&#x2191;
				</button>
			</div>
		</div>
	);
}
