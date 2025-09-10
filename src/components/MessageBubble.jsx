import clsx from "clsx";

export default function MessageBubble({ sender, html, avatar }) {
	return (
		<div
			className={clsx(
				"flex items-start gap-3 px-4 my-4",
				sender === "user" && "justify-end"
			)}
		>
			{sender === "bot" && (
				<img
					src={avatar}
					alt="Bot Avatar"
					className="w-9 h-9 rounded-full shadow-sm"
				/>
			)}

			<div
				className={clsx(
					"flex flex-col w-fit max-w-2xl p-4 text-base whitespace-pre-wrap break-words shadow-md border",
					sender === "bot"
						? "bg-white text-black border-gray-300 rounded-2xl rounded-bl-none prose prose-sm prose-gray prose-a:text-orange-600 hover:prose-a:underline"
						: "bg-orange-600 text-white border-orange-500 rounded-2xl rounded-br-none"
				)}
				dangerouslySetInnerHTML={{ __html: html }}
			/>

			{sender === "user" && (
				<img
					src={avatar}
					alt="User Avatar"
					className="w-9 h-9 rounded-full shadow-sm"
				/>
			)}
		</div>
	);
}
