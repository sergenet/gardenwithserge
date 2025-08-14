const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { OpenAI } = require('openai');
const fs = require('fs'); // <-- NEW: For file logging
const path = require('path'); // <-- MOVE THIS HERE!
fs.appendFileSync(path.join(__dirname, 'debug.log'), "Server.js started at " + new Date().toISOString() + "\n");
require('dotenv').config();
console.log("Loaded OpenAI key:", process.env.OPENAI_API_KEY);
const mysql = require('mysql2/promise'); // For newsletter signup
// Logging helper function
function logDebug(message, obj) {
    const logMessage = `${new Date().toISOString()} ${message} ${obj ? JSON.stringify(obj, null, 2) : ''}\n`;
    fs.appendFile(path.join(__dirname, 'debug.log'), logMessage, err => {
        if (err) console.error("Failed to write debug log:", err);
    });
}

const app = express();

const PORT = process.env.PORT || 3001;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
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

        // Log to file
        logDebug("Outgoing OpenAI messages for plant-identify:", messages);

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages,
            max_tokens: 300,
            response_format: { type: "json_object" },
            temperature: 0
        });

        // Log response from OpenAI
        logDebug("OpenAI response for plant-identify:", completion);

        let result;
        try {
            result = JSON.parse(completion.choices[0].message.content);
        } catch (e) {
            logDebug("OpenAI did not return valid JSON for plant-identify:", { raw: completion.choices[0].message.content });
            return res.status(500).json({ error: "OpenAI did not return valid JSON.", raw: completion.choices[0].message.content });
        }
        res.json(result);
    } catch (err) {
        console.error(err);
        logDebug("Server error in plant-identify:", { error: err.message });
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

// Step 2: Disease Analysis
app.post('/api/plant-analyze', upload.single('image'), async (req, res) => {
    try {
        const { plantName, scientificName } = req.body;
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

        // Log to file
        logDebug("Outgoing OpenAI messages for plant-analyze:", messages);

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages,
            max_tokens: 500,
            response_format: { type: "json_object" },
            temperature: 0
        });

        // Log response from OpenAI
        logDebug("OpenAI response for plant-analyze:", completion);

        let result;
        try {
            result = JSON.parse(completion.choices[0].message.content);
        } catch (e) {
            logDebug("OpenAI did not return valid JSON for plant-analyze:", { raw: completion.choices[0].message.content });
            return res.status(500).json({ error: "OpenAI did not return valid JSON.", raw: completion.choices[0].message.content });
        }
        res.json(result);
    } catch (err) {
        console.error(err);
        logDebug("Server error in plant-analyze:", { error: err.message });
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
        logDebug("Server error in newsletter-signup:", { error: err.message });
        res.status(500).json({ error: 'Server error.' });
    }
});

// (Optional) Test DB connection endpoint for debugging
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

// Catch-all route for SPA (must be last)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});