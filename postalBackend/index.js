import express from "express";
import cors from "cors";
import postalRoutes from "./routes/postalRoutes.js";
import { DBconnection } from "./DB/Connection.js";

const app = express();
const PORT = 4000;

// Allow all origins (e.g. Postman, browser, mobile app)
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(postalRoutes);

// Connect DB
DBconnection();

app.get("/", (req, res) => {
  res.json({ message: "Express server running with ES6 modules 🚀" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});