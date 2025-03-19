import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import compression from "compression";
// import { connectDatabses } from "./config/database";

import morgan from "morgan";
// import { router } from "./routes";  // Import your routes
import { connectDatabase } from "./config/database";
import { router } from "./routes/router";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(compression());

// Connect to Database
connectDatabase();

// Mount Routes
app.use("/api", router);  // Use the imported router under "/api"

// Default Route
app.get("/", (req, res) => {
    console.log(req.body);
    
  res.send("Welcome to MentorOne API");
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
