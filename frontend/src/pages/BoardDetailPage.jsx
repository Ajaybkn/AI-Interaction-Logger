import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import boardApi from "../api/boardApi";
import listApi from "../api/listApi";
import cardApi from "../api/cardApi";
import { Edit, Trash, Plus } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import CardModal from "../components/cardModal";
import EditCardModal from "../components/EditCardModal";

export default function BoardDetailPage() {
	const { id } = useParams();
	const [board, setBoard] = useState(null);
	const [lists, setLists] = useState([]);
	const [newListName, setNewListName] = useState("");

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

	// Add Card modal state
	const [modalOpen, setModalOpen] = useState(false);
	const [targetListId, setTargetListId] = useState(null);
	const [cardTitle, setCardTitle] = useState("");
	const [cardDescription, setCardDescription] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState("");

	const openAddCardModal = (listId) => {
		setTargetListId(listId);
		setCardTitle("");
		setCardDescription("");
		setSubmitError("");
		setModalOpen(true);
	};
	const closeModal = () => {
		if (submitting) return;
		setModalOpen(false);
		setTargetListId(null);
		setCardTitle("");
		setCardDescription("");
		setSubmitError("");
	};

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

	// Edit Card modal state
	const [editOpen, setEditOpen] = useState(false);
	// const [editListId, setEditListId] = useState(null);
	const [editCardId, setEditCardId] = useState(null);
	const [editTitle, setEditTitle] = useState("");
	const [editDescription, setEditDescription] = useState("");
	const [editSaving, setEditSaving] = useState(false);
	const [editError, setEditError] = useState("");

	const openEdit = (listId, card) => {
		setEditListId(listId);
		setEditCardId(card._id || card.id);
		setEditTitle(card.title || "");
		setEditDescription(card.description || "");
		setEditError("");
		setEditOpen(true);
	};
	const closeEdit = () => {
		if (editSaving) return;
		setEditOpen(false);
		setEditListId(null);
		setEditCardId(null);
		setEditTitle("");
		setEditDescription("");
		setEditError("");
	};
	const saveEdit = async (e) => {
		e?.preventDefault();
		const title = editTitle.trim();
		if (!title) {
			setEditError("Title is required");
			return;
		}
		try {
			setEditSaving(true);
			const updated = await cardApi.update(editCardId, {
				title,
				description: editDescription.trim(),
			});
			setLists((prev) =>
				prev.map((l) => {
					const lid = l._id || l.id;
					if (lid !== editListId) return l;
					return {
						...l,
						cards: (l.cards || []).map((c) =>
							(c._id || c.id) === (updated._id || updated.id) ? { ...c, ...updated } : c
						),
					};
				})
			);
			setEditSaving(false);
			closeEdit();
		} catch (err) {
			setEditSaving(false);
			const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || "Failed to update card";
			setEditError(msg);
		}
	};

	// Delete Card
	const handleDeleteCard = async (listId, cardId) => {
		if (!confirm("Delete this card?")) return;
		const snapshot = lists;
		try {
			setLists((prev) =>
				prev.map((l) => {
					const lid = l._id || l.id;
					if (lid !== listId) return l;
					return {
						...l,
						cards: (l.cards || []).filter((c) => (c._id || c.id) !== cardId),
					};
				})
			);
			await cardApi.remove(cardId);
		} catch (err) {
			console.log(err, "error");

			setLists(snapshot);
		}
	};

	// Edit List modal state
	const [editListOpen, setEditListOpen] = useState(false);
	const [editListId, setEditListId] = useState(null);
	const [editListName, setEditListName] = useState("");
	const [editListSaving, setEditListSaving] = useState(false);
	const [editListError, setEditListError] = useState("");

	const openEditList = (list) => {
		const lid = list._id || list.id;
		setEditListId(lid);
		setEditListName(list.name || "");
		setEditListError("");
		setEditListOpen(true);
	};
	const closeEditList = () => {
		if (editListSaving) return;
		setEditListOpen(false);
		setEditListId(null);
		setEditListName("");
		setEditListError("");
	};
	const saveEditList = async (e) => {
		e?.preventDefault();
		const name = editListName.trim();
		if (!name) {
			setEditListError("List name is required");
			return;
		}
		try {
			setEditListSaving(true);
			const updated = await listApi.update(editListId, { name });
			setLists((prev) =>
				prev.map((l) => ((l._id || l.id) === (updated._id || updated.id) ? { ...l, name: updated.name } : l))
			);
			setEditListSaving(false);
			closeEditList();
		} catch (err) {
			setEditListSaving(false);
			const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || "Failed to update list";
			setEditListError(msg);
		}
	};
	const handleDeleteList = async (listId) => {
		if (!confirm("Delete this list and its cards?")) return;
		const snapshot = lists;
		try {
			setLists((prev) => prev.filter((l) => (l._id || l.id) !== listId));
			await listApi.remove(listId);
		} catch (err) {
			console.log(err, "error");

			setLists(snapshot);
		}
	};

	// DnD helpers
	const reorder = (arr, startIndex, endIndex) => {
		const res = Array.from(arr);
		const [removed] = res.splice(startIndex, 1);
		res.splice(endIndex, 0, removed);
		return res;
	};
	const moveBetween = (sourceCards, destCards, sourceIndex, destIndex) => {
		const src = Array.from(sourceCards);
		const dst = Array.from(destCards);
		const [moved] = src.splice(sourceIndex, 1);
		dst.splice(destIndex, 0, moved);
		return { src, dst, moved };
	};

	const onDragEnd = useCallback(
		async (result) => {
			const { source, destination, draggableId } = result;
			if (!destination) return;

			const sourceListId = source.droppableId;
			const destListId = destination.droppableId;
			const sourceIndex = source.index;
			const destIndex = destination.index;

			const prev = lists;

			try {
				if (sourceListId === destListId) {
					// Reorder within the same list
					setLists((prev) =>
						prev.map((l) => {
							const lid = l._id || l.id;
							if (lid !== sourceListId) return l;
							const cards = l.cards || [];
							return { ...l, cards: reorder(cards, sourceIndex, destIndex) };
						})
					);

					await cardApi.move(draggableId, {
						targetListId: sourceListId,
						newPosition: destIndex,
					});
				} else {
					// Move across lists
					const srcList = lists.find((l) => (l._id || l.id) === sourceListId);
					const dstList = lists.find((l) => (l._id || l.id) === destListId);
					const srcCards = srcList?.cards || [];
					const dstCards = dstList?.cards || [];
					const { src, dst } = moveBetween(srcCards, dstCards, sourceIndex, destIndex);

					setLists((prev) =>
						prev.map((l) => {
							const lid = l._id || l.id;
							if (lid === sourceListId) return { ...l, cards: src };
							if (lid === destListId) return { ...l, cards: dst };
							return l;
						})
					);

					await cardApi.move(draggableId, {
						targetListId: destListId,
						newPosition: destIndex,
					});
				}
			} catch (e) {
				console.error("error", e);
				setLists(prev);
			}
		},
		[lists]
	);

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
				<button
					onClick={handleCreateList}
					className="bg-blue-500 cursor-pointer  text-white px-4 py-2 rounded"
					title="Create New List"
				>
					Add List
				</button>
			</div>

			{/* DnD context */}
			<DragDropContext onDragEnd={onDragEnd}>
				<div className="flex gap-4 overflow-x-auto">
					{lists.length == 0 ? (
						<div className="text-center mx-auto text-lg text-gray-500">No List Found...</div>
					) : (
						lists.map((list) => {
							const listId = list._id || list.id;
							const cards = list.cards || [];
							return (
								<div
									key={listId}
									className="
										bg-white rounded-lg p-4 border border-gray-300 shadow-sm
										flex-1 shrink	
										min-w-[220px] sm:min-w-[260px] md:min-w-[300px]
										"
								>
									<div className="mb-3 flex items-center justify-between">
										<h2 className="font-semibold">{list.name}</h2>
										<div className="flex items-center gap-1">
											<button
												type="button"
												onClick={() => openAddCardModal(listId)}
												className="rounded-md cursor-pointer  border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
												aria-label={`Add card to ${list.name}`}
												title="Add card"
											>
												{/* + Add */}
												<Plus size={10} />
											</button>
											<button
												type="button"
												onClick={() => openEditList(list)}
												className="rounded-md cursor-pointer  border border-gray-300 bg-white px-2 py-1 text-[11px] text-gray-700 hover:bg-gray-100"
												aria-label="Edit list"
												title="Edit list"
											>
												<Edit size={10} color="blue" />
											</button>
											<button
												type="button"
												onClick={() => handleDeleteList(listId)}
												className="rounded-md cursor-pointer  border border-red-300 bg-white px-2 py-1 text-[11px] text-red-600 hover:bg-red-50"
												aria-label="Delete list"
												title="Delete list"
											>
												<Trash size={10} color="red" />
											</button>
										</div>
									</div>

									<Droppable droppableId={String(listId)} type="CARD">
										{(dropProvided, dropSnapshot) => (
											<div
												ref={dropProvided.innerRef}
												{...dropProvided.droppableProps}
												className={`space-y-2 transition-colors ${
													dropSnapshot.isDraggingOver ? "bg-gray-50" : ""
												} cursor-grab`}
											>
												{cards.length > 0 ? (
													cards.map((card, index) => {
														const cardId = card._id || card.id;
														return (
															<Draggable key={cardId} draggableId={String(cardId)} index={index}>
																{(dragProvided, dragSnapshot) => (
																	<div
																		ref={dragProvided.innerRef}
																		title="Drag to reorder or move"
																		{...dragProvided.draggableProps}
																		{...dragProvided.dragHandleProps}
																		className={`rounded-md border border-gray-200 bg-gray-50 p-3 ${
																			dragSnapshot.isDragging ? "shadow-md" : ""
																		}`}
																	>
																		<div className="flex items-start justify-between gap-2">
																			<div className="min-w-0">
																				<p className="text-sm font-medium text-gray-800 break-words">{card.title}</p>
																				{card.description ? (
																					<p className="mt-1 text-xs text-gray-500 break-words">{card.description}</p>
																				) : null}
																			</div>
																			<div className="flex items-center gap-1 shrink-0">
																				<button
																					type="button"
																					onClick={(e) => {
																						e.stopPropagation();
																						openEdit(listId, card);
																					}}
																					className="rounded border border-gray-300 bg-white px-2 py-1 text-[11px] text-gray-700 hover:bg-gray-100"
																					title="Edit card"
																					aria-label="Edit card"
																				>
																					<Edit size={10} color="blue" />
																				</button>
																				<button
																					type="button"
																					onClick={(e) => {
																						e.stopPropagation();
																						handleDeleteCard(listId, cardId);
																					}}
																					className="rounded border border-red-300 bg-white px-2 py-1 text-[11px] text-red-600 hover:bg-red-50"
																					title="Delete card"
																					aria-label="Delete card"
																				>
																					<Trash size={10} color="red" />
																				</button>
																			</div>
																		</div>
																	</div>
																)}
															</Draggable>
														);
													})
												) : (
													<p className="text-sm text-gray-500 italic">No cards yet...</p>
												)}
												{dropProvided.placeholder}
											</div>
										)}
									</Droppable>
								</div>
							);
						})
					)}
				</div>
			</DragDropContext>

			{/* Add Card Modal */}
			<CardModal
				open={modalOpen}
				submitting={submitting}
				submitError={submitError}
				cardTitle={cardTitle}
				cardDescription={cardDescription}
				onClose={closeModal}
				onChangeTitle={(e) => setCardTitle(e.target.value)}
				onChangeDescription={(e) => setCardDescription(e.target.value)}
				onSubmit={submitAddCard}
			/>

			{/* Edit Card Modal */}
			<EditCardModal
				open={editOpen}
				saving={editSaving}
				error={editError}
				title={editTitle}
				description={editDescription}
				onClose={closeEdit}
				onChangeTitle={(e) => setEditTitle(e.target.value)}
				onChangeDescription={(e) => setEditDescription(e.target.value)}
				onSubmit={saveEdit}
			/>

			{/* Edit List Modal  */}
			{editListOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
					<div className="absolute inset-0 bg-black/40" onClick={closeEditList} />
					<div className="relative z-10 w-full max-w-md rounded-lg bg-white p-5 shadow-lg">
						<h3 className="text-lg font-semibold mb-3">Edit List</h3>
						<form onSubmit={saveEditList} className="space-y-3">
							<div>
								<label className="mb-1 block text-sm font-medium text-gray-700">
									Name <span className="text-red-500">*</span>
								</label>
								<input
									autoFocus
									type="text"
									value={editListName}
									onChange={(e) => setEditListName(e.target.value)}
									className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
								/>
							</div>
							{editListError ? <p className="text-sm text-red-600">{editListError}</p> : null}
							<div className="mt-2 flex items-center gap-2">
								<button
									type="submit"
									disabled={editListSaving}
									className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
								>
									{editListSaving ? "Saving..." : "Save"}
								</button>
								<button
									type="button"
									onClick={closeEditList}
									disabled={editListSaving}
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
