// utils/ChatFormatter.js
export function formatBotMessage(rawMessage) {
	let message =
		typeof rawMessage === "string" ? rawMessage : JSON.stringify(rawMessage);

	// Fix bold syntax
	message = message.replace(/\*\*(.*?)\*\*/g, "**$1**");

	// Insert heading & separator for "Year 1:" pattern
	message = message.replace(/(?<!^)Year (\d):/g, "\n\n---\n\n### Year $1");

	// Add styled tags or emoji labels
	message = message.replace(
		/\*Fall Semester\*/gi,
		'<span class="tag-fall">🍁 Fall Semester</span>'
	);
	message = message.replace(
		/\*Spring Semester\*/gi,
		'<span class="tag-spring">🌸 Spring Semester</span>'
	);

	// Fix lists (ensure new line before dash)
	message = message.replace(/([^\n])\n- /g, "$1\n\n- ");

	// Limit to 2 max consecutive newlines
	message = message.replace(/\n{3,}/g, "\n\n");

	return message.trim();
}
