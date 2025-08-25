import asyncHandler from "express-async-handler";
import Board from "../models/Board.js";
import List from "../models/List.js";

// Create new board | POST /api/boards | Private

export const createBoard = asyncHandler(async (req, res) => {
	const { name, description } = req.body;

	if (!name) {
		res.status(400);
		throw new Error("Board name is required");
	}

	// 1. Create the board
	const board = await Board.create({
		name,
		description,
		owner: req.user._id,
		members: [req.user._id], // creator is auto member
	});

	// 2. Create default lists for Kanban structure
	const defaultLists = ["Todo", "In Progress", "Done"];

	const lists = await Promise.all(
		defaultLists.map((listName, index) =>
			List.create({
				name: listName,
				board: board._id,
				position: index,
			})
		)
	);

	// 3. Return board + its lists
	res.status(201).json({
		...board.toObject(),
		lists,
	});
});

//   Get all boards of logged in user | GET /api/boards | Private

export const getBoards = asyncHandler(async (req, res) => {
	const boards = await Board.find({ members: req.user._id });
	res.json(boards);
});

//   Get single board | GET /api/boards/:id | Private

export const getBoardById = asyncHandler(async (req, res) => {
	const board = await Board.findById(req.params.id);

	if (!board) {
		res.status(404);
		throw new Error("Board not found");
	}

	if (!board.members.includes(req.user._id)) {
		res.status(403);
		throw new Error("Not authorized to view this board");
	}

	const lists = await List.find({ board: board._id }).sort("position");

	res.json({ ...board.toObject(), lists });
});

//  Update board | PUT /api/boards/:id | Private

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

//  Delete board | DELETE /api/boards/:id | Private

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
