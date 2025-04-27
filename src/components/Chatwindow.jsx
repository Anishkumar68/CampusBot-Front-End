import ChatMessage from "./ChatMessage";
import ChatInput from "./Chatinput";
import { useRef, useEffect, useState } from "react";

export default function ChatWindow({ messages, onQuickSelect, onSend }) {
	const scrollRef = useRef();
	const bottomRef = useRef();
	const [showScrollBtn, setShowScrollBtn] = useState(false);

	// Auto scroll to bottom when new messages arrive
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleScroll = () => {
		if (!scrollRef.current) return;
		const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
		setShowScrollBtn(scrollHeight - scrollTop > clientHeight + 150);
	};

	const scrollToBottom = () => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const handleQuickSelect = (option) => {
		// When user clicks option, behave like user sent that message
		if (onQuickSelect) {
			onQuickSelect(option);
		}
	};

	return (
		<div className="flex flex-col items-center justify-start h-screen bg-gray-100">
			<div className="relative flex flex-col justify-between h-[90vh] w-full max-w-3xl border rounded-lg shadow-md bg-white">
				{/* Message area */}
				<div
					className="flex-1 overflow-auto p-4 rounded-t-lg"
					ref={scrollRef}
					onScroll={handleScroll}
				>
					{messages.map((msg, idx) => (
						<div key={idx}>
							{msg.type === "welcome" ? (
								<div className="flex flex-col items-start w-full gap-2 border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50">
									{/* Bot Avatar + Time */}
									<div className="flex items-center gap-2">
										<img
											src="https://api.dicebear.com/7.x/bottts/svg?seed=bot"
											alt="bot"
											className="w-8 h-8 rounded-full"
										/>
										<span className="text-xs text-gray-500">
											(
											{new Date().toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
											)
										</span>
									</div>

									{/* Welcome Message */}
									<div className="text-black p-4 max-w-full whitespace-pre-wrap border-b-2 border-gray-300 w-full">
										{msg.text}
									</div>

									{/* Quick Select Options */}
									<div className="text-center w-full mt-4">
										<h3 className="text-md font-semibold text-gray-800 mb-3">
											Topics I Can Help With
										</h3>
										<div className="flex flex-col items-center gap-2">
											{msg.options.map((option, i) => (
												<button
													key={i}
													onClick={() => handleQuickSelect(option)}
													className="px-4 py-1 border-2 border-blue-500 text-blue-600 rounded-full hover:bg-blue-100 transition"
												>
													{option}
												</button>
											))}
										</div>
									</div>
								</div>
							) : msg.type === "loader" ? (
								<div className="italic text-sm text-gray-500 my-2">
									Bot is typing...
								</div>
							) : (
								<ChatMessage sender={msg.sender} message={msg.text} />
							)}
						</div>
					))}
					<div ref={bottomRef} />
				</div>

				{/* Scroll Button */}
				{showScrollBtn && (
					<div className="flex justify-center">
						<button
							onClick={scrollToBottom}
							className="absolute bottom-24 right-4 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
						>
							&#8595;
						</button>
					</div>
				)}

				{/* Input Section */}
				<div className="p-2 border-t bg-white rounded-b-lg">
					<ChatInput onSend={onSend} />
				</div>
			</div>
		</div>
	);
}
