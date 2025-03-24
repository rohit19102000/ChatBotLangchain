import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { ChatOpenAI } from "@langchain/openai";
import RateLimit from "./models/RateLimit.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || "";

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

const checkRateLimit = async (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  try {
    const limit = await RateLimit.findOne({ ipAddress: ip });
    const now = new Date();

    if (limit) {
      if (now > limit.resetTime) {
        limit.count = 0;
        limit.resetTime = new Date(now.setMinutes(now.getMinutes() + 5));
        await limit.save();
      }

      if (limit.count >= 5) {
        const timeLeft = Math.ceil((limit.resetTime - now) / 1000);
        return res.status(429).json({
          success: false,
          error: `Rate limit exceeded. Try again in ${timeLeft} seconds`,
          resetTimestamp: limit.resetTime.getTime()
        });
      }
    }

    next();
  } catch (error) {
    console.error("Rate limit error:", error);
    next();
  }
};

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

app.post("/api/chat", checkRateLimit, async (req, res) => {
  try {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

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

    const modifiedMessages = [VEGETA_PROMPT, ...req.body.messages];
    
    const response = await chat.invoke(modifiedMessages, {
      callbacks: [{
        handleLLMEnd: (output) => {
          const usage = output.llmOutput?.tokenUsage || {};
          console.log(`🗠 Token Usage | Prompt: ${usage.promptTokens} | Completion: ${usage.completionTokens} | Total: ${usage.totalTokens}`);
        }
      }]
    });

    await RateLimit.findOneAndUpdate(
      { ipAddress: ip },
      {
        $inc: { count: 1 },
        $setOnInsert: {
          resetTime: new Date(Date.now() + 5 * 60 * 1000)
        }
      },
      { upsert: true, new: true }
    );

    const vegetaResponse = response.content + " 💢";

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