require('dotenv').config();

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('connected to MongoDB'))
  .catch((err) => console.log("connection to MongoDB failed", err.message || err));
