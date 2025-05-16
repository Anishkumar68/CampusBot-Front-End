import ChatMessage from "./ChatMessage";
import ChatInput from "./Chatinput";
import QuickButtons from "./QuickButtons";
import { useRef, useEffect, useState } from "react";

export default function ChatWindow({ messages, onQuickSelect, onSend }) {
	const scrollRef = useRef();
	const bottomRef = useRef();
	const [showScrollBtn, setShowScrollBtn] = useState(false);

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

	const handleQuickSelect = (option, index) => {
		if (onQuickSelect) {
			onQuickSelect(option, index);
		}
	};

	return (
		<div className="flex flex-col items-center justify-start h-screen bg-gray-100">
			<div className="relative flex flex-col justify-between h-[90vh] w-full max-w-3xl border rounded-lg shadow-md bg-white">
				{/* Message Area */}
				<div
					ref={scrollRef}
					onScroll={handleScroll}
					className="flex-1 overflow-auto p-4 rounded-t-lg"
				>
					{messages.map((msg, idx) => (
						<div key={idx}>
							{msg.type === "welcome" ? (
								<div className="flex flex-col gap-2 border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50">
									<div className="flex items-center gap-2">
										<img
											src="https://api.dicebear.com/7.x/bottts/svg?seed=bot"
											alt="Bot Avatar"
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

									<div className="text-black p-4 whitespace-pre-wrap border-b-2 border-gray-300 w-full">
										{msg.text}
									</div>

									<div className="text-center w-full mt-4">
										<h3 className="text-md font-semibold text-gray-800 mb-3">
											Topics I Can Help With
										</h3>
										<div className="flex flex-wrap justify-center gap-2">
											{msg.options?.map((option, i) => (
												<button
													key={i}
													onClick={() => handleQuickSelect(option, idx)}
													className="px-4 py-1 border-2 border-blue-500 text-blue-600 rounded-full hover:bg-blue-100 transition"
													disabled={msg.followupsEnabled === false}
												>
													{option}
												</button>
											))}
										</div>
									</div>
								</div>
							) : msg.type === "loader" ? (
								<div className="flex justify-start my-2">
									<div className="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-sm">
										Bot is typing...
									</div>
								</div>
							) : (
								<>
									<ChatMessage
										sender={msg.sender}
										message={
											typeof msg.text === "string"
												? msg.text
												: JSON.stringify(msg.text)
										}
										options={msg.options}
										onQuickSelect={(text) => handleQuickSelect(text, idx)}
									/>
									{msg.sender === "bot" && msg.followups && (
										<QuickButtons
											followups={msg.followups}
											followupsEnabled={msg.followupsEnabled}
											msgIndex={idx}
											onQuickSelect={handleQuickSelect}
										/>
									)}
								</>
							)}
						</div>
					))}
					<div ref={bottomRef} />
				</div>

				{/* Scroll Down Button */}
				{showScrollBtn && (
					<button
						onClick={scrollToBottom}
						className="absolute bottom-24 right-4 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
						aria-label="Scroll to bottom"
					>
						&#8595;
					</button>
				)}

				{/* Input Area */}
				<div className="p-2 border-t bg-white rounded-b-lg">
					<ChatInput onSend={onSend} />
				</div>
			</div>
		</div>
	);
}
