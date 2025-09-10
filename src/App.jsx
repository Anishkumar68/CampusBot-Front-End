import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ChatPage from "./components/ChatPage";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import AuthChecker from "./components/AuthChecker";

import "./index.css";

export default function App() {
  return (
    <Router>
      <AuthChecker /> {/* Runs inside Router context */}
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
      </Routes>
    </Router>
  );
}
