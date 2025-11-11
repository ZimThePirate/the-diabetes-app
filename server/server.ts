import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import OllamaClient from "./ollamaClient";

const app = express();
const ollama = new OllamaClient();

const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const {
    model = "hf.co/lmstudio-community/medgemma-4b-it-GGUF:Q4_K_M",
    messages,
  } = req.body;
  const response = await ollama.chat(model, messages);
  res.json(response);
});

app.post("/api/analyze-report", upload.single("report"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const analysis = {
      riskLevel: "Low",
      recommendations: [
        "Continue regular check-ups",
        "Maintain healthy diet",
        "Exercise regularly",
      ],
      detectedValues: {
        glucose: "95 mg/dL",
        hba1c: "5.2%",
      },
    };

    res.json(analysis);
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: "Analysis failed" });
  }
});

const PORT = 4000;
const HOST = "your server ip address";

app.listen(PORT, () => {
  console.log(`Ollama backend running on http://${HOST}:${PORT}`);
});
