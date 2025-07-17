const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose
      .connect(
        "mongodb+srv://surya:surya@cluster0.qii1de0.mongodb.net/buy_sell?retryWrites=true&w=majority&appName=Cluster0"
      )
      .then(() => console.log("🔥 DB Connected Successfully"))
      .catch((err) => console.error("DB Error:", err));
  } catch (err) {
    console.error("DB Error:", err);
  }
};

module.exports = connectDB; 