const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { OpenAI } = require('openai');
require('dotenv').config();
console.log("Loaded OpenAI key:", process.env.OPENAI_API_KEY)
const path = require('path');
const mysql = require('mysql2/promise'); // For newsletter signup

// Initialize Express app FIRST!
const app = express();

const PORT = process.env.PORT || 3001;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

app.use(cors());
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Multer for file uploads (in-memory)
const upload = multer({ storage: multer.memoryStorage() });

// Step 1: Plant Identification
app.post('/api/plant-identify', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No image uploaded" });
        const imageBase64 = req.file.buffer.toString('base64');
        const prompt = `
Identify the plant in the image. Respond as JSON:
{
  "plantName": "",
  "scientificName": "",
  "confidence": 0
}
Use null if unsure. Only return JSON.`;

        const messages = [
            {
                role: "system",
                content: "You are an expert botanist. Only return JSON as instructed."
            },
            {
                role: "user",
                content: [
                    { type: "text", text: prompt },
                    { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
                ]
            }
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-4o", // Latest OpenAI Vision model
            messages,
            max_tokens: 300,
            response_format: { type: "json_object" }
        });

        let result;
        try {
            result = JSON.parse(completion.choices[0].message.content);
        } catch (e) {
            return res.status(500).json({ error: "OpenAI did not return valid JSON.", raw: completion.choices[0].message.content });
        }
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

// Step 2: Disease Analysis
app.post('/api/plant-analyze', upload.single('image'), async (req, res) => {
    try {
        const { plantName, scientificName } = req.body; // Sent from frontend
        if (!req.file || !plantName) return res.status(400).json({ error: "Image and plant name required" });
        const imageBase64 = req.file.buffer.toString('base64');
        const prompt = `
Analyze the health of the following plant in the image. Plant name: "${plantName}"${scientificName ? `, Scientific name: "${scientificName}"` : ""}. 
Respond as JSON:
{
  "healthStatus": "",
  "diseaseAnalysis": "",
  "careRecommendations": ["", "", ""]
}
Use null if unsure. Only return JSON.`;

        const messages = [
            {
                role: "system",
                content: "You are a plant disease expert. Only return JSON as instructed."
            },
            {
                role: "user",
                content: [
                    { type: "text", text: prompt },
                    { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
                ]
            }
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages,
            max_tokens: 500,
            response_format: { type: "json_object" }
        });

        let result;
        try {
            result = JSON.parse(completion.choices[0].message.content);
        } catch (e) {
            return res.status(500).json({ error: "OpenAI did not return valid JSON.", raw: completion.choices[0].message.content });
        }
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

// Newsletter Signup Endpoint
app.post('/api/newsletter-signup', async (req, res) => {
    const { email } = req.body;
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email address.' });
    }
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        try {
            await connection.execute(
                'INSERT INTO newsletter_subscribers (email) VALUES (?)',
                [email]
            );
            res.json({ success: true });
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                res.status(400).json({ error: 'This email is already subscribed.' });
            } else {
                res.status(500).json({ error: 'Database error.' });
            }
        } finally {
            await connection.end();
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
});

// (Optional) Test DB connection endpoint for debugging
// Uncomment if you want to use it
/*
app.get('/api/db-test', async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    await connection.ping();
    await connection.end();
    res.send('Database connection OK!');
  } catch (err) {
    res.status(500).send('DB ERROR: ' + err.message);
  }
});
*/

// ------------------------------
// Catch-all route for SPA (must be last)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});