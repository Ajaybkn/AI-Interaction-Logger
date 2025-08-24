import mongoose from "mongoose";

const listSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		board: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true },
		position: { type: Number, default: 0 }, // ordering
	},
	{ timestamps: true }
);

const List = mongoose.model("List", listSchema);
export default List;
