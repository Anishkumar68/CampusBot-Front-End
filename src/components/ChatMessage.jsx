import React from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { formatBotMessage } from "../utils/ChatFormatter";

const botAvatar = "https://api.dicebear.com/7.x/bottts/svg?seed=bot";
const userAvatar = "https://api.dicebear.com/7.x/thumbs/svg?seed=user";

export default function ChatMessage({ sender, message }) {
	const isUser = sender === "user";

	if (typeof message !== "string") {
		message = JSON.stringify(message);
	}

	const finalMessage = isUser ? message : formatBotMessage(message);

	const html = DOMPurify.sanitize(
		marked.parse(finalMessage, {
			headerIds: false,
			mangle: false,
		})
	);

	if (isUser) {
		return (
			<div className="flex items-start justify-end gap-2 px-4 my-2">
				<div
					className="flex flex-col w-fit text-base p-3 text-start bg-blue-100 text-gray-800 rounded-2xl rounded-br-none whitespace-pre-wrap break-words max-w-2xl"
					dangerouslySetInnerHTML={{ __html: html }}
				/>
				<img
					src={userAvatar}
					alt="User Avatar"
					className="w-8 h-8 rounded-full shadow"
				/>
			</div>
		);
	}

	// BOT message
	return (
		<div className="flex items-start justify-start gap-3 px-4 my-4">
			<img
				src={botAvatar}
				alt="Bot Avatar"
				className="w-9 h-9 rounded-full shadow-sm"
			/>
			<div
				className="markdown-body text-sm leading-7 bg-white border border-gray-300 shadow-sm rounded-xl p-4 max-w-3xl w-full prose prose-gray prose-headings:font-semibold prose-h3:text-lg prose-ul:list-disc prose-li:ml-6 whitespace-pre-wrap break-words"
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</div>
	);
}
