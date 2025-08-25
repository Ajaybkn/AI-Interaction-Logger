import asyncHandler from "express-async-handler";
import Card from "../models/Card.js";
import List from "../models/List.js";
import Board from "../models/Board.js";

//     Create a new card | POST /api/cards |  Private

export const createCard = asyncHandler(async (req, res) => {
	const { title, description, listId } = req.body;

	if (!title || !listId) {
		res.status(400);
		throw new Error("Title and listId are required");
	}

	const list = await List.findById(listId);
	if (!list) {
		res.status(404);
		throw new Error("List not found");
	}

	const board = await Board.findById(list.board);
	if (!board.members.includes(req.user._id)) {
		res.status(403);
		throw new Error("Not authorized to add card to this board");
	}

	const cardCount = await Card.countDocuments({ list: listId });

	const card = await Card.create({
		title,
		description,
		list: listId,
		board: list.board,
		position: cardCount,
	});

	res.status(201).json(card);
});

//  Get all cards in a list |  GET /api/cards/:listId | Private

export const getCardsByList = asyncHandler(async (req, res) => {
	const list = await List.findById(req.params.listId);
	if (!list) {
		res.status(404);
		throw new Error("List not found");
	}

	const board = await Board.findById(list.board);
	if (!board.members.includes(req.user._id)) {
		res.status(403);
		throw new Error("Not authorized to view cards");
	}

	const cards = await Card.find({ list: req.params.listId }).sort("position");
	res.json(cards);
});

// Update card | PUT /api/cards/:id | Private

export const updateCard = asyncHandler(async (req, res) => {
	const card = await Card.findById(req.params.id);
	if (!card) {
		res.status(404);
		throw new Error("Card not found");
	}

	const board = await Board.findById(card.board);
	if (!board.members.includes(req.user._id)) {
		res.status(403);
		throw new Error("Not authorized");
	}

	card.title = req.body.title || card.title;
	card.description = req.body.description || card.description;
	card.labels = req.body.labels || card.labels;
	card.dueDate = req.body.dueDate || card.dueDate;
	card.assignedTo = req.body.assignedTo || card.assignedTo;

	const updatedCard = await card.save();
	res.json(updatedCard);
});

//  Move card between lists | PATCH /api/cards/:id/move | Private

export const moveCard = asyncHandler(async (req, res) => {
	const { targetListId, newPosition } = req.body;
	const card = await Card.findById(req.params.id);

	if (!card) {
		res.status(404);
		throw new Error("Card not found");
	}

	const board = await Board.findById(card.board);
	if (!board.members.includes(req.user._id)) {
		res.status(403);
		throw new Error("Not authorized");
	}

	const targetList = await List.findById(targetListId);
	if (!targetList) {
		res.status(404);
		throw new Error("Target list not found");
	}

	card.list = targetListId;
	if (newPosition !== undefined) card.position = newPosition;

	const movedCard = await card.save();
	res.json(movedCard);
});

//  Delete card | DELETE /api/cards/:id | Private

export const deleteCard = asyncHandler(async (req, res) => {
	const card = await Card.findById(req.params.id);
	if (!card) {
		res.status(404);
		throw new Error("Card not found");
	}

	const board = await Board.findById(card.board);
	if (!board.members.includes(req.user._id)) {
		res.status(403);
		throw new Error("Not authorized");
	}

	await card.deleteOne();
	res.json({ message: "Card removed" });
});

export const searchCards = asyncHandler(async (req, res) => {
	const { q } = req.query;

	if (!q) {
		res.status(400);
		throw new Error("Search query (q) is required");
	}

	// find boards
	const boards = await Board.find({ members: req.user._id }).select("_id");
	const boardIds = boards.map((b) => b._id);

	// search cards only in those boards
	const cards = await Card.find({
		board: { $in: boardIds },
		$or: [{ title: { $regex: q, $options: "i" } }, { description: { $regex: q, $options: "i" } }],
	})
		.populate("list", "title")
		.populate("board", "title");

	res.json(cards);
});
