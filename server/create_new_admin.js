import mongoose from "mongoose";
import "dotenv/config";
import User from "./src/models/User.js";

const MONGO_URI = process.env.MONGO_URI;

const createNewAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const targetEmail = "cinepass@admin.com";
    await User.deleteOne({ email: targetEmail }); // Delete if exists

    const admin = await User.create({
      username: "cinepass_admin",
      email: targetEmail,
      password: "admin",
      role: "admin"
    });

    console.log("New admin created successfully!");
    console.log(`Email: ${targetEmail}`);
    console.log("Password: admin");

  } catch (error) {
    console.error("Error creating admin:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

createNewAdmin();
