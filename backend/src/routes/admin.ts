import { Router, Request, Response } from "express";
import Report from "../models/Report";
import User from "../models/User";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";

const router = Router();

// Tous les signalements (admin)
router.get("/reports", authMiddleware, adminMiddleware, async (_req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Erreur serveur" });
  }
});

// Liste des utilisateurs (admin)
router.get("/users", authMiddleware, adminMiddleware, async (_req, res) => {
  try {
    const users = await User.find().select("email name role createdAt");
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Erreur serveur" });
  }
});

// Envoyer une réponse à un signalement
router.post(
  "/report/:id/respond",
  authMiddleware,
  adminMiddleware,
  async (req: Request, res: Response) => {
    try {
      const report = await Report.findById(req.params.id);
      if (!report) return res.status(404).json({ message: "Signalement non trouvé" });

      const { message } = req.body;
      if (!message) return res.status(400).json({ message: "Message requis" });

      report.responses = report.responses || [];
      report.responses.push({
        message,
        adminId: (req as any).user.id,
        date: new Date(),
      });

      report.notifications = report.notifications || [];
      report.notifications.push({
        message: `Nouvelle réponse de l'admin : ${message}`,
        read: false,
        date: new Date(),
      });

      await report.save();
      res.json(report);
    } catch (err: any) {
      res.status(500).json({ message: err.message || "Erreur serveur" });
    }
  }
);

export default router;
