import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import boardApi from "../api/boardApi";
import { Plus, FolderKanban } from "lucide-react";

export default function DashboardPage() {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);
	const [boards, setBoards] = useState([]);
	const [creating, setCreating] = useState(false);
	const [newBoardName, setNewBoardName] = useState("");

	useEffect(() => {
		const load = async () => {
			try {
				setLoading(true);
				const bs = await boardApi.getAll();
				setBoards(bs || []);
			} catch (e) {
				console.error("Failed to load dashboard data", e);
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);

	// Only Boards stat remains
	const boardsCount = useMemo(() => boards.length, [boards]);

	const handleQuickCreate = async () => {
		const name = newBoardName.trim();
		if (!name) return;
		try {
			setCreating(true);
			const board = await boardApi.create({ name });
			setBoards((prev) => [...prev, board]);
			setNewBoardName("");
			navigate(`/boards/${board._id || board.id}`);
		} catch (e) {
			console.error("Failed to create board", e);
		} finally {
			setCreating(false);
		}
	};

	// Recent activity
	const recent = useMemo(() => {
		return (boards || [])
			.slice(-5)
			.reverse()
			.map((b) => ({
				id: b._id || b.id,
				text: `Created board “${b.name}”`,
				time: new Date(b.createdAt || b.updatedAt || Date.now()).toLocaleString(),
				boardId: b._id || b.id,
			}));
	}, [boards]);

	return (
		<div className="min-h-screen bg-slate-50">
			<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-3">
						<div className="grid h-12 w-12 place-items-center rounded-full bg-indigo-600 text-white text-lg font-semibold">
							{user?.name?.[0]?.toUpperCase() || "U"}
						</div>
						<div>
							<h1 className="text-xl font-bold text-slate-800">
								{user?.name ? `${user.name},` : "Welcome,"} Welcome to your Dashboard
							</h1>
							<p className="text-sm text-slate-500">Track your boards and jump back into work quickly.</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<input
							type="text"
							value={newBoardName}
							onChange={(e) => setNewBoardName(e.target.value)}
							placeholder="Quick create: New board name"
							className="w-56 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
						/>
						<button
							type="button"
							onClick={handleQuickCreate}
							disabled={creating}
							className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
						>
							<Plus size={16} />
							{creating ? "Creating..." : "Create"}
						</button>
					</div>
				</div>

				{/* Stats section */}
				<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-slate-500">Boards</p>
								<p className="mt-1 text-2xl font-semibold text-slate-800">{boardsCount}</p>
							</div>
							<div className="rounded-lg p-2 text-white bg-gradient-to-br from-indigo-500 to-violet-500">
								<FolderKanban size={22} />
							</div>
						</div>
						<div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
							<div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-slate-200 to-slate-300" />
						</div>
					</div>
				</div>

				{/* Main content */}
				<div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
					{/* Recent activity */}
					<div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
						<div className="mb-3 flex items-center justify-between">
							<h2 className="text-base font-semibold text-slate-800">Recent activity</h2>
							<button
								type="button"
								onClick={() => navigate("/boards")}
								className="text-sm text-indigo-600 hover:underline"
							>
								View all boards
							</button>
						</div>

						{loading ? (
							<div className="space-y-3">
								{[...Array(4)].map((_, i) => (
									<div key={i} className="h-10 rounded-md bg-slate-100 animate-pulse" />
								))}
							</div>
						) : recent.length === 0 ? (
							<p className="text-sm text-slate-500">No recent activity yet.</p>
						) : (
							<ul className="divide-y divide-slate-100">
								{recent.map((item) => (
									<li key={item.id} className="py-3">
										<button
											type="button"
											onClick={() => navigate(`/boards/${item.boardId}`)}
											className="flex w-full cursor-pointer items-start justify-between text-left hover:bg-slate-50 rounded-md px-2 py-1"
										>
											<span className="text-sm text-slate-700">{item.text}</span>
											<span className="text-xs text-slate-400">{item.time}</span>
										</button>
									</li>
								))}
							</ul>
						)}
					</div>

					{/* Quick links / actions */}
					<div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
						<h2 className="mb-3 text-base font-semibold text-slate-800">Quick actions</h2>
						<div className="space-y-2">
							<button
								type="button"
								onClick={() => navigate("/boards")}
								className="w-full cursor-pointer  rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
							>
								Go to Boards
							</button>
							<button
								type="button"
								onClick={() => navigate("/boards")}
								className="w-full cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
							>
								Create or manage boards
							</button>
						</div>

						<div className="mt-4 rounded-lg bg-gradient-to-br from-indigo-50 to-violet-50 p-3 text-sm text-slate-700">
							Pro tip: Use the global search in the top bar to jump to any card across your boards instantly.
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
