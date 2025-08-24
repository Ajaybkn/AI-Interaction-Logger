import asyncHandler from "express-async-handler";
import Board from "../models/Board.js";

// @desc    Create new board
// @route   POST /api/boards
// @access  Private
export const createBoard = asyncHandler(async (req, res) => {
	const { name, description } = req.body;

	if (!name) {
		res.status(400);
		throw new Error("Board name is required");
	}

	const board = await Board.create({
		name,
		description,
		owner: req.user._id,
		members: [req.user._id], // creator is auto member
	});

	res.status(201).json(board);
});

// @desc    Get all boards of logged in user
// @route   GET /api/boards
// @access  Private
export const getBoards = asyncHandler(async (req, res) => {
	const boards = await Board.find({ members: req.user._id });
	res.json(boards);
});

// @desc    Get single board
// @route   GET /api/boards/:id
// @access  Private
export const getBoardById = asyncHandler(async (req, res) => {
	const board = await Board.findById(req.params.id);

	if (!board) {
		res.status(404);
		throw new Error("Board not found");
	}

	// check if user is a member
	if (!board.members.includes(req.user._id)) {
		res.status(403);
		throw new Error("Not authorized to view this board");
	}

	res.json(board);
});

// @desc    Update board
// @route   PUT /api/boards/:id
// @access  Private
export const updateBoard = asyncHandler(async (req, res) => {
	const board = await Board.findById(req.params.id);

	if (!board) {
		res.status(404);
		throw new Error("Board not found");
	}

	// only owner can update
	if (board.owner.toString() !== req.user._id.toString()) {
		res.status(403);
		throw new Error("Only owner can update this board");
	}

	board.name = req.body.name || board.name;
	board.description = req.body.description || board.description;

	const updatedBoard = await board.save();
	res.json(updatedBoard);
});

// @desc    Delete board
// @route   DELETE /api/boards/:id
// @access  Private
export const deleteBoard = asyncHandler(async (req, res) => {
	const board = await Board.findById(req.params.id);

	if (!board) {
		res.status(404);
		throw new Error("Board not found");
	}

	// only owner can delete
	if (board.owner.toString() !== req.user._id.toString()) {
		res.status(403);
		throw new Error("Only owner can delete this board");
	}

	await board.deleteOne();
	res.json({ message: "Board removed" });
});
