const express = require("express");
const multer = require("multer");
const OpenAI = require("openai");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
// Using port 3001 as established
const port = process.env.PORT || 3001;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- VOICEBANK AI PERSONA ---
const SYSTEM_PROMPT = `
🆔 Identity:
You are VoiceBank AI — The Trust Guardian for Secure Digital Banking.
You are the official virtual voice assistant for digital banking customers. You are calm, trustworthy, and easy to talk to.

🌟 Style & Quadrials:
1. Tone: Warm, professional, and trustworthy.
2. Personality: Calm, patient, confident, and highly dependable. Never rushed or robotic.
3. Clarity: Use simple, direct language. Avoid jargon. Pronounce numbers clearly.
4. Pace: Speak slowly and steadily.
5. Engagement: Be conversational. Use acknowledgments like "Of course, I can help with that."
6. Empathy: Offer calm reassurance if the user is worried.

🛡️ Response Guidance:
- Keep responses concise (suitable for voice output).
- Guide step-by-step.
- Security: Ask for a 4-digit PIN politely if performing a sensitive task: "To help you securely, could you please say your 4-digit PIN?"
- Escalation: If unauthorized transactions, lost card, or security issues are mentioned, escalate immediately: "Let me connect you to a banking specialist right away..."

💬 Typical Tasks:
- Checking balances, transactions, reminders, transfers (with PIN), interest rates, branch info.
- ERROR HANDLING: If input is unclear, ask gently: "Could you please repeat that?"

Current Context: You are responding to a voice command. Keep your output text ready to be spoken (clean text, no markdown formatting like bolding/lists unless necessary for reading).
`;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/webm",
      "audio/m4a",
      "audio/ogg",
      "audio/flac",
      "audio/x-m4a",
      "application/octet-stream",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only audio files are allowed."));
    }
  },
});

// --- Helper to Generate Voice ---
async function generateVoice(text) {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "shimmer", // Options: alloy, echo, fable, onyx, nova, shimmer. 'shimmer' is calm/female. 'onyx' is deep/male.
    input: text,
  });
  const buffer = Buffer.from(await mp3.arrayBuffer());
  return buffer.toString("base64");
}

// --- Endpoints ---

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "VoiceBank AI Server is running" });
});

// Transcribe + Generate AI Response + Generate Voice (Local File)
app.post("/transcribe-file", async (req, res) => {
  try {
    const { filename, language } = req.body;
    if (!filename) return res.status(400).json({ error: "Filename required" });

    const filePath = path.resolve(process.cwd(), filename);
    if (!filePath.startsWith(process.cwd()) || !fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // 1. Transcribe
    const fileStream = fs.createReadStream(filePath);
    const transcription = await openai.audio.transcriptions.create({
      file: fileStream,
      model: "whisper-1",
      language: language || undefined,
    });
    const userText = transcription.text;

    // 2. Generate AI Response
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userText },
      ],
    });
    const aiResponse = completion.choices[0].message.content;

    // 3. Generate Audio
    const audioBase64 = await generateVoice(aiResponse);

    res.json({
      success: true,
      transcription: userText,
      aiResponse: aiResponse,
      audio: `data:audio/mp3;base64,${audioBase64}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Transcribe + Generate AI Response + Generate Voice (Uploaded File)
app.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No audio file provided" });

    // 1. Transcribe
    const file = new File([req.file.buffer], req.file.originalname, {
      type: req.file.mimetype,
    });
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      language: req.body.language || undefined,
    });
    const userText = transcription.text;

    // 2. Generate AI Response
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userText },
      ],
    });
    const aiResponse = completion.choices[0].message.content;

    // 3. Generate Audio
    const audioBase64 = await generateVoice(aiResponse);

    res.json({
      success: true,
      transcription: userText,
      aiResponse: aiResponse,
      audio: `data:audio/mp3;base64,${audioBase64}`,
    });
  } catch (error) {
    console.error("Processing error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`VoiceBank AI Server running on http://localhost:${port}`);
});
