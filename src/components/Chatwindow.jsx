import ChatMessage from "./ChatMessage";
import ChatInput from "./Chatinput";
import { useRef, useEffect, useState } from "react";

function ChatWindow({ messages, onQuickSelect, onSend }) {
	const scrollRef = useRef();
	const bottomRef = useRef();
	const [showScrollBtn, setShowScrollBtn] = useState(false);

	// Scroll to bottom when new message is added
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Show scroll button if user scrolls up
	const handleScroll = () => {
		if (!scrollRef.current) return;
		const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
		setShowScrollBtn(scrollHeight - scrollTop > clientHeight + 150); // 150px buffer
	};

	const scrollToBottom = () => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<div className="flex flex-col items-center justify-start h-screen bg-gray-100">
			<div className="relative flex flex-col justify-between h-[90vh] w-full max-w-3xl border rounded-lg shadow-md bg-white">
				{/* Message Area */}
				<div
					className="flex-1 overflow-auto p-4  rounded-t-lg "
					ref={scrollRef}
					onScroll={handleScroll}
				>
					{/* wrapper for autoscroll and scroll down.  */}

					{messages.map((msg, idx) => (
						<div key={idx}>
							{msg.type === "welcome" ? (
								<div className="flex flex-col items-start w-full gap-2 border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50">
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
									<div className=" text-black p-4 max-w-full whitespace-pre-wrap border-b-2 border-gray-300 w-full ">
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
					<div
						className="h-20 w-20 p-2 rounded-full z-20"
						ref={bottomRef}
					></div>
				</div>

				<div className="flex justify-center items-center bg-transparent rounded-b-lg shadow-md">
					{/* Scroll-to-bottom button */}
					{showScrollBtn && (
						<button
							onClick={scrollToBottom}
							className="absolute bottom-20 flex justify-center bg-red-500 transform all ease-in-out .3s items-center w-8 h-8 rounded-full hover:bg-red-800 transition"
							aria-label="Scroll to bottom"
						>
							<span className="text-white text-2xl leading-none">&#x2193;</span>
						</button>
					)}
				</div>
				{/* Input Section */}
				<ChatInput onSend={onSend} />
			</div>
		</div>
	);
}

export default ChatWindow;
