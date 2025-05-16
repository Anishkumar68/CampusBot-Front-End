import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import ChatPage from "./components/ChatPage";
import Login from "./components/Auth/login";
import Signup from "./components/Auth/Signup";
// import Profile from "./components/Profile"; // Uncomment if you have a Profile component

function App() {
	return (
		<Router>
			<div className="App">
				<Routes>
					<Route path="/" element={<ChatPage />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Signup />} />
					{/* <Route path="/profile" element={<Profile />} /> */}
				</Routes>
			</div>
		</Router>
	);
}

export default App;
