require("dotenv").config();

const mongoose = require("mongoose");

const { MONGODB_URI = "mongodb://127.0.0.1:27017/wtwr_db" } = process.env;

async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log(`MongoDB connected: ${mongoose.connection.name}`);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

connectDatabase();
