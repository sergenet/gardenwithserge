const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3001; // Change if needed

// Use your actual DB credentials
const MYSQL_CONFIG = {
  host: 'localhost',
  user: 'sergbcqk_gardenwithserge_user',
  password: 'Sako!!GWS2025',
  database: 'sergbcqk_gardenwithserge_db'
};

app.get('/', async (req, res) => {
  let conn;
  try {
    conn = await mysql.createConnection(MYSQL_CONFIG);

    // Total active subscribers
    const [activeRows] = await conn.execute(
      'SELECT COUNT(*) as count FROM newsletter_subscribers WHERE active=1'
    );

    // Recent signups (last 7 days)
    const [recentSignupRows] = await conn.execute(
      "SELECT email, subscribed_at FROM newsletter_subscribers WHERE active=1 AND subscribed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) ORDER BY subscribed_at DESC"
    );

    // Recent unsubscribes (last 7 days)
    const [recentUnsubRows] = await conn.execute(
      "SELECT email, unsubscribed_at FROM newsletter_subscribers WHERE active=0 AND unsubscribed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) ORDER BY unsubscribed_at DESC"
    );

    // Last newsletter sent
    const [lastSentRows] = await conn.execute(
      "SELECT sent_at FROM newsletter_log ORDER BY sent_at DESC LIMIT 1"
    );

    res.send(`
      <h1>Garden Newsletter Admin Dashboard</h1>
      <h2>Total Active Subscribers: ${activeRows[0].count}</h2>
      <h3>Recent Signups (last 7 days)</h3>
      <ul>
        ${recentSignupRows.map(row => `<li>${row.email} &mdash; ${row.subscribed_at}</li>`).join('')}
      </ul>
      <h3>Recent Unsubscribes (last 7 days)</h3>
      <ul>
        ${recentUnsubRows.map(row => `<li>${row.email} &mdash; ${row.unsubscribed_at}</li>`).join('')}
      </ul>
      <h3>Last Newsletter Sent: ${lastSentRows[0] ? lastSentRows[0].sent_at : "Never"}</h3>
    `);

  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  } finally {
    if (conn) await conn.end();
  }
});

app.listen(PORT, () => {
  console.log(`Admin dashboard running at http://localhost:${PORT}/`);
});