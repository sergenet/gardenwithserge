// beginners-weekly/generateBeginnersWeekly.js
// Loads the Beginners Weekly OpenAI key from garden/.env (no secrets in code)

require('dotenv').config({ path: require('path').join(__dirname, '..', 'garden', '.env') });

// Use the dedicated Beginners Weekly key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY_BEGINNERS;

// Quick sanity check (won't print the key)
if (!OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY_BEGINNERS is missing. Add it to garden/.env");
  process.exit(1);
}

// Placeholder function — call your real generation code here later
async function run() {
  console.log("Beginners Weekly is wired to use OPENAI_API_KEY_BEGINNERS from .env");
  // Example: here you would initialize your OpenAI client with OPENAI_API_KEY
  // and generate content. We keep it simple for now.
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
