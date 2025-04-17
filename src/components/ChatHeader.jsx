// Importing React library for building user interfaces

import React from "react";
import logo from "../assets/logo.png"; // Importing the logo image

export default function ChatHeader() {
	return (
		// Header for the chat application
		// This component displays the title of the chat application

		<div className="flex shadow-md bg-white items-center p-4 z-10 mb-2 sticky w-full h-15">
			<div className="logo-wrapper flex items-center justify-center">
				<img
					src={logo}
					alt="chatbotlogo.png"
					className="h-auto w-auto max-h-12 max-w-12 object-contain"
				/>
			</div>
			<div className="title-wrapper text-gray-800 font-bold text-3xl ml-4">
				CampusBot
			</div>
		</div>
	);
}
