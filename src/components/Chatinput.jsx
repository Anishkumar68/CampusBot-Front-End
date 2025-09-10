import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    const trimmedText = text.trim();
    if (!trimmedText || loading) return;

    onSend(trimmedText); // delegate to ChatPage or parent logic
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (text.trim()) {
        handleSend();
      }
    }
  };

  return (
    <div className="bg-white dark:bg-[#fff] shadow border border-gray-300 rounded-[28px] p-2.5 w-full max-w-full grid grid-cols-[auto_1fr_auto] items-end gap-2">
      {/* Leading section (e.g., Attach button) */}
      <div className="flex items-center">
        <button
          type="button"
          className="flex items-center justify-center h-9 w-9 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
          aria-label="Attach file"
        >
          +
        </button>
      </div>

      {/* Input area */}
      <div className="relative w-full">
        <textarea
          rows={1}
          maxLength={2000}
          className="w-full resize-none overflow-hidden bg-transparent text-sm p-2.5 focus:outline-none placeholder:text-gray-400"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />

        {/* Loading spinner */}
        {loading && (
          <div className="absolute right-2 top-2 flex items-center">
            <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Send Button */}
      <div className="flex items-center">
        <button
          onClick={handleSend}
          disabled={loading || !text.trim()}
          className="h-9 w-9 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          aria-label="Send"
        >
          &#x2191;
        </button>
      </div>
    </div>
  );
}
