import { Router, Request, Response } from "express";
import Comment from "../models/comment";
import Report from "../models/Report"; 
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";

const router = Router();

// Ajouter un commentaire (utilisateur connecté)
router.post("/add", authMiddleware, async (req: Request, res: Response) => {
  console.log("POST /comment/add reçu", req.body);
  try {
    const { reportId, content } = req.body;
    const userId = (req as any).user.id;

    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ message: "Signalement non trouvé" });
    if (report.userId.toString() !== userId)
      return res.status(403).json({ message: "Accès refusé : vous ne pouvez commenter que vos signalements" });

    const comment = new Comment({ reportId, userId, content });
    await comment.save();

    console.log(`[NOTIFICATION] Commentaire ajouté au signalement ${reportId}`);
    res.status(201).json({ message: "Commentaire ajouté", comment });
  } catch (err: any) {
    console.error("Erreur ajout commentaire :", err);
    res.status(500).json({ message: err.message || "Erreur serveur" });
  }
});

// Lister les commentaires d’un signalement
router.get("/:reportId", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;
    const comments = await Comment.find({ reportId }).sort({ createdAt: 1 });
    res.json(comments);
  } catch (err: any) {
    console.error("Erreur récupération commentaires :", err);
    res.status(500).json({ message: err.message || "Erreur serveur" });
  }
});

// Ajouter une réponse (admin)
router.post("/reply", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  console.log("POST /comment/reply reçu", req.body);
  try {
    const { reportId, content } = req.body;
    const userId = (req as any).user.id;

    const comment = new Comment({ reportId, userId, content });
    await comment.save();

    res.status(201).json({ message: "Réponse ajoutée", comment });
  } catch (err: any) {
    console.error("Erreur ajout réponse admin :", err);
    res.status(500).json({ message: err.message || "Erreur serveur" });
  }
});

// Supprimer un commentaire (admin)
router.delete("/:id", authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) return res.status(404).json({ message: "Commentaire non trouvé" });

    res.json({ message: "Commentaire supprimé avec succès" });
  } catch (err: any) {
    console.error("Erreur suppression commentaire :", err);
    res.status(500).json({ message: err.message || "Erreur serveur" });
  }
});

export default router;
