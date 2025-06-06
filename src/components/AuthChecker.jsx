import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getToken, isTokenExpired, removeToken } from "../utils/auth";
import { refreshAccessToken } from "../services/authService";

export default function AuthChecker() {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const shouldProtect = ["/"];
		if (!shouldProtect.includes(location.pathname)) return;

		async function checkSession() {
			const token = getToken();
			if (!token || isTokenExpired()) {
				const refreshed = await refreshAccessToken();
				if (!refreshed) {
					removeToken();
					navigate("/login");
				}
			}
		}

		checkSession();
	}, [location.pathname]);

	return null;
}
