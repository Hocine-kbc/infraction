import { Router, Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();
console.log("auth.ts chargé !");


// Enregistrement
router.post("/register", async (req: Request, res: Response) => {
  console.log("POST /auth/register reçu", req.body); 
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      name,
      role: "user"
    });

    await user.save();

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (err: any) {
    console.error("Erreur complète lors de l'inscription :", err);
    res.status(500).json({ message: err.message || "Erreur serveur" });
  }
});

// Connexion
router.post("/login", async (req: Request, res: Response) => {
  console.log("POST /auth/login reçu", req.body);
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect" });
    }

 const token = jwt.sign(
  {
    id: user._id,
    role: user.role 
  },
  process.env.JWT_SECRET || "secretkey",
  { expiresIn: "1h" }
);


    res.json({ token });
  } catch (err: any) {
    console.error("Erreur complète lors de la connexion :", err);
    res.status(500).json({ message: err.message || "Erreur serveur" });
  }
});

export default router;
