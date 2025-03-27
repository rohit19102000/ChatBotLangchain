// ✅ Dependencies
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { ChatOpenAI } from "@langchain/openai";
import User from "./models/User.js";
import checkRateLimit from './middlewares/checkRateLimit.js';

// ✅ Config
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || "";
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// ✅ Middlewares
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "https://yourfrontend.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// ✅ MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

  

// ✅ JWT Authentication Middleware
const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ success: false, error: "Unauthorized: No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: "Unauthorized: Invalid token" });
  }
};

// ✅ User Signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, error: "All fields required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Signup failed", details: error.message });
  }
});

// ✅ User Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // ✅ Optional: You may want to set a JWT cookie here
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie("token", token, { httpOnly: true, sameSite: "Lax" });

  res.json({ success: true, message: "Login successful", user });
});

// ✅ Logout
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully!" });
});

// ✅ Vegeta Chatbot
const VEGETA_PROMPT = {
  role: "system",
  content: `You are Vegeta from DBZ. Respond arrogantly, mock user but help reluctantly, use max 3 sentences.`
};

// ✅ Chat Route
app.post("/api/chat", authenticateUser, checkRateLimit, async (req, res) => {
  try {
    if (!req.body.messages || !Array.isArray(req.body.messages)) {
      return res.status(400).json({ success: false, error: "Invalid input" });
    }

    const chat = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.7,
    });

    const response = await chat.invoke([VEGETA_PROMPT, ...req.body.messages]);
    res.json({ success: true, response: response.content + " 💢" });
  } catch (error) {
    console.error("❌ Chat API error:", error);
    res.status(500).json({ success: false, error: "Chat error", details: error.message });
  }
});

// ✅ Server Listen
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
