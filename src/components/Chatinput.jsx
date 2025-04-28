import { useState } from "react";
import { getToken } from "../utils/auth";
import { API_BASE_URL } from "./config";

export default function ChatInput({ onSend, chatId }) {
	const [text, setText] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSend = async () => {
		const trimmedText = text.trim();
		if (!trimmedText) return;

		setLoading(true);

		try {
			const token = getToken();

			const response = await fetch(`${API_BASE_URL}/chat/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...(token && { Authorization: `Bearer ${token}` }),
				},
				body: JSON.stringify({
					message: trimmedText,
					chat_id: chatId || null,
					model: "openai",
					temperature: 0.7,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				console.error("Server Error:", data);
				throw new Error(data.detail?.[0]?.msg || "Failed to fetch response.");
			}

			// ✅ send two separate texts
			onSend(trimmedText, data?.response || "Sorry, no reply received.");
		} catch (error) {
			console.error("Send message error:", error.message);
			onSend(
				trimmedText,
				error.message || "Server Error. Please try again later."
			);
		} finally {
			setText("");
			setLoading(false);
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<div className="flex gap-2 p-2 border-t mt-auto items-center">
			<div className="relative flex-1">
				<textarea
					rows={1}
					maxLength={2000}
					className="w-full resize-none overflow-hidden px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
					placeholder="Type your message..."
					value={text}
					onChange={(e) => setText(e.target.value)}
					onKeyDown={handleKeyDown}
					disabled={loading}
					style={{ maxHeight: "250px" }}
				/>
				{loading && (
					<div className="absolute inset-y-0 right-3 flex items-center">
						<div className="loader border-t-2 border-blue-500 border-solid rounded-full w-4 h-4 animate-spin"></div>
					</div>
				)}
			</div>

			<button
				onClick={handleSend}
				disabled={loading}
				className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
			>
				Send
			</button>
		</div>
	);
}
