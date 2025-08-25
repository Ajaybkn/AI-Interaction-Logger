import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import listRoutes from "./routes/listRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import path from "path";
const app = express();
const __dirname = path.resolve();

app.use(express.json());

// ✅ CORS
app.use(
	cors({
		origin: "http://localhost:5173",
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		credentials: true,
	})
);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/cards", cardRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get(/^(?!\/api).*/, (req, res) => {
	res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});
// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
