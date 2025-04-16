import React from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

// Optional: Replace with your own avatar URLs
const botAvatar = "https://api.dicebear.com/7.x/bottts/svg?seed=bot";
const userAvatar = "https://api.dicebear.com/7.x/thumbs/svg?seed=user";

export default function ChatMessage({ sender, message }) {
	const isUser = sender === "user";

	// Convert markdown to safe HTML
	const html = DOMPurify.sanitize(marked.parse(message));

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
				className={`max-w-xs whitespace-pre-wraprounded-lg min-w-fit p-3 text-sm rounded shadow-md prose prose-sm ${
					isUser
						? "bg-gray-300  text-black rounded-full"
						: "w-fit min-w-fit text-gray-900 border-b-2 border-gray-300 bg-gray-200"
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
