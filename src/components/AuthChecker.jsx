// components/AuthChecker.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, isTokenExpired, removeToken } from "../utils/auth";
import { refreshAccessToken } from "../services/authService";

export default function AuthChecker() {
	const navigate = useNavigate();

	useEffect(() => {
		async function checkSession() {
			const token = getToken();
			if (!token || isTokenExpired(token)) {
				const refreshed = await refreshAccessToken();
				if (!refreshed) {
					removeToken();
					navigate("/login");
				}
			}
		}
		checkSession();
	}, []);

	return null;
}
