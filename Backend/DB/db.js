const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = async () => {
  try {
    await mongoose
      .connect(.MONGO_URI)     
      .then(() => console.log("🔥 DB Connected Successfully"))
      .catch((err) => console.error("DB Error:", err));
  } catch (err) {
    console.error("DB Error:", err);
  }
};

module.exports = connectDB; 