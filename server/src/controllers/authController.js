import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET || "your_jwt_secret",
    { expiresIn: "30d" }
  );
};

export const register = async (req, res) => {
  try {
    const { username, email, password, role, adminSecret } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if registering as admin
    let finalRole = "user";
    if (role === "admin") {
      const secretKey = process.env.ADMIN_SECRET_KEY || "cinepass_admin_2024";
      if (adminSecret !== secretKey) {
        return res.status(403).json({ message: "Invalid admin secret key" });
      }
      finalRole = "admin";
    }

    const user = await User.create({
      username,
      email,
      password,
      role: finalRole
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        res.json({
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          token: generateToken(user)
        });
      } else {
        console.log(`Login failed: Password mismatch for ${email}`);
        res.status(401).json({ message: "Invalid email or password" });
      }
    } else {
      console.log(`Login failed: User not found for ${email}`);
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
