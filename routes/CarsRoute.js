import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const DB_URL = process.env.DB_URL;

const app = express();
const router = express.Router();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,POST,DELETE",
};

app.use(cors(corsOptions));
app.use(express.json()); // Middleware, um JSON-Requests zu parsen

mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once("open", () => {
  console.log("Connected to MongoDB");
});

const BookingSchema = mongoose.Schema({
  brand: String,
  name: String,
  startDate: Date,
  endDate: Date,
  customer: String,
});

const BookingModel = mongoose.model("Booking", BookingSchema);

router.post("/bookings", async (req, res) => {
  try {
    const { brand, name, startDate, endDate, customer } = req.body; // Kunden hier aus req.body extrahieren

    const newBooking = new BookingModel({
      brand,
      name,
      startDate,
      endDate,
      customer, // Kundenwert dem Buchungsobjekt hinzufügen
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking data saved successfully." });
  } catch (error) {
    console.error("Error saving booking data:", error);
    res.status(500).json({ message: "Error saving booking data." });
  }
});

router.get("/bookings", async (req, res) => {
  try {
    const bookings = await BookingModel.find();
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings." });
  }
});

router.get("/bookings/:id", async (req, res) => {
  try {
    const booking = await BookingModel.findById(req.params.id);
    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ message: "Booking not found." });
    }
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Error fetching booking." });
  }
});

router.delete("/bookings/:id", async (req, res) => {
  try {
    const booking = await BookingModel.findByIdAndDelete(req.params.id);
    if (booking) {
      res.status(200).json({ message: "Booking deleted successfully." });
    } else {
      res.status(404).json({ message: "Booking not found." });
    }
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ message: "Error deleting booking." });
  }
});

export default router;
