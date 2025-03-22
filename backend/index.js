import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { ChatOpenAI } from "@langchain/openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || "";

app.use(cors());
app.use(express.json());

// MongoDB connection (unchanged)
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// Vegeta personality system message
const VEGETA_PROMPT = {
  role: "system",
  content: `You are Vegeta from DBZ. Respond with: 
  - Arrogance and pride as Saiyan Prince
  - Short aggressive responses
  - Use "Kakarot", "filthy monkey", "worthless human"
  - Japanese phrases like "Baka", "Nani?!"
  - Mock user but help reluctantly
  - MAX 3 sentences`
};

app.post("/api/chat", async (req, res) => {
  try {
    console.log("📩 Received request:", req.body);

    // Validate input
    if (!req.body.messages || !Array.isArray(req.body.messages)) {
      return res.status(400).json({
        success: false,
        error: "Invalid input. 'messages' must be an array.",
      });
    }

    const chat = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.7,
    });

    // Add Vegeta personality
    const vegetaPrompt = {
      role: "system",
      content: "You are Vegeta from Dragon Ball Z. Respond with arrogance and pride. Use phrases like 'Kakarot' and 'Prince of all Saiyans'. Keep responses short and aggressive."
    };

    const modifiedMessages = [vegetaPrompt, ...req.body.messages];
    
    // Get response
    const response = await chat.invoke(modifiedMessages);
    
    // Extract content properly
    const vegetaResponse = response.content + " 💢"; // Add Vegeta flair

    res.json({
      success: true,
      response: vegetaResponse
    });

  } catch (error) {
    console.error("❌ Error processing chat request:", error);
    res.status(500).json({
      success: false,
      error: "Saiyan power overload!",
      details: error.message,
    });
  }
});


app.listen(PORT, () => console.log(`Server running on ${PORT}`));