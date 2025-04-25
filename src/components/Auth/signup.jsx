import { useState } from "react";

export default function Signup() {
	const [form, setForm] = useState({ email: "", full_name: "", password: "" });
	const [msg, setMsg] = useState("");

	const handleChange = (e) =>
		setForm({ ...form, [e.target.name]: e.target.value });

	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await fetch("http://localhost:8000/auth/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(form),
		});
		const data = await res.json();
		setMsg(data.message || data.detail || "Registered!");
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
					onChange={handleChange}
				/>
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
					className="w-full bg-blue-600 text-white py-2 rounded"
				>
					Sign Up
				</button>
			</form>
			{msg && <p className="mt-4 text-center text-green-700">{msg}</p>}
		</div>
	);
}
