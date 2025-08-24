import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import listRoutes from "./routes/listRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());

// ✅ CORS config
app.use(
	cors({
		origin: "http://localhost:5173", // Allow Vite frontend
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		credentials: true, // if using cookies / auth headers
	})
);

// Health check route
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/cards", cardRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
