import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, removeToken } from "../utils/auth";
import { getUserName } from "../utils/auth";
export default function ChatHeader() {
  const userName = getUserName();
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = getToken();
    setToken(storedToken);
  }, []);

  function handleLogout() {
    removeToken();
    window.location.href = "/login"; // or use `navigate("/login")`
  }

  return (
    <div className="flex justify-end items-center p-4 sticky top-0 w-full ">
      {/* Right side: Login / Logout area */}
      <div className="flex items-center space-x-4">
        {token ? (
          <>
            <span className="text-sm text-gray-600 truncate max-w-[150px] capitalize">
              {userName}
            </span>
            <button
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="text-orange-600 hover:underline text-sm"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="text-orange-600 hover:underline text-sm"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  );
}
