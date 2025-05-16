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
			{/* bg-gray-100 */}
			<div
				className="
    markdown-body
    max-w-2xl w-fit
    text-gray-800
    rounded-2xl rounded-tl-none
    whitespace-pre-wrap break-words

   
    prose prose-gray

    /* Headings */
    prose-h1:text-5xl prose-h2:text-5xl
    prose-h1:mt-0 prose-h1:mb-0
    prose-h2:mt-0 prose-h2:mb-0
    prose-headings:font-semibold

    /* Paragraphs */
    prose-p:leading-relaxed prose-p:mb-2

    /* Links */
    prose-a:text-blue-600 prose-a:underline
    prose-a:decoration-2 prose-a:decoration-blue-600
    prose-a:transition prose-a:duration-200 prose-a:ease-in-out

    /* Lists */
    prose-ul:list-disc prose-ul:pl-5
    prose-ol:list-decimal prose-ol:pl-5

    /* Blockquotes */
    prose-blockquote:border-l-4 prose-blockquote:border-gray-300
    prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600

    /* Code */
    prose-code:bg-gray-200 prose-code:p-1 prose-code:rounded-md
    prose-code:text-sm prose-code:font-mono

    /* Preformatted */
    prose-pre:bg-gray-200 prose-pre:p-3 prose-pre:rounded-md
    prose-pre:overflow-x-auto prose-pre:whitespace-pre-wrap
    prose-pre:break-words prose-pre:text-sm prose-pre:font-mono

    /* Tables */
    prose-table:table-auto prose-table:shadow-sm prose-table:rounded-lg
    prose-table:overflow-hidden prose-table:w-full prose-table:text-sm
    prose-table:divide-y-2 prose-table:divide-gray-300

    /* Horizontal rules */
    prose-hr:my-2

    /* Images */
    prose-img:rounded-lg prose-img:max-w-full prose-img:shadow-sm

    overflow-x-auto
  "
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</div>
	);
}
