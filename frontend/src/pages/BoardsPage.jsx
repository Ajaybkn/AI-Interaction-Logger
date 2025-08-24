import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import boardApi from "../api/boardApi";
import AuthContext from "../context/AuthContext";

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
				<button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
					+ Create
				</button>
			</form>

			{/* Board List */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{boards.map((b) => (
					<div
						key={b._id}
						onClick={() => navigate(`/boards/${b._id}`)}
						className="p-4 bg-white shadow rounded cursor-pointer hover:shadow-lg transition"
					>
						<h2 className="font-semibold">{b.name}</h2>
					</div>
				))}
			</div>
		</div>
	);
}
