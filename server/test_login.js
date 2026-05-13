import mongoose from "mongoose";
import "dotenv/config";
import User from "./src/models/User.js";

const MONGO_URI = process.env.MONGO_URI;

const testLogin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const email = "admin@cinepass.com";
    const password = "admin123";

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return;
    }

    console.log("User found:", user.email, "Role:", user.role);
    const isMatch = await user.comparePassword(password);
    console.log("Password match:", isMatch);

  } catch (error) {
    console.error("Error testing login:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

testLogin();
