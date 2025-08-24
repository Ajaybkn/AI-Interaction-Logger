// src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import cardApi from "../api/cardApi";
import { Search, Loader2 } from "lucide-react";

// Simple debounce hook
function useDebouncedValue(value, delay = 300) {
	const [debounced, setDebounced] = useState(value);
	useEffect(() => {
		const t = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(t);
	}, [value, delay]);
	return debounced;
}

export default function Navbar() {
	const { user, logout } = useContext(AuthContext);
	const navigate = useNavigate();
	const location = useLocation();
	const [menuOpen, setMenuOpen] = useState(false);

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const isActive = (path) =>
		location.pathname === path || location.pathname.startsWith(path)
			? "bg-white/10 text-white"
			: "text-slate-200 hover:bg-white/10 hover:text-white";

	// Global search state
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebouncedValue(search, 300);
	const [searching, setSearching] = useState(false);
	const [results, setResults] = useState([]); // cards
	const [openResults, setOpenResults] = useState(false);
	const containerRef = useRef(null);

	// Query backend on debounce
	useEffect(() => {
		let ignore = false;
		const run = async () => {
			if (!debouncedSearch.trim()) {
				setResults([]);
				setOpenResults(false);
				return;
			}
			try {
				setSearching(true);
				const data = await cardApi.search(debouncedSearch.trim());
				if (!ignore) {
					setResults(Array.isArray(data) ? data : []);
					setOpenResults(true);
				}
			} catch (e) {
				console.log(e, "Error searching cards");
				if (!ignore) {
					setResults([]);
					setOpenResults(false);
				}
			} finally {
				if (!ignore) setSearching(false);
			}
		};
		run();
		return () => {
			ignore = true;
		};
	}, [debouncedSearch]);

	// Close dropdown on outside click
	useEffect(() => {
		if (!openResults) return;
		const onDocClick = (e) => {
			if (!containerRef.current) return;
			if (!containerRef.current.contains(e.target)) {
				setOpenResults(false);
			}
		};
		document.addEventListener("mousedown", onDocClick);
		return () => document.removeEventListener("mousedown", onDocClick);
	}, [openResults]);

	const onSelectResult = (item) => {
		const boardId = item.board?._id || item.board?.id || item.board;
		const cardId = item._id || item.id;
		if (boardId && cardId) {
			navigate(`/boards/${boardId}?card=${cardId}`);
		} else if (boardId) {
			navigate(`/boards/${boardId}`);
		}
		setOpenResults(false);
	};

	const getListName = (card) => {
		const l = card.list;
		if (!l) return "List";
		return l.title || l.name || "List";
	};

	return (
		<header className="sticky top-0 z-40">
			<nav className="bg-slate-800 text-white border-b border-slate-700/60">
				<div className="mx-auto max-w-7xl px-3 sm:px-4">
					<div className="flex h-12 items-center justify-between gap-2">
						{/* Left: Brand */}
						<Link
							to="/dashboard"
							className="inline-flex items-center rounded px-2 py-1 text-sm font-semibold tracking-wide text-white hover:bg-white/10"
						>
							MyApp
						</Link>

						{/* Center: Links */}
						<div className="hidden md:flex items-center gap-2">
							<Link to="/dashboard" className={`rounded px-3 py-1.5 text-sm ${isActive("/dashboard")}`}>
								Dashboard
							</Link>
							<Link to="/boards" className={`rounded px-3 py-1.5 text-sm ${isActive("/boards")}`}>
								Boards
							</Link>
						</div>

						{/* Right: Global search + user + logout */}
						<div className="hidden md:flex items-center gap-2">
							<div className="relative" ref={containerRef}>
								<div className="w-64">
									<div className="flex items-center gap-2 rounded bg-slate-700/60 px-3 py-1.5 ring-1 ring-inset ring-slate-600/60 focus-within:ring-slate-400/60">
										<Search className="h-4 w-4 text-slate-300" />
										<input
											value={search}
											onChange={(e) => setSearch(e.target.value)}
											placeholder="Search cards"
											className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-300 outline-none"
											onFocus={() => {
												if (results.length > 0) setOpenResults(true);
											}}
										/>
										{searching && <Loader2 className="ml-1 h-4 w-4 animate-spin text-slate-300" />}
									</div>
								</div>

								{/* Results dropdown */}
								{openResults && (
									<div className="absolute right-0 mt-1 w-80 max-w-[80vw] rounded-md border border-slate-700 bg-slate-800 shadow-lg">
										{results.length === 0 ? (
											<div className="px-3 py-2 text-sm text-slate-300">
												{debouncedSearch ? "No results" : "Type to search"}
											</div>
										) : (
											<ul className="max-h-72 overflow-auto py-1">
												{results.map((item) => {
													const key = item._id || item.id;
													const listName = getListName(item);
													return (
														<li key={key}>
															<button
																type="button"
																onClick={() => onSelectResult(item)}
																className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-white/10"
															>
																<span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-indigo-400" />
																<div className="min-w-0">
																	<div className="truncate text-sm text-slate-100">{item.title}</div>
																	<div className="text-xs text-slate-300">in {listName}</div>
																</div>
															</button>
														</li>
													);
												})}
											</ul>
										)}
									</div>
								)}
							</div>

							<div className="flex items-center gap-2 rounded px-2 py-1 text-sm bg-slate-700/50 ring-1 ring-inset ring-slate-600/60">
								<div className="grid h-7 w-7 place-items-center rounded-full bg-indigo-500 text-xs font-semibold">
									{user?.name?.[0]?.toUpperCase() || "U"}
								</div>
								<span className="text-slate-200">Hi, {user?.name}</span>
							</div>
							<button
								onClick={handleLogout}
								className="rounded bg-red-500/90 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
							>
								Logout
							</button>
						</div>

						{/* Mobile menu button */}
						<button
							className="md:hidden inline-flex items-center justify-center rounded p-2 text-slate-200 hover:bg-white/10 hover:text-white"
							aria-label="Toggle menu"
							onClick={() => setMenuOpen((o) => !o)}
						>
							{/* Using a simple hamburger/cross with spans keeps bundle small */}
							<span
								className={`block h-0.5 w-5 bg-current transition ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`}
							/>
							<span className={`block h-0.5 w-5 bg-current my-1 transition ${menuOpen ? "opacity-0" : ""}`} />
							<span
								className={`block h-0.5 w-5 bg-current transition ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`}
							/>
						</button>
					</div>
				</div>

				{/* Mobile menu */}
				{menuOpen && (
					<div className="md:hidden border-t border-slate-700/60 bg-slate-800">
						<div className="mx-auto max-w-7xl px-3 sm:px-4 py-3 space-y-3">
							<div className="flex items-center justify-center gap-3">
								<Link
									to="/dashboard"
									onClick={() => setMenuOpen(false)}
									className={`rounded px-3 py-1.5 text-sm ${isActive("/dashboard")}`}
								>
									Dashboard
								</Link>
								<Link
									to="/boards"
									onClick={() => setMenuOpen(false)}
									className={`rounded px-3 py-1.5 text-sm ${isActive("/boards")}`}
								>
									Boards
								</Link>
							</div>

							{/* Global search for mobile */}
							<div className="pt-1" ref={containerRef}>
								<div className="flex items-center gap-2 rounded bg-slate-700/60 px-3 py-1.5 ring-1 ring-inset ring-slate-600/60 focus-within:ring-slate-400/60">
									<Search className="h-4 w-4 text-slate-300" />
									<input
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										placeholder="Search cards"
										className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-300 outline-none"
										onFocus={() => {
											if (results.length > 0) setOpenResults(true);
										}}
									/>
									{searching && <Loader2 className="ml-1 h-4 w-4 animate-spin text-slate-300" />}
								</div>

								{openResults && (
									<div className="mt-1 w-full rounded-md border border-slate-700 bg-slate-800 shadow-lg">
										{results.length === 0 ? (
											<div className="px-3 py-2 text-sm text-slate-300">
												{debouncedSearch ? "No results" : "Type to search"}
											</div>
										) : (
											<ul className="max-h-72 overflow-auto py-1">
												{results.map((item) => {
													const key = item._id || item.id;
													const listName = getListName(item);
													return (
														<li key={key}>
															<button
																type="button"
																onClick={() => {
																	onSelectResult(item);
																	setMenuOpen(false);
																}}
																className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-white/10"
															>
																<span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-indigo-400" />
																<div className="min-w-0">
																	<div className="truncate text-sm text-slate-100">{item.title}</div>
																	<div className="text-xs text-slate-300">in {listName}</div>
																</div>
															</button>
														</li>
													);
												})}
											</ul>
										)}
									</div>
								)}
							</div>

							<div className="flex items-center justify-between pt-2">
								<div className="flex items-center gap-2">
									<div className="grid h-8 w-8 place-items-center rounded-full bg-indigo-500 text-xs font-semibold">
										{user?.name?.[0]?.toUpperCase() || "U"}
									</div>
									<span className="text-sm text-slate-200">Hi, {user?.name}</span>
								</div>
								<button
									onClick={() => {
										setMenuOpen(false);
										handleLogout();
									}}
									className="rounded bg-red-500/90 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
								>
									Logout
								</button>
							</div>
						</div>
					</div>
				)}
			</nav>
		</header>
	);
}
