import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true },
		description: { type: String, default: "" },
		list: { type: mongoose.Schema.Types.ObjectId, ref: "List", required: true },
		board: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true }, // quick access
		position: { type: Number, default: 0 }, // ordering inside list
		labels: [{ type: String }], // optional tags
		dueDate: { type: Date },
		assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	},
	{ timestamps: true }
);

const Card = mongoose.model("Card", cardSchema);
export default Card;
