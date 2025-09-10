import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/chatbotLogo.png";
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
		<div className="flex items-center p-4 z-10 mt-2 mb-2 sticky w-full h-15 justify-between">
			{/* Logo + Title */}
			<div className="flex items-center">
				<img
					src={logo}
					alt="chatbotlogo"
					className="h-auto w-auto max-h-12 max-w-12 object-contain"
				/>
				<div className="text-gray-800 font-bold text-3xl ml-4">CampusBot</div>
			</div>

			{/* Right Side: Auth Buttons */}
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
