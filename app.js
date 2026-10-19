require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const usersRouter = require("./routes/users");
const clothingItemsRouter = require("./routes/clothingItem");
const errorHandler = require("./utils/errors");

const app = express();
const {
  MONGODB_URI = "mongodb://127.0.0.1:27017/wtwr_db",
  PORT = 3001,
} = process.env;
const { createUser, login } = require("./controllers/users");

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);
app.use(express.json()); // application/json
app.use(express.urlencoded({ extended: true })); // application/x-www-form-urlencoded
app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133",
  };
  next();
});

// signup and login routes
app.post("/signup", createUser);
app.post("/signin", login);

// authorization middleware is now inside the route files to allow exceptions

// users routes
app.use("/users", usersRouter);
// clothing items routes
app.use("/items", clothingItemsRouter);
// health check
app.get("/", (req, res) => {
  res.send({ message: "Express service is running 🚀" });
});

const NotFoundError = require("./utils/errors/NotFoundError");

// unknown routes
app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

// centralized error handler
app.use(errorHandler);

app.listen(PORT);
