import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken, saveRefreshToken, getToken } from "../../utils/auth";
import { API_BASE_URL } from "../config"; // Update this import to match your project structure

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // ✅ now works!

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.access_token && data.refresh_token) {
      saveToken(data.access_token);
      saveRefreshToken(data.refresh_token);
      navigate("/"); // ✅ redirect to home page after login
    } else if (data.message) {
      setMsg(data.message); // ✅ show error message
    } else if (data.detail) {
      setMsg(data.detail); // ✅ show error message
    } else {
      setMsg("Login failed"); // ✅ fallback error message
    }

    setLoading(false);
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
        {loading ? (
          <p className="w-full bg-green-600 text-white py-2 rounded text-center">
            Loading...
          </p>
        ) : (
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Login
          </button>
        )}
      </form>
      {msg && <p className="mt-4 text-center text-blue-700">{msg}</p>}
      <div className="mt-4 text-center">
        Don't have an account?{" "}
        <a href="/register" className="text-blue-600 hover:underline">
          Sign up here
        </a>
      </div>
    </div>
  );
}
