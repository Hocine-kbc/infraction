import { Router, Request, Response } from "express";
import Report from "../models/Report";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";

const router = Router();

//  USER

// Créer un signalement
router.post("/create", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { type, description, location, date } = req.body;
    const userId = (req as any).user.id;

    const report = new Report({
      userId,
      type,
      description,
      location,
      date,
      status: "soumis",
      notifications: [],
      responses: [],
    });

    await report.save();
    res.status(201).json({ message: "Signalement créé", report });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Erreur serveur" });
  }
});

// Lister mes signalements
router.get("/my-reports", authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const reports = await Report.find({ userId }).sort({ createdAt: -1 });
  res.json(reports);
});

// Envoyer une réponse (utilisateur)
router.post("/:id/respond", authMiddleware, async (req: Request, res: Response) => {
  const { message } = req.body;
  const userId = (req as any).user.id;

  const report = await Report.findOne({ _id: req.params.id, userId });
  if (!report) return res.status(404).json({ message: "Signalement non trouvé" });

  report.responses = report.responses || [];
  report.responses.push({ message, adminId: userId, date: new Date() });

  await report.save();
  res.json(report);
});

// ADMIN

// Tous les signalements
router.get("/all", authMiddleware, adminMiddleware, async (_req, res) => {
  const reports = await Report.find().sort({ createdAt: -1 });
  res.json(reports);
});

// Recherche / filtrage
router.get("/search", authMiddleware, adminMiddleware, async (req, res) => {
  const { status, type, dateDebut, dateFin } = req.query;
  const filter: any = {};

  if (status) filter.status = status;
  if (type) filter.type = type;
  if (dateDebut || dateFin) {
    filter.date = {};
    if (dateDebut) filter.date.$gte = new Date(dateDebut as string);
    if (dateFin) filter.date.$lte = new Date(dateFin as string);
  }

  const reports = await Report.find(filter).sort({ createdAt: -1 });
  res.json(reports);
});

// Détail admin
router.get("/detail/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const report = await Report.findById(req.params.id);
  if (!report) return res.status(404).json({ message: "Signalement non trouvé" });
  res.json(report);
});

// Mise à jour statut
router.put("/status/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const { status } = req.body;

  if (!["soumis", "en_cours", "resolu"].includes(status)) {
    return res.status(400).json({ message: "Statut invalide" });
  }

  const report = await Report.findById(req.params.id);
  if (!report) return res.status(404).json({ message: "Signalement non trouvé" });

  report.status = status;
  report.notifications = report.notifications || [];
  report.notifications.push({
    message: `Statut mis à jour → ${status}`,
    read: false,
    date: new Date(),
  });

  await report.save();
  console.log(`[NOTIFICATION] Statut mis à jour → ${status}`);
  res.json(report);
});

// Envoyer une réponse (admin)
router.post("/admin/:id/respond", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  const { message } = req.body;
  const adminId = (req as any).user.id;

  const report = await Report.findById(req.params.id);
  if (!report) return res.status(404).json({ message: "Signalement non trouvé" });

  report.responses = report.responses || [];
  report.responses.push({ message, adminId, date: new Date() });

  await report.save();
  res.json(report);
});

// Détail utilisateur
router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  const report = await Report.findOne({
    _id: req.params.id,
    userId: (req as any).user.id,
  });

  if (!report) return res.status(404).json({ message: "Signalement non trouvé" });
  res.json(report);
});

// Test
router.get("/test", (_req, res) => {
  res.json({ message: "Report routes OK" });
});

export default router;
