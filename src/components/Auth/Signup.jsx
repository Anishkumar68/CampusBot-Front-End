import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken, saveRefreshToken } from "../../utils/auth";
import { API_BASE_URL } from "../config";

export default function Signup() {
	const [form, setForm] = useState({ email: "", full_name: "", password: "" });
	const [msg, setMsg] = useState("");
	const navigate = useNavigate();

	const handleChange = (e) =>
		setForm({ ...form, [e.target.name]: e.target.value });

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const res = await fetch(`${API_BASE_URL}/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});
			const data = await res.json();

			if (res.ok && data.access_token && data.refresh_token) {
				saveToken(data.access_token);
				saveRefreshToken(data.refresh_token);
				navigate("/"); // redirect to homepage or dashboard
			} else {
				setMsg(data.message || data.detail || "Signup failed.");
			}
		} catch (err) {
			console.error("Signup error:", err);
			setMsg("Something went wrong. Please try again.");
		}
	};

	return (
		<div className="max-w-md mx-auto mt-20 p-4 border rounded shadow">
			<h2 className="text-xl font-bold mb-4">Create an Account</h2>
			<form onSubmit={handleSubmit} className="space-y-3">
				<input
					type="text"
					name="full_name"
					placeholder="Full Name"
					className="w-full p-2 border rounded"
					value={form.full_name}
					onChange={handleChange}
					required
				/>
				<input
					type="email"
					name="email"
					placeholder="Email"
					className="w-full p-2 border rounded"
					value={form.email}
					onChange={handleChange}
					required
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
					className="w-full p-2 border rounded"
					value={form.password}
					onChange={handleChange}
					required
				/>
				<button
					type="submit"
					className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
				>
					Sign Up
				</button>
			</form>

			{msg && <p className="mt-4 text-center text-green-700">{msg}</p>}

			<div className="mt-4 text-center text-sm">
				Already have an account?{" "}
				<a href="/login" className="text-blue-600 hover:underline">
					Log in here
				</a>
			</div>
		</div>
	);
}
