/**
 * Garden With Serge Newsletter Generator
 * - Only ONE hero image at top: https://gardenwithserge.com/hero-garden-pathway.jpg
 * - No other images
 * - Fancy SVG breaks between sections
 * - Attractive card formatting, emojis, responsive
 * - Converts plain text to HTML (bullets, bold, paragraphs)
 * - Only sends ONCE per week.
 * - Automated unsubscribe: subscribers click a link, and their status is updated in the database.
 */
require('dotenv').config();
console.error('App started at ' + new Date().toISOString());
const mysql = require('mysql2/promise');
const OpenAI = require("openai");
const nodemailer = require("nodemailer");
const http = require("http");
const url = require("url");

// =================== CONFIGURATION ===================
const OPENAI_KEY = process.env.OPENAI_API_KEY_JOURNAL;
const NEWSLETTER_LANGUAGE = process.env.NEWSLETTER_LANGUAGE || "English";

const HERO_IMAGE_URL = "https://gardenwithserge.com/hero-garden-pathway.jpg";

// SMTP settings
const transporter = nodemailer.createTransport({
  host: "gardenwithserge.com",
  port: 465,
  secure: true,
  auth: {
    user: "news@gardenwithserge.com",
    pass: "Sako!!NGWS2025"
  }
});

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const MYSQL_CONFIG = {
  host: 'localhost',
  user: 'sergbcqk_gardenwithserge_user',
  password: 'Sako!!GWS2025',
  database: 'sergbcqk_gardenwithserge_db',
  charset: 'latin1'
};

// ============ Section Definitions =============
function getSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "fall";
  return "winter";
}
const CURRENT_SEASON = getSeason();
const CURRENT_MONTH = new Date().toLocaleString('default', { month: 'long' });

const sections = [
  {
    title: "🌿 Weekly Gardening Tip",
    prompt: `Share a concise, engaging gardening tip for home gardeners for ${CURRENT_SEASON}. Use short paragraphs, bullet points, and emojis. Do not use markdown or HTML, just plain text.`
  },
  {
    title: "🌸 Plant of the Week",
    prompt: `Select a plant that thrives in ${CURRENT_SEASON}, and write a lively profile. Start with a fun fact, then provide care tips in a bullet list. Do not use markdown or HTML, just plain text.`
  },
  {
    title: "🍂 Seasonal Advice",
    prompt: `Share 2-3 pieces of gardening advice for ${CURRENT_SEASON} in temperate climates. Use bold headers (just write them out), bullet points, and emojis. Do not use markdown or HTML, just plain text.`
  },
  {
    title: "❓ Common Q&A",
    prompt: `Pose a common gardening question and provide a short, clear answer. Format as Q: and A: with a relevant emoji. Do not use markdown or HTML, just plain text.`
  },
  {
    title: "🛠 Featured Tool/Product",
    prompt: `Recommend a useful gardening tool or product. Include a brief description and bullet list of benefits with emojis. Do not use markdown or HTML, just plain text.`
  },
  {
    title: "📅 Events & Reminders",
    prompt: `List gardening events, reminders, or key dates for ${CURRENT_MONTH}. Use a checklist with emojis. Do not use markdown or HTML, just plain text.`
  },
  {
    title: "🎉 Fun Fact or Myth-Busting",
    prompt: `Share a short, surprising gardening fact or bust a common myth. Make it playful, add an emoji. Do not use markdown or HTML, just plain text.`
  }
];

// =========== SVG Section Break =============
const fancyBreak = `
  <div style="width:100%;text-align:center;margin:30px 0 30px 0;">
    <svg height="32" width="300" style="max-width:100%;">
      <text x="50%" y="24" text-anchor="middle" font-size="28" fill="#79b851" font-family="monospace">✿✦✿</text>
    </svg>
  </div>
`;

// ========== Convert GPT Text to HTML ==========
function convertTextToHtml(text) {
  // Bold headers: "Header:"
  let html = text.replace(/^([A-Z][a-z ]+):$/gm, '<strong>$1:</strong>');
  // Bullet points: - or •
  html = html.replace(/^[-•]\s?(.*)/gm, '<li>$1</li>');
  // Wrap lists in <ul>
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
  // Basic paragraph breaks
  html = html.replace(/\n{2,}/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');
  return `<p>${html}</p>`;
}

// =========== Remove markdown and headings ===========
function cleanContent(content) {
  return content
    .replace(/^\s*#+\s*/gm, '') // Remove Markdown headings
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove markdown links
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove markdown images
    .replace(/\n{2,}/g, '\n') // Remove extra newlines
    .trim();
}

// =========== GPT Section Generation ===========
async function generateSection(section, language) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a gardening expert writing a newsletter in ${language}. Only output plain text, absolutely no markdown or HTML.`
      },
      { role: "user", content: section.prompt }
    ],
    temperature: 0.8
  });
  return response.choices[0].message.content;
}

// =========== Newsletter HTML Generator ===========
async function generateNewsletter(language) {
  let html = `
    <div style="background:#f5f5f5;padding:0;margin:0;font-family:'Segoe UI',Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
        <img src="${HERO_IMAGE_URL}" alt="Garden With Serge Hero" style="width:100%;height:240px;object-fit:cover;display:block;">
        <div style="padding:32px 20px 10px 20px;background:#79b851;color:#fff;text-align:center;">
          <h1 style="margin:0;font-size:2.3em;letter-spacing:1px;">🌱 Garden With Serge</h1>
          <div style="font-size:1.2em;margin-top:8px;">Your Weekly Garden Newsletter</div>
        </div>
        <div style="padding:24px;">
  `;

  for (const section of sections) {
    let content = await generateSection(section, language);
    content = cleanContent(content);

    html += `
      <section style="margin-bottom:24px;background:#f8fcf3;border-radius:12px;box-shadow:0 2px 10px rgba(121,184,81,0.07);padding:20px;">
        <h2 style="color:#79b851;font-size:1.35em;padding-bottom:8px;">${section.title}</h2>
        <div style="font-size:1.07em;line-height:1.7;">${convertTextToHtml(content)}</div>
      </section>
      ${fancyBreak}
    `;
  }

  html += `
        </div>
        <div style="background:linear-gradient(90deg,#f8fcf3 60%,#79b851 100%);
            padding:20px;text-align:center;font-size:0.95em;color:#333;border-radius:0 0 16px 16px;">
          You are receiving this email because you subscribed to Garden With Serge.<br>
          <a href="https://gardenwithserge.com/unsubscribe?email={{EMAIL}}" style="color:#79b851;font-weight:bold;">Unsubscribe</a> | &copy; ${new Date().getFullYear()} Garden With Serge
        </div>
      </div>
    </div>
  `;
  return html;
}

// =========== Get Active Subscribers from DB ===========
async function getActiveSubscribers(conn) {
  // Ensure newsletter_subscribers table exists
  await conn.execute(`CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    active TINYINT(1) NOT NULL DEFAULT 1,
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  // Get active emails
  const [rows] = await conn.execute('SELECT email FROM newsletter_subscribers WHERE active=1');
  return rows.map(row => row.email);
}

// =========== Send the newsletter email ===========
async function sendNewsletter(newsletterHtml, language, subscribers) {
  for (const email of subscribers) {
    // Replace {{EMAIL}} with the actual email in unsubscribe link
    const personalizedHtml = newsletterHtml.replace("{{EMAIL}}", encodeURIComponent(email));
    const mailOptions = {
      from: '"Garden With Serge" <news@gardenwithserge.com>',
      to: email,
      subject: `🌱 Weekly Garden Newsletter (${language})`,
      html: personalizedHtml
    };
    await transporter.sendMail(mailOptions);
    console.log(`Newsletter sent to ${email}`);
  }
}

// =========== Weekly Guard & Main function ===========
function getISOWeek(date) {
  const tmpDate = new Date(date.valueOf());
  const day = tmpDate.getUTCDay() || 7;
  tmpDate.setUTCDate(tmpDate.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(tmpDate.getUTCFullYear(), 0, 1));
  return Math.ceil(((tmpDate - yearStart) / 86400000 + 1) / 7);
}

async function checkAndLogNewsletter(conn) {
  // Ensure newsletter_log table exists
  await conn.execute(`CREATE TABLE IF NOT EXISTS newsletter_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sent_at DATETIME NOT NULL,
    week_year VARCHAR(8) NOT NULL,
    notes VARCHAR(255)
  )`);

  // Get current ISO week and year
  const now = new Date();
  const weekYear = `${now.getUTCFullYear()}-${getISOWeek(now)}`;

  // Check if already sent this week
  const [rows] = await conn.execute(
    'SELECT COUNT(*) AS count FROM newsletter_log WHERE week_year = ?',
    [weekYear]
  );

  if (rows[0].count > 0) {
    console.log(`Newsletter already sent for week ${weekYear}`);
    return false;
  }

  // Log the newsletter send after sending (upsert)
  conn._weekYear = weekYear;
  conn._now = now;
  return true;
}

async function main() {
  let conn;
  try {
    conn = await mysql.createConnection(MYSQL_CONFIG);

    // Weekly guard
    const shouldSend = await checkAndLogNewsletter(conn);
    if (!shouldSend) {
      await conn.end();
      return;
    }

    const language = NEWSLETTER_LANGUAGE;

    // Get active subscribers from database
    const subscribers = await getActiveSubscribers(conn);
    if (!subscribers.length) {
      console.log("No active subscribers to send to.");
      await conn.end();
      return;
    }

    const newsletterHtml = await generateNewsletter(language);
    await sendNewsletter(newsletterHtml, language, subscribers);

    // Log the send to newsletter_log
    await conn.execute(
      'INSERT INTO newsletter_log (sent_at, week_year, notes) VALUES (?, ?, ?)',
      [conn._now.toISOString().slice(0, 19).replace('T', ' '), conn._weekYear, 'Weekly newsletter sent']
    );

    await conn.end();
    console.log("All newsletters sent and logged!");
  } catch (error) {
    if (conn) await conn.end();
    console.error("Error generating or sending newsletter:", error);
  }
}

// =========== Unsubscribe HTTP Server ===========
function startUnsubscribeServer() {
  const server = http.createServer(async (req, res) => {
    const reqUrl = url.parse(req.url, true);
    if (reqUrl.pathname === "/unsubscribe" && req.method === "GET") {
      const email = reqUrl.query.email;
      if (!email) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end("<h2>Error: No email provided.</h2>");
        return;
      }
      let conn;
      try {
        conn = await mysql.createConnection(MYSQL_CONFIG);
        // Mark subscriber as inactive
        const [result] = await conn.execute(
          "UPDATE newsletter_subscribers SET active=0 WHERE email=?",
          [email]
        );
        await conn.end();
        if (result.affectedRows > 0) {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(`<h2>Your email (${email}) has been unsubscribed.<br><a href="/">Return to Garden With Serge</a></h2>`);
        } else {
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end(`<h2>Email (${email}) not found or already unsubscribed.</h2>`);
        }
      } catch (err) {
        if (conn) await conn.end();
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end(`<h2>Server error: ${err.message}</h2>`);
      }
    } else {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("<h2>404 Not Found</h2>");
    }
  });

  // Listen on port (e.g., 3000 or 8080)
  const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Unsubscribe server running on port ${PORT}`);
});
}

// Run both main (newsletter) and unsubscribe server if desired
if (require.main === module) {
  main();
  startUnsubscribeServer();
}