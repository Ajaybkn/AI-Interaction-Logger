import asyncHandler from "express-async-handler";
import List from "../models/List.js";
import Board from "../models/Board.js";
import Card from "../models/Card.js";

// @desc    Create new list
// @route   POST /api/lists
// @access  Private
export const createList = asyncHandler(async (req, res) => {
	const { name, boardId } = req.body;

	if (!name || !boardId) {
		res.status(400);
		throw new Error("List name and boardId are required");
	}

	const board = await Board.findById(boardId);
	if (!board) {
		res.status(404);
		throw new Error("Board not found");
	}

	// check membership
	if (!board.members.includes(req.user._id)) {
		res.status(403);
		throw new Error("Not authorized to add list to this board");
	}

	const listCount = await List.countDocuments({ board: boardId });

	const list = await List.create({
		name,
		board: boardId,
		position: listCount,
	});

	res.status(201).json(list);
});

// @desc    Get all lists for a board
// @route   GET /api/lists/:boardId
// @access  Private

export const getListsByBoard = asyncHandler(async (req, res) => {
	const board = await Board.findById(req.params.boardId);
	if (!board) {
		res.status(404);
		throw new Error("Board not found");
	}

	if (!board.members.includes(req.user._id)) {
		res.status(403);
		throw new Error("Not authorized");
	}

	const lists = await List.find({ board: req.params.boardId }).sort("position");
	const listsWithCards = await Promise.all(
		lists.map(async (list) => {
			const cards = await Card.find({ list: list._id }).sort("position");
			return { ...list.toObject(), cards };
		})
	);

	res.json(listsWithCards);
});

// @desc    Update list
// @route   PUT /api/lists/:id
// @access  Private
export const updateList = asyncHandler(async (req, res) => {
	const list = await List.findById(req.params.id);

	if (!list) {
		res.status(404);
		throw new Error("List not found");
	}

	const board = await Board.findById(list.board);
	if (!board.members.includes(req.user._id)) {
		res.status(403);
		throw new Error("Not authorized");
	}

	list.name = req.body.name || list.name;
	if (req.body.position !== undefined) list.position = req.body.position;

	const updatedList = await list.save();
	res.json(updatedList);
});

// @desc    Delete list
// @route   DELETE /api/lists/:id
// @access  Private
export const deleteList = asyncHandler(async (req, res) => {
	const list = await List.findById(req.params.id);

	if (!list) {
		res.status(404);
		throw new Error("List not found");
	}

	const board = await Board.findById(list.board);
	if (!board.members.includes(req.user._id)) {
		res.status(403);
		throw new Error("Not authorized");
	}

	await list.deleteOne();
	res.json({ message: "List removed" });
});
