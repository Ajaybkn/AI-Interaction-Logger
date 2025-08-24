// src/pages/BoardDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import boardApi from "../api/boardApi";
import listApi from "../api/listApi";
import cardApi from "../api/cardApi";

export default function BoardDetailPage() {
	const { id } = useParams(); // boardId from route
	const [board, setBoard] = useState(null);
	const [lists, setLists] = useState([]);
	const [newListName, setNewListName] = useState("");

	// modal state
	const [modalOpen, setModalOpen] = useState(false);
	const [targetListId, setTargetListId] = useState(null);
	const [cardTitle, setCardTitle] = useState("");
	const [cardDescription, setCardDescription] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState("");

	// fetch board + lists
	useEffect(() => {
		const fetchData = async () => {
			try {
				const b = await boardApi.getOne(id);
				setBoard(b);
				const l = await listApi.getByBoard(id);
				setLists(l);
			} catch (err) {
				console.error("Error loading board:", err);
			}
		};
		fetchData();
	}, [id]);

	const handleCreateList = async () => {
		if (!newListName.trim()) return;
		try {
			const newList = await listApi.create({ name: newListName, boardId: id });
			setLists((prev) => [...prev, newList]);
			setNewListName("");
		} catch (err) {
			console.error("Error creating list:", err);
		}
	};

	// Open/close modal
	const openAddCardModal = (listId) => {
		setTargetListId(listId);
		setCardTitle("");
		setCardDescription("");
		setSubmitError("");
		setModalOpen(true);
	};

	const closeModal = () => {
		if (submitting) return; // avoid closing while submitting
		setModalOpen(false);
		setTargetListId(null);
		setCardTitle("");
		setCardDescription("");
		setSubmitError("");
	};

	// Submit to API
	const submitAddCard = async (e) => {
		e?.preventDefault();
		if (!cardTitle.trim() || !targetListId) {
			setSubmitError("Title is required");
			return;
		}
		try {
			setSubmitting(true);
			setSubmitError("");
			const created = await cardApi.create({
				title: cardTitle.trim(),
				description: cardDescription.trim(),
				listId: targetListId,
			});

			// Update the list in-place
			setLists((prev) =>
				prev.map((l) =>
					l.id === targetListId || l._id === targetListId ? { ...l, cards: [...(l.cards || []), created] } : l
				)
			);

			setSubmitting(false);
			closeModal();
		} catch (err) {
			setSubmitting(false);
			const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || "Failed to create card";
			setSubmitError(msg);
		}
	};

	// Keyboard close for modal (Esc)
	useEffect(() => {
		if (!modalOpen) return;
		const onKey = (e) => {
			if (e.key === "Escape") closeModal();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [modalOpen]);

	if (!board) return <p>Loading...</p>;

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">{board.name}</h1>

			{/* create list */}
			<div className="flex gap-2 mb-4">
				<input
					type="text"
					placeholder="New list name"
					className="border p-2 rounded w-64"
					value={newListName}
					onChange={(e) => setNewListName(e.target.value)}
				/>
				<button onClick={handleCreateList} className="bg-blue-500 text-white px-4 py-2 rounded">
					Add List
				</button>
			</div>

			{/* lists display */}
			<div className="flex gap-4 overflow-x-auto">
				{lists.map((list) => (
					<div
						key={list.id || list._id}
						className="
              bg-white rounded-lg p-4 border border-gray-300 shadow-sm
              flex-1 shrink
              min-w-[220px] sm:min-w-[260px] md:min-w-[300px]
            "
					>
						<div className="mb-3 flex items-center justify-between">
							<h2 className="font-semibold">{list.name}</h2>
							<button
								type="button"
								onClick={() => openAddCardModal(list.id || list._id)}
								className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
								aria-label={`Add card to ${list.name}`}
								title="Add card"
							>
								+ Add
							</button>
						</div>

						<div className="space-y-2">
							{list.cards && list.cards.length > 0 ? (
								list.cards.map((card) => (
									<div key={card.id || card._id} className="rounded-md border border-gray-200 bg-gray-50 p-3">
										<p className="text-sm text-gray-800">{card.title}</p>
										{card.description ? <p className="mt-1 text-xs text-gray-500">{card.description}</p> : null}
									</div>
								))
							) : (
								<p className="text-sm text-gray-500 italic">No cards yet...</p>
							)}
						</div>
					</div>
				))}
			</div>

			{/* Modal */}
			{modalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
					{/* Backdrop */}
					<div className="absolute inset-0 bg-black/40" onClick={closeModal} />
					{/* Dialog */}
					<div className="relative z-10 w-full max-w-md rounded-lg bg-white p-5 shadow-lg">
						<h3 className="text-lg font-semibold mb-3">Add Card</h3>
						<form onSubmit={submitAddCard} className="space-y-3">
							<div>
								<label className="mb-1 block text-sm font-medium text-gray-700">
									Title <span className="text-red-500">*</span>
								</label>
								<input
									autoFocus
									type="text"
									value={cardTitle}
									onChange={(e) => setCardTitle(e.target.value)}
									placeholder="Enter card title"
									className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
								/>
							</div>
							<div>
								<label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
								<textarea
									value={cardDescription}
									onChange={(e) => setCardDescription(e.target.value)}
									placeholder="Optional description"
									rows={3}
									className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
								/>
							</div>

							{submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}

							<div className="mt-2 flex items-center gap-2">
								<button
									type="submit"
									disabled={submitting}
									className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
								>
									{submitting ? "Adding..." : "Add Card"}
								</button>
								<button
									type="button"
									onClick={closeModal}
									disabled={submitting}
									className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60"
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
