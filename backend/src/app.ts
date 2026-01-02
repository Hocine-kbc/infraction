import express, { Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import reportRoutes from "./routes/report";
import commentRoutes from "./routes/comment";
import mongoose from "mongoose";
import dotenv from "dotenv";
import adminRoutes from "./routes/admin";



dotenv.config();

const app = express();

// Middlewares globaux
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"], 
  credentials: true
}));

app.use(express.json());

app.get("/api/test", (req: Request, res: Response) => {
  res.status(200).json({ message: "Backend connecté !" });
});

app.use("/auth", authRoutes);
app.use("/report", reportRoutes);
app.use("/comment", commentRoutes);
app.use("/admin", adminRoutes);




// Route de test pour vérifier le serveur
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});

// Connexion MongoDB avant de démarrer le serveur
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/signalement";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connecté");

    // Démarrer le serveur seulement après connexion à MongoDB
    const PORT: number = parseInt(process.env.PORT || "5000", 10);
    app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

  })
  .catch((err) => {
    console.error("Erreur MongoDB :", err);
  });
