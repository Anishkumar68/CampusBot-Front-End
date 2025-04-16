import ChatMessage from "./ChatMessage";
import ChatInput from "./Chatinput";
import { useEffect, useRef } from "react";

function ChatWindow({ messages, onQuickSelect, onSend }) {
	const bottomRef = useRef();

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<div className="flex flex-col items-center justify-start h-screen bg-gray-100">
			<div className="flex flex-col justify-between h-[90vh] w-full max-w-xl border rounded-lg shadow-md bg-white">
				{/* Message Area */}
				<div className="flex-1 overflow-auto p-4  rounded-t-lg ">
					{messages.map((msg, idx) => (
						<div key={idx}>
							{msg.type === "welcome" ? (
								<div className="flex flex-col items-start gap-2 border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50">
									{/* Avatar + Timestamp */}
									<div className="flex items-center gap-2">
										<img
											src="https://api.dicebear.com/7.x/bottts/svg?seed=bot"
											className="w-8 h-8 rounded-full"
											alt="bot"
										/>
										<span className="text-xs">
											(
											{new Date().toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
											)
										</span>
									</div>

									{/* Welcome Message */}
									<div className=" text-black p-4 max-w-lg whitespace-pre-wrap border-b-2 border-gray-300">
										{msg.text}
									</div>

									{/* Help Buttons */}
									<div className="text-center w-full mt-4">
										<h3 className="text-md font-semibold text-gray-800 mb-3 ">
											Topics I Can Help With
										</h3>
										<div className="flex flex-col items-center gap-2">
											{msg.options.map((option, i) => (
												<button
													key={i}
													onClick={() => onQuickSelect(option)}
													className="px-4 py-1 border-2 border-red-500 text-red-600 rounded-full hover:bg-red-100 transition"
												>
													{option}
												</button>
											))}
										</div>
									</div>
								</div>
							) : msg.type === "loader" ? (
								<div className="italic text-sm text-gray-500">
									Bot is typing...
								</div>
							) : (
								<ChatMessage sender={msg.sender} message={msg.text} />
							)}
						</div>
					))}
					<div ref={bottomRef} />
				</div>

				{/* Input Section */}
				<ChatInput onSend={onSend} />
			</div>
		</div>
	);
}

export default ChatWindow;
