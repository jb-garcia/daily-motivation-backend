import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import User from "./models/User.js";
const router = express.Router();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);


// MongoDB Connection
const MONGO_URI = "mongodb://localhost:27017/motivationapp";

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(5000, () => console.log("Server running on port 5000")))
    .catch(err => console.error(err));
// Quote Schema
const quoteSchema = new mongoose.Schema({
    emotion: String,
    quote: String
});

const Quote = mongoose.model("Quote", quoteSchema);

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.post("/generate", async (req, res) => {
    try {
        const { emotion = "Happy" } = req.body;
        

         // Check if we already have a stored quote for this emotion
        //  const existingQuote = await Quote.findOne({ emotion });
        //  if (existingQuote) {
        //      return res.json({ choices: [{ message: { content: existingQuote.quote } }] });
        //  }

        // Create a prompt based on the selected emotion
        let prompt = "Give me a motivational quote";
        
        switch (emotion) {
            case "Happy":
                prompt = "Give me a motivational quote that celebrates happiness and encourages maintaining a positive outlook";
                break;
            case "Sad":
                prompt = "Give me an uplifting motivational quote that acknowledges sadness but offers hope and comfort";
                break;
            case "Angry":
                prompt = "Give me a calming motivational quote that helps with managing anger and finding inner peace";
                break;
            case "Fear":
                prompt = "Give me an empowering motivational quote about overcoming fear and finding courage";
                break;
            case "Surprise":
                prompt = "Give me an insightful motivational quote about embracing unexpected changes and seeing opportunities in surprises";
                break;
            case "Disgust":
                prompt = "Give me a transformative motivational quote about finding beauty in difficult situations and overcoming negative feelings";
                break;
            default:
                prompt = "Give me a motivational quote for someone feeling " + emotion;
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo",  // Change model if needed
                messages: [{ role: "user", content: prompt }]
            })
        });

        const data = await response.json();
        const generatedQuote = data.choices[0].message.content;

        // Save the new quote in MongoDB
        const newQuote = new Quote({ emotion, quote: generatedQuote });
        await newQuote.save();

        res.json(data);
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Failed to generate motivation" });
    }
});




const PORT = process.env.PORT || 5001;  // Change from 5000 to 5001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
