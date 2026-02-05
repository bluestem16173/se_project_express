const express = require("express");
const mongoose = require("mongoose");
const usersRouter = require("./routes/users");
const clothingItemsRouter = require("./routes/clothingItem");

const app = express();
const { PORT = 3001, DEFAULT_USER_ID = "697d6c4dbeab3107bd6a5a84" } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");



app.use(express.json()); // application/json
app.use(express.urlencoded({ extended: true })); // application/x-www-form-urlencoded
// Temporary auth stub: attach a user object to each request
// Set DEFAULT_USER_ID to the test user _id so likes map to that user.
app.use((req, res, next) => {
  req.user = { _id: DEFAULT_USER_ID };
  next();
});

// users routes
app.use("/users", usersRouter);
// clothing items routes
app.use("/items", clothingItemsRouter);
// health check
app.get("/", (req, res) => {
  res.send({ message: "Express service is running 🚀" });
});

// unknown routes
app.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});


app.listen(PORT);
