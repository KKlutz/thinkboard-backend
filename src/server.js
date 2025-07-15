import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";

import notesRoute from "./routes/notes.route.js";
import mongoClient from "./config/mongo.client.js";
import { rateLimiter } from "./middleware/ratelimiter.js";

const app = express();
const PORT = process.env.PORT || 5050;
const __dirname = path.resolve();

// CORS Middleware
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );
} else {
  app.use(
    cors({
      origin: "https://thinkboard-app-phi.vercel.app",
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  );
}

// Middleware to parse JSON requests bodies
// This is necessary to handle JSON data sent in requests, such as when creating or updating notes
app.use(express.json());
app.use(rateLimiter);

// Example of simple middleware
app.use((req, _, next) => {
  console.log("Request received!");
  console.log(`HTTP Method: ${req.method} | URL Endpoints: ${req.url}`);

  next(); // next() to pass control to the next middleware or route handler
});

// Redirect root endpoint to /api/notes endpoint
app.get("/", (_, res) => {
  res.redirect("/api/notes");
});

// Route handlers for notes
app.use("/api/notes", notesRoute);

if (process.env.NODE_ENV === "production") {
  // Configure to use react application from "dis" as static assets
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.use("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoClient();

    // Start the localhost server
    app.listen(PORT, () => {
      console.log(`Server is running on localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server error: ", error);
  }
};

startServer();
