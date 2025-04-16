// Recommanded chat buttons FAQ for user
// Rule base buttons for quick access to common tasks
// load after the chatbot response

export default function QuickButtons({ options = [], onSelect }) {
	return (
		<div className="flex flex-wrap gap-2 mt-2">
			{options.map((option, idx) => (
				<button
					key={idx}
					onClick={() => onSelect(option)}
					className="px-3 py-1 text-sm bg-gray-100 border rounded hover:bg-gray-200"
				>
					{option}
				</button>
			))}
		</div>
	);
}

// This component displays quick buttons for the user to select common tasks or questions. The buttons are styled using Tailwind CSS classes for a clean and modern look. When a button is clicked, it triggers the onSelect function passed as a prop, allowing the parent component to handle the user's selection.
