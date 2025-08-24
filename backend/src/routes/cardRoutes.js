import express from "express";
import { createCard, getCardsByList, updateCard, moveCard, deleteCard } from "../controllers/cardController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createCard);
router.get("/:listId", protect, getCardsByList);
router.put("/:id", protect, updateCard);
router.patch("/:id/move", protect, moveCard);
router.delete("/:id", protect, deleteCard);

export default router;
