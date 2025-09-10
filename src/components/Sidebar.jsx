import SidebarItem from "./SidebarItem";
import { Plus } from "lucide-react";
import { API_BASE_URL } from "./config";
import { getToken } from "../utils/auth";
import logo from "../assets/chatbotLogo.png";

export default function Sidebar({
  sessions,
  activeId,
  onSelectSession,
  onNewChat,
  setSessions,
  setActiveId,
}) {
  const handleDeleteSession = async (sessionId) => {
    const token = getToken();
    if (!window.confirm("Are you sure you want to delete this chat?")) return;

    try {
      await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setSessions((prev) => prev.filter((s) => s.session_id !== sessionId));
      if (activeId === sessionId && sessions.length > 1) {
        const next = sessions.find((s) => s.session_id !== sessionId);
        if (next) setActiveId(next.session_id);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleRenameSession = async (sessionId, oldTitle) => {
    const newTitle = prompt("Rename chat:", oldTitle);
    if (!newTitle || newTitle.trim() === "" || newTitle === oldTitle) return;

    const token = getToken();

    try {
      await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle }),
      });

      setSessions((prev) =>
        prev.map((s) =>
          s.session_id === sessionId ? { ...s, title: newTitle } : s
        )
      );
    } catch (err) {
      console.error("Rename error:", err);
    }
  };

  return (
    <div className="w-64 bg-gray-900 text-white  p-4 flex flex-col">
      <div className="flex items-center space-x-3">
        {/* Logo Circle */}
        <div className="bg-white rounded-full h-12 w-12 flex items-center justify-center shadow">
          <img
            src={logo}
            alt="chatbotlogo"
            className="h-8 w-8 object-contain"
          />
        </div>

        {/* Title */}
        <div className="text-white font-bold text-2xl">CampusBot</div>
      </div>

      <h2 className="text-xl font-bold my-4">Chat History</h2>

      <button
        onClick={onNewChat}
        className="mb-4 flex items-center px-3 py-2 bg-orange-500 hover:bg-orange-700 rounded text-sm"
      >
        <Plus className="w-4 h-4 mr-2" />
        New Chat
      </button>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {Array.isArray(sessions) &&
          sessions.map((session) => (
            <SidebarItem
              key={session.session_id || session.id || Math.random()}
              session={session}
              isActive={session.session_id === activeId}
              onClick={() => onSelectSession(session.session_id)}
              onDelete={handleDeleteSession}
              onRename={handleRenameSession}
            />
          ))}
      </div>
    </div>
  );
}
