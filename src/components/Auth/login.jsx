import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ uncomment this
import { saveToken } from "../../utils/auth";

export default function Login() {
	const [form, setForm] = useState({ email: "", password: "" });
	const [msg, setMsg] = useState("");

	const navigate = useNavigate(); // ✅ now works!

	const handleChange = (e) =>
		setForm({ ...form, [e.target.name]: e.target.value });

	const handleSubmit = async (e) => {
		e.preventDefault();

		const res = await fetch("http://localhost:8000/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(form),
		});

		const data = await res.json();

		if (data.access_token) {
			saveToken(data.access_token);
			setMsg("Login successful ✅");

			setTimeout(() => {
				navigate("/chat"); // ✅ redirect works
			}, 500);
		} else {
			setMsg(data.detail || "Login failed");
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
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
					className="w-full p-2 border rounded"
					onChange={handleChange}
				/>
				<button
					type="submit"
					className="w-full bg-green-600 text-white py-2 rounded"
				>
					Login
				</button>
			</form>
			{msg && <p className="mt-4 text-center text-blue-700">{msg}</p>}
		</div>
	);
}
