import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Routes

app.use("/api/auth", authRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
