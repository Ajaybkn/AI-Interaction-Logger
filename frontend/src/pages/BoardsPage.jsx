import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import boardApi from "../api/boardApi";
import AuthContext from "../context/AuthContext";
import { Edit, Trash } from "lucide-react";

export default function BoardsPage() {
	const { user } = useContext(AuthContext);
	const [boards, setBoards] = useState([]);
	const [newBoardName, setNewBoardName] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		boardApi.getAll().then(setBoards);
	}, []);

	const handleCreateBoard = async (e) => {
		e.preventDefault();
		if (!newBoardName.trim()) return;
		const board = await boardApi.create({ name: newBoardName });
		setBoards([...boards, board]);
		setNewBoardName("");
		navigate(`/boards/${board._id}`);
	};
	const handleEditBoard = async (e, board) => {
		e.stopPropagation();
		const currentName = board.name || "";
		const nextName = window.prompt("Rename board:", currentName);
		if (nextName == null) return;
		const trimmed = nextName.trim();
		if (!trimmed || trimmed === currentName) return;

		try {
			const updated = await boardApi.update(board._id || board.id, { name: trimmed });
			setBoards((prev) =>
				prev.map((b) => ((b._id || b.id) === (updated._id || updated.id) ? { ...b, name: updated.name } : b))
			);
		} catch (err) {
			console.error("Failed to update board", err);
		}
	};
	const handleDeleteBoard = async (e, boardId) => {
		e.stopPropagation();
		if (!window.confirm("Delete this board? This action cannot be undone.")) return;

		const snapshot = boards;
		try {
			setBoards((prev) => prev.filter((b) => (b._id || b.id) !== boardId));
			await boardApi.remove(boardId);
		} catch (err) {
			console.error("Failed to delete board:", err);

			setBoards(snapshot);
		}
	};

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">{user.name}’s Boards</h1>

			{/* Create Board */}
			<form onSubmit={handleCreateBoard} className="mb-6 flex gap-2">
				<input
					type="text"
					value={newBoardName}
					onChange={(e) => setNewBoardName(e.target.value)}
					placeholder="New board name"
					className="border rounded px-3 py-2 w-64"
				/>
				<button
					type="submit"
					className="bg-blue-600 cursor-pointer  text-white px-4 py-2 rounded hover:bg-blue-700"
					title="Create New Board"
				>
					+ Create
				</button>
			</form>

			{/* Board List */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{boards.length === 0 && (
					<div className="col-span-full text-center justify-center text-gray-500">
						No boards found. Create your first board!
					</div>
				)}
				{boards.map((b) => {
					const bid = b._id || b.id;
					return (
						<div
							key={bid}
							onClick={() => navigate(`/boards/${bid}`)}
							className="p-4 bg-white shadow rounded cursor-pointer hover:shadow-lg transition"
						>
							<div className="flex items-start justify-between gap-2">
								<h2 className="font-semibold truncate">{b.name}</h2>
								<div className="flex items-center gap-1 shrink-0">
									<button
										type="button"
										onClick={(e) => handleEditBoard(e, b)}
										className="rounded border cursor-pointer  border-gray-300 bg-white px-2 py-1 text-[11px] text-gray-700 hover:bg-gray-100"
										title="Edit board"
										aria-label="Edit board"
									>
										<Edit size={12} color="blue" />
									</button>
									<button
										type="button"
										onClick={(e) => handleDeleteBoard(e, bid)}
										className="rounded border cursor-pointer  border-red-300 bg-white px-2 py-1 text-[11px] text-red-600 hover:bg-red-50"
										title="Delete board"
										aria-label="Delete board"
									>
										<Trash size={12} color="red" />
									</button>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
