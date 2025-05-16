export default function QuickButtons({
	followups = {},
	followupsEnabled = true,
	msgIndex,
	onQuickSelect,
}) {
	// Utility to render a single button
	const renderBtn = (text, key, colorClass) => (
		<button
			key={key}
			onClick={() => onQuickSelect(text, msgIndex)}
			className={`px-3 py-1 border-2 ${colorClass} rounded-full transition text-sm
				${!followupsEnabled ? "opacity-50 cursor-not-allowed" : ""}
			`}
			disabled={!followupsEnabled}
		>
			{text}
		</button>
	);

	const hasButtons =
		(followups.rule_based && followups.rule_based.length > 0) ||
		(followups.ai_generated && followups.ai_generated.length > 0);

	if (!hasButtons) return null;

	return (
		<div className="text-center mt-4">
			<h3 className="text-sm font-semibold text-gray-700 mb-2">
				Suggested Questions
			</h3>

			<div className="flex flex-wrap justify-center gap-2">
				{followups.rule_based?.map((text, i) =>
					renderBtn(
						text,
						`rule-${i}`,
						"border-green-500 text-green-600 hover:bg-green-100"
					)
				)}

				{followups.ai_generated?.map((text, i) =>
					renderBtn(
						text,
						`ai-${i}`,
						"border-purple-500 text-purple-600 hover:bg-purple-100"
					)
				)}
			</div>
		</div>
	);
}
