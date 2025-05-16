// src/components/QuickButtons.jsx

export default function QuickButtons({
	followups = {},
	followupsEnabled = true,
	msgIndex,
	onQuickSelect,
}) {
	const renderBtn = (text, key, color) => (
		<button
			key={key}
			onClick={() => onQuickSelect(text, msgIndex)}
			className={`px-3 py-1 border-2 ${color} rounded-full transition ${
				!followupsEnabled ? "opacity-50 cursor-not-allowed" : ""
			}`}
			disabled={!followupsEnabled}
		>
			{text}
		</button>
	);

	if (!followups?.rule_based?.length && !followups?.ai_generated?.length)
		return null;

	return (
		<div className="text-center mt-3">
			<h3 className="text-sm font-medium text-gray-700 mb-2">
				Suggested Questions
			</h3>
			<div className="flex flex-wrap justify-center gap-2">
				{followups.rule_based?.map((opt, i) =>
					renderBtn(
						opt,
						`rule-${i}`,
						"border-green-500 text-green-600 hover:bg-green-100"
					)
				)}
				{followups.ai_generated?.map((opt, i) =>
					renderBtn(
						opt,
						`ai-${i}`,
						"border-purple-500 text-purple-600 hover:bg-purple-100"
					)
				)}
			</div>
		</div>
	);
}
