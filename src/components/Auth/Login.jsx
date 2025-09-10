import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken, saveRefreshToken } from "../../utils/auth";
import { API_BASE_URL } from "../config";

export default function Login() {
	const [form, setForm] = useState({ email: "", password: "" });
	const [msg, setMsg] = useState("");
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
		// Clear error message when user starts typing
		if (msg) setMsg("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Basic validation
		if (!form.email || !form.password) {
			setMsg("Please fill in all fields");
			return;
		}

		setLoading(true);
		setMsg(""); // Clear any previous messages

		try {
			const res = await fetch(`${API_BASE_URL}/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});

			const data = await res.json();

			if (data.access_token && data.refresh_token) {
				saveToken(data.access_token);
				saveRefreshToken(data.refresh_token);
				navigate("/");
			} else if (data.message) {
				setMsg(data.message);
			} else if (data.detail) {
				setMsg(data.detail);
			} else {
				setMsg("Login failed");
			}
		} catch (error) {
			setMsg("Network error. Please try again.");
		} finally {
			setLoading(false); // Always reset loading state
		}
	};

	return (
		<div className="max-w-md mx-auto mt-20 p-4 border rounded shadow">
			<h2 className="text-xl font-bold mb-4">Login</h2>
			<form onSubmit={handleSubmit} className="space-y-3">
				<input
					type="email"
					name="email"
					placeholder="Email"
					className="w-full p-2 border rounded"
					onChange={handleChange}
					value={form.email}
					disabled={loading}
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
					className="w-full p-2 border rounded"
					onChange={handleChange}
					value={form.password}
					disabled={loading}
				/>
				<button
					type="submit"
					className={`w-full py-2 rounded text-white ${
						loading
							? "bg-green-400 opacity-50 cursor-not-allowed"
							: "bg-green-600 hover:bg-green-700"
					}`}
					disabled={loading}
				>
					{loading ? "Loading..." : "Login"}
				</button>
			</form>
			{msg && (
				<p
					className={`mt-4 text-center ${
						msg.includes("failed") ||
						msg.includes("error") ||
						msg.includes("fill")
							? "text-red-600"
							: "text-blue-700"
					}`}
				>
					{msg}
				</p>
			)}
			<div className="mt-4 text-center">
				Don't have an account?{" "}
				<a href="/register" className="text-blue-600 hover:underline">
					Sign up here
				</a>
			</div>
		</div>
	);
}
