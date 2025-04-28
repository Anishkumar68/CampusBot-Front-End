import React from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

const botAvatar = "https://api.dicebear.com/7.x/bottts/svg?seed=bot";
const userAvatar = "https://api.dicebear.com/7.x/thumbs/svg?seed=user";

export default function ChatMessage({ sender, message }) {
	const isUser = sender === "user";

	if (typeof message !== "string") {
		message = JSON.stringify(message);
	}

	// Clean extra new lines
	const cleanedMessage = message.replace(/\n\s*\n/g, "\n");

	// Convert Markdown to safe HTML
	const html = DOMPurify.sanitize(marked.parse(cleanedMessage));

	return (
		<div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
			{!isUser && (
				<img
					src={botAvatar}
					alt="Bot Avatar"
					className="w-8 h-8 rounded-full mr-2"
				/>
			)}

			<div
				className={`p-3 text-sm shadow-md ${
					isUser
						? "bg-gray-300 text-black rounded-full max-w-xs"
						: "bg-gray-100 text-gray-900 border border-gray-300 rounded-lg max-w-2xl prose prose-sm"
				}`}
				dangerouslySetInnerHTML={{ __html: html }}
			/>

			{isUser && (
				<img
					src={userAvatar}
					alt="User Avatar"
					className="w-8 h-8 rounded-full ml-2"
				/>
			)}
		</div>
	);
}
