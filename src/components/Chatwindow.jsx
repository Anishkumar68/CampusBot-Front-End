import ChatMessage from "./ChatMessage";
import ChatInput from "./Chatinput";
import QuickButtons from "./QuickButtons";
import logo from "../assets/chatbotLogo.png";

// import { useRef, useEffect, useState } from "react";

export default function ChatWindow({ messages, onQuickSelect, onSend }) {
  // const scrollRef = useRef();
  // const bottomRef = useRef();
  // const [showScrollBtn, setShowScrollBtn] = useState(false);

  // useEffect(() => {
  //   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  // const handleScroll = () => {
  //   if (!scrollRef.current) return;
  //   const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
  //   setShowScrollBtn(scrollHeight - scrollTop > clientHeight + 150);
  // };

  // const scrollToBottom = () => {
  //   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  const handleQuickSelect = (option, index) => {
    if (onQuickSelect) {
      onQuickSelect(option, index);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start h-screen bg-gray-100 ">
      <div className="relative flex flex-col justify-between h-[90vh] w-full top-0 max-w-3xl ">
        {/* Message Area */}
        {/* <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 p-4 rounded-t-sm"
        > */}
          {messages.map((msg, idx) => (
            <div key={idx}>
              {msg.type === "welcome" ? (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={logo}
                      alt="Bot Avatar"
                      className="justify-center"
                    />
                    <h2 className="text-[60px] font-semibold mt-[-15px] text-gray-800">
                      CampusBot
                    </h2>
                  </div>

                  <div className="text-center w-full mt-4">
                    <div className="flex flex-wrap mt-[-4px] justify-center gap-2">
                      {msg.options?.map((option, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickSelect(option, idx)}
                          className={`px-4 py-1 border-2 border-orange-500 rounded-md hover:text-black hover:bg-orange-200 transition ${
                            msg.followupsEnabled === false
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
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
                  {/* Auto-scroll when loader appears */}
                  {/* {scrollToBottom()} */}
                </div>
              ) : (
                <>
                  <ChatMessage
                    sender={msg.sender}
                    message={msg.text}
                    followups={msg.followups}
                    followupsEnabled={msg.followupsEnabled}
                    msgIndex={idx}
                    onQuickSelect={handleQuickSelect}
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
          {/* <div ref={bottomRef} /> */}
        </div>

        {/* Scroll Down Button */}
        {/* {showScrollBtn && (
          <div className="absolute bottom-24 right-4">
          <button
            onClick={scrollToBottom}
            className="bg-orange-600 text-white px-4 py-3 rounded-full hover:bg-orange-700 transition"
            aria-label="Scroll to bottom"
          >
            &#8595;
          </button>
          </div>
        )} */}

        {/* Input Area */}
        <div className="flex-shrink-0 sticky bottom-0 bg-gray-100 pt-2 pb-4 justify-center items-center">
          <ChatInput onSend={onSend} />
        </div>
      {/* </div> */}
    </div>
  );
}
