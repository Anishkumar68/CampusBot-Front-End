import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";

export default function SidebarItem({
	session,
	isActive,
	onClick,
	onDelete,
	onRename,
}) {
	const [hover, setHover] = useState(false);

	return (
		<div
			onClick={onClick}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			className={`group flex items-center justify-between px-3 py-2 rounded cursor-pointer ${
				isActive ? " text-orange-500" : "hover:bg-gray-700 text-gray-200"
			}`}
		>
			<span className="truncate max-w-[180px]">
				{session.title || "Untitled Chat"}
			</span>
			{hover && (
				<div className="flex gap-1 ml-2">
					<Pencil
						className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer"
						onClick={(e) => {
							e.stopPropagation();
							onRename?.(session.session_id, session.title);
						}}
					/>
					<Trash2
						className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer"
						onClick={(e) => {
							e.stopPropagation();
							onDelete?.(session.session_id);
						}}
					/>
				</div>
			)}
		</div>
	);
}
