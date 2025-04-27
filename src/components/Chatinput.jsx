import { useState } from "react";
import { getToken } from "../utils/auth";

export default function ChatInput({ onSend, chatId }) {
	const [text, setText] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSend = async () => {
		if (!text.trim()) return;

		const token = getToken();
		setLoading(true);

		try {
			const res = await fetch("http://localhost:8000/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...(token && { Authorization: `Bearer ${token}` }),
				},
				body: JSON.stringify({
					message: text,
					chat_id: chatId,
					model: "gpt-4o-mini",
					temperature: 0.7,
				}),
			});

			if (!res.ok) {
				throw new Error("Failed to send message");
			}

			const data = await res.json();

			onSend({
				user: text,
				bot: data.response || "Sorry, no response.",
			});
		} catch (error) {
			console.error("Send message error:", error);
			onSend({
				user: text,
				bot: "Server Error. Try again later.",
			});
		} finally {
			setText(""); // ✅ always clear text
			setLoading(false); // ✅ always reset loading
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
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							handleSend();
						}
					}}
					disabled={loading}
					style={{ maxHeight: "250px" }}
				/>
				{loading && (
					<div className="absolute inset-y-0 right-3 flex items-center">
						<div className="loader border-t-transparent border-blue-500"></div>
					</div>
				)}
			</div>
			<button
				className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
				onClick={handleSend}
				disabled={loading}
			>
				Send
			</button>
		</div>
	);
}
