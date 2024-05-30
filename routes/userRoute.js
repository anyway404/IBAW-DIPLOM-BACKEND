import express from "express";
import UserModel from "../login/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

require("dotenv").config();

const router = express.Router();

// Route für den Benutzer-Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Benutzer in der Datenbank suchen
    const user = await UserModel.findOne({ username });

    // Benutzer nicht gefunden
    if (!user) {
      return res.status(401).json({ message: "Benutzer nicht gefunden" });
    }

    // Passwort überprüfen
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Ungültige Anmeldeinformationen" });
    }

    // JWT-Token erstellen
    const payload = { username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    // Token an das Frontend senden
    res.status(200).json({ token });
  } catch (error) {
    console.error("Fehler beim Anmelden des Benutzers:", error);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
});

// Route zum Registrieren eines neuen Benutzers (nur ein Benutzer erlaubt)
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Überprüfen, ob bereits ein Benutzer existiert
    const existingUsers = await UserModel.find();
    if (existingUsers.length > 0) {
      return res
        .status(400)
        .json({ message: "Ein Benutzer ist bereits registriert" });
    }

    // Passwort hashen
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Neuen Benutzer anlegen
    const newUser = new UserModel({
      username,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Benutzer erfolgreich erstellt" });
  } catch (error) {
    console.error("Fehler beim Erstellen des Benutzers:", error);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
});
router.get("/", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Fehler beim Abrufen der Benutzer:", error);
    res.status(500).json({ message: "Interner Serverfehler" });
  }
});
export default router;
