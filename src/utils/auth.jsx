export function saveToken(token) {
	console.log("Saving token:", token);
	localStorage.setItem("token", token);
}

export function getToken() {
	const token = localStorage.getItem("token");
	console.log("getToken() from auth.js:", token);
	return token;
}

export function removeToken() {
	localStorage.removeItem("token");
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

export function getUserId() {
	const payload = decodeToken();
	return payload?.sub ? parseInt(payload.sub) : null;
}
