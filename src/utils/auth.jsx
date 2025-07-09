export function saveToken(token) {
	localStorage.setItem("token", token);
}

export function saveRefreshToken(refreshToken) {
	localStorage.setItem("refresh_token", refreshToken);
}

export function getToken() {
	return localStorage.getItem("token");
}

export function getRefreshToken() {
	return localStorage.getItem("refresh_token");
}

export function removeToken() {
	localStorage.removeItem("token");
	localStorage.removeItem("refresh_token");
}

export function decodeToken() {
	const token = getToken();
	if (!token) return null;
	try {
		const payload = JSON.parse(atob(token.split(".")[1]));
		return payload;
	} catch (e) {
		console.error("Token decoding error:", e);
		return null;
	}
}

export function getUserName() {
	const payload = decodeToken();
	return payload?.name || payload?.email || "User";
}

export function getUserId() {
	const payload = decodeToken();
	return payload?.sub ? parseInt(payload.sub) : null;
}

export function isLoggedIn() {
	const token = getToken();
	if (!token) return false;
	const payload = decodeToken();
	if (!payload) return false;
	const currentTime = Math.floor(Date.now() / 1000);
	return payload.exp > currentTime;
}

export function isTokenExpired() {
	const payload = decodeToken();
	if (!payload) return true;
	const currentTime = Math.floor(Date.now() / 1000);
	return payload.exp < currentTime;
}
