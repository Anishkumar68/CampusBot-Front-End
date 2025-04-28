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

	// ✨ 1. Remove unnecessary extra blank lines
	let cleanedMessage = message.replace(/\n\s*\n/g, "\n\n");

	// ✨ 2. Make anything ending with '?' bold (assume question detection)
	cleanedMessage = cleanedMessage.replace(
		/(^|\n)(.*?\?)\n/g,
		(match, p1, p2) => `${p1}**${p2}**\n`
	);

	// ✨ 3. Convert cleaned Markdown to safe HTML
	const html = DOMPurify.sanitize(marked.parse(cleanedMessage));

	return (
		<div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
			{!isUser && (
				<img
					src={botAvatar}
					alt="Bot Avatar"
					className="w-8 h-8 rounded-full mr-2 self-start"
				/>
			)}

			<div
				className={`max-w-lg whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm shadow-md ${
					isUser
						? "bg-blue-100 text-gray-800 rounded-br-none"
						: "bg-gray-200 text-gray-800 rounded-bl-none"
				} prose prose-sm prose-headings:font-bold`}
				dangerouslySetInnerHTML={{ __html: html }}
			/>

			{isUser && (
				<img
					src={userAvatar}
					alt="User Avatar"
					className="w-8 h-8 rounded-full ml-2 self-start"
				/>
			)}
		</div>
	);
}
