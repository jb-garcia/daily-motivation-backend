const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateMotivation = async (req, res) => {
  try {
    const { category } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Give me a short motivational quote about ${category}.`;

    const result = await model.generateContent(prompt);
    const response = result.response.candidates[0].content.parts[0].text;

    res.json({ message: response });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate motivation", details: error.message });
  }
};

module.exports = { generateMotivation };
