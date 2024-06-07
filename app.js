import express from "express";
import morgan from "morgan";
import CarsRoute from "./routes/CarsRoute";
import bodyParser from "body-parser";
import UserRoute from "./routes/userRoute.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Lädt Umgebungsvariablen aus einer .env-Datei

const PORT = process.env.PORT || 3000; // Verwenden der Umgebungsvariablen PORT oder Standardwert 3000

const server = express();

server.use(morgan("tiny"));
server.use(bodyParser.json());
server.use(cors());

server.use("/api/v1", CarsRoute); // Routen für die Buchungen
server.use("/api/v1/users", UserRoute); // Routen für Login

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
