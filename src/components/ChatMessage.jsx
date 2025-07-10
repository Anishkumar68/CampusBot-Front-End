import React from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { formatBotMessage } from "../utils/ChatFormatter";

const botAvatar = "https://api.dicebear.com/7.x/bottts/svg?seed=bot";
const userAvatar = "https://api.dicebear.com/7.x/thumbs/svg?seed=user";

export default function ChatMessage({ sender, message }) {
	const isUser = sender === "user";

	const rawText =
		typeof message === "string" ? message : JSON.stringify(message);
	const formatted = isUser ? rawText : formatBotMessage(rawText);

	const html = DOMPurify.sanitize(
		marked.parse(formatted, {
			headerIds: false,
			mangle: false,
		})
	);

	if (isUser) {
		return (
			<div className="flex items-start justify-end gap-2 px-4 my-2">
				<div
					className="flex flex-col w-fit max-w-2xl p-3 text-base bg-blue-100 text-gray-800 rounded-2xl rounded-br-none whitespace-pre-wrap break-words"
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
				className="
				flex flex-col w-fit max-w-2xl p-4 text-base  text-black
    rounded-2xl rounded-bl-none whitespace-pre-wrap break-words shadow-md border border-gray-300

    prose prose-sm prose-gray
    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
    prose-headings:font-semibold prose-headings:text-gray-900 prose-headings:my-0
    prose-p:my-0 prose-p:leading-relaxed
    prose-ul:my-0 prose-ol:my-0 prose-li:my-0 prose-li:leading-relaxed
    prose-blockquote:my-0 prose-hr:my-0
    prose-pre:my-0 prose-pre:bg-gray-800 prose-pre:rounded prose-pre:overflow-x-auto prose-pre:font-mono prose-pre:text-sm
    cursor-text
	target-blank:prose-a:text-blue-600 target-blank:prose-a:no-underline target-blank:prose-a:hover:underline
				"
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</div>
	);
}

// import MessageBubble from "./MessageBubble";
// import { marked } from "marked"; // optional for markdown to HTML

// function ChatWindow({ messages }) {
// 	const botAvatar = "../assets/chatbotLogo.png";
// 	const userAvatar = "https://api.dicebear.com/7.x/thumbs/svg?seed=user";

// 	return (
// 		<div className="overflow-y-auto px-4 py-6">
// 			{messages.map((msg, index) => (
// 				<MessageBubble
// 					key={index}
// 					sender={msg.sender}
// 					avatar={msg.sender === "bot" ? botAvatar : userAvatar}
// 					html={marked.parse(msg.text)} // or just msg.text if already HTML
// 				/>
// 			))}
// 		</div>
// 	);
// }
