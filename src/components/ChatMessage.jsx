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
					markdown-body prose prose-gray max-w-2xl w-fit text-gray-800
					bg-gray-100 rounded-2xl rounded-tl-none p-3
					whitespace-pre-wrap break-words shadow-sm

					prose-h1:text-3xl prose-h2:text-2xl prose-headings:font-semibold
					prose-p:leading-relaxed prose-p:mb-2
					prose-a:text-blue-600 prose-a:underline
					prose-ul:list-disc prose-ul:pl-5
					prose-ol:list-decimal prose-ol:pl-5
					prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic
					prose-code:bg-gray-200 prose-code:p-1 prose-code:rounded-md prose-code:text-sm
					prose-pre:bg-gray-200 prose-pre:p-3 prose-pre:rounded-md prose-pre:overflow-x-auto prose-pre:whitespace-pre-wrap
					prose-table:table-auto prose-table:divide-y prose-table:divide-gray-300 prose-table:text-sm
					prose-hr:my-4
					prose-img:rounded-lg prose-img:max-w-full
				"
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</div>
	);
}
