# GardenWithSerge – Live Backend README

*Last updated: 2025‑08‑12*

This document captures the **working production setup** for the AI features on **[www.gardenwithserge.com](http://www.gardenwithserge.com)**.
It’s designed so you (or any helper) can verify health quickly, deploy safely, and recover fast if something breaks.

---

## 1) High‑level

**Stack in prod (AI features only):**

* **PHP endpoints** serve all AI requests.
* **OpenAI key is loaded from a key file** (not from `.env`, not from Node).
* **Apache/LiteSpeed** routes `/api/*` and legacy paths to these PHP endpoints via **.htaccess** (internal rewrite).
* Node can remain running for other features, but **does not handle AI**.

```
Browser  →  /api/plant-*   ──(rewrite)──>  /backend/plant-*.php  ──> OpenAI
```

---

## 2) File layout (production)

```
/home/sergbcqk/
  garden/                                  # shared app folder
    openai_gws.key                         # OpenAI project key (single line)
    vendor/…                               # composer packages (for check tools if used)

  gardenwithserge.com/                     # site root (document root)
    .htaccess                              # owns routing to PHP endpoints (see §4)
    backend/
      plant-identify.php                   # Identify plant (image → name)
      plant-analyze.php                    # Analyze plant health (image → tips)
      plant-benefits.php                   # Benefits for plant name
      plant-identify-real-test2.html       # Minimal POST test (no JS)
      plant-benefits-test.html             # Minimal POST test (no JS)
    green_thumb_members_dashboard.php      # Frontend page that calls APIs
```

> Keep a backup of the 3 PHP endpoint files and `.htaccess` once verified.

---

## 3) OpenAI key management

**Key source of truth (prod):**

```
/home/sergbcqk/garden/openai_gws.key
```

* Contains exactly one line: `sk-proj-…`
* No quotes, no spaces, no trailing newline if possible.
* Recommended permissions: `600` (owner read/write).

**Why this method?** It avoids issues with `.env` parsing, Node env vars, and stale keys in `.htaccess`.

---

## 4) .htaccess (top of site root)

Place these rules **at the very top** of:

```
/home/sergbcqk/gardenwithserge.com/.htaccess
```

```apache
# BEGIN GWS API (PHP only)
RewriteEngine On
# Canonical host – optional but recommended
RewriteCond %{HTTP_HOST} !^www\.gardenwithserge\.com$ [NC]
RewriteRule ^(.*)$ https://www.gardenwithserge.com/$1 [L,R=301]

# Route API & legacy calls directly to PHP endpoints
RewriteRule ^api/plant-identify$ backend/plant-identify.php [QSA,L]
RewriteRule ^api/plant-analyze$  backend/plant-analyze.php  [QSA,L]
RewriteRule ^api/plant-benefits$ backend/plant-benefits.php [QSA,L]
RewriteRule ^get_plant_benefits\.php$ backend/plant-benefits.php [QSA,L]
# END GWS API
```

> Ensure **any `SetEnv OPENAI_API_KEY …` lines are removed or commented out** (they can inject an old key).
> Keep the CloudLinux Passenger/Node block **below** this API block so PHP routing always wins for AI.

---

## 5) Endpoints (contracts)

### 5.1 Identify – `/api/plant-identify` → `backend/plant-identify.php`

* **Method:** `POST`
* **Accepts:**

  * `multipart/form-data` with `image` (file input), **or**
  * JSON `{ "imageData": "data:<mime>;base64,..." }`
* **Returns (200):**

```json
{
  "plantName": "Tomato",
  "scientificName": "Solanum lycopersicum",
  "confidence": 0.95
}
```

### 5.2 Analyze – `/api/plant-analyze` → `backend/plant-analyze.php`

* **Method:** `POST`
* **Accepts:** same image formats as Identify; optional `plantName` for extra context
* **Returns (200):**

```json
{
  "healthStatus": "healthy | minor_issue | diseased | unknown",
  "diseaseAnalysis": "text",
  "careRecommendations": ["tip1","tip2","tip3"]
}
```

### 5.3 Benefits – `/api/plant-benefits` and legacy `/get_plant_benefits.php`

* **Method:** `POST`
* **Accepts:** `plantName` via any of these keys: `plantName`, `plant`, `name`, `plant_name`, `identifiedPlant`, `identified_name`, `commonName`, `title`; optional `language` (defaults `en`); optional `scientificName`.
* **Returns (200):**

```json
{
  "benefits": ["…", "…", "…"]
}
```

---

## 6) Health checks (bookmark these)

* Identify ping:
  `https://www.gardenwithserge.com/api/plant-identify?ping=1` → `ok`
* Analyze key check:
  `https://www.gardenwithserge.com/api/plant-analyze?check=openai` → `{ "status": 200 }`
* Benefits key check:
  `https://www.gardenwithserge.com/api/plant-benefits?check=openai` → `{ "status": 200 }`

**Direct PHP checks (bypass rewrites):**

* `https://www.gardenwithserge.com/backend/plant-identify.php?ping=1`
* `https://www.gardenwithserge.com/backend/plant-analyze.php?check=openai`
* `https://www.gardenwithserge.com/backend/plant-benefits.php?check=openai`

---

## 7) Quick local/remote tests

**No‑JS form tests (live):**

* Identify: `…/backend/plant-identify-real-test2.html`
* Benefits: `…/backend/plant-benefits-test.html`

**cURL examples (from your laptop):**

```bash
# Identify (multipart)
curl -F image=@tomato.jpg https://www.gardenwithserge.com/api/plant-identify

# Analyze (multipart + name)
curl -F image=@tomato.jpg -F plantName=Tomato https://www.gardenwithserge.com/api/plant-analyze

# Benefits (form)
curl -X POST -d "plantName=Tomato&language=en" https://www.gardenwithserge.com/api/plant-benefits
```

---

## 8) Deployment checklist

1. **Upload endpoint PHP files** to `gardenwithserge.com/backend/`.
2. **Ensure key file** exists at `/home/sergbcqk/garden/openai_gws.key`.
3. **Install or update `.htaccess`** top block in site root (see §4).
4. **Hard refresh browser** (Ctrl+F5) after changes.
5. **Run health checks** (see §6). All must pass.
6. Test Identify → Analyze → Benefits in UI.

> If Node is needed for other features, you may **Restart** the Node app in cPanel; AI routes still go to PHP.

---

## 9) Troubleshooting (fast paths)

* **“Failed to fetch” in browser** → Mixed `www` vs non‑`www`. Ensure canonical redirect to **www** is active (see §4). Hard refresh.
* **OpenAI error: Incorrect API key** → Old key from env or `.htaccess`. Remove any `SetEnv OPENAI_API_KEY …` lines. Confirm key file is correct and readable.
* **401 from `?check=openai`** → Bad key. Paste fresh `sk-proj-…` into `openai_gws.key` (single line).
* **502 AI\_CALL\_FAILED** → Temporary API/network issue or image too large. Try a smaller image (≤2 MB). If persistent, check server error log.
* **No benefits found** → Check that form sends a supported field name (see §5.3). Endpoint already accepts multiple keys.

---

## 10) Security & cost tips

* Keep `openai_gws.key` private (`chmod 600`) and out of web root.
* Never commit keys to Git; add examples in `*.example` files only.
* Consider a simple server‑side rate limit and image size cap (e.g., 2–4 MB) to control spend.
* Add minimal logging of errors (to a non‑public dir) for quick incident diagnosis.

---

## 11) Staging recommendation (optional)

* Create `staging.gardenwithserge.com` → copy `backend/` and `.htaccess` block.
* Point to the same `openai_gws.key` or a staging key.
* Verify `?check=openai` and form tests before pushing to live.

---

## 12) Hand‑off notes for developers

* **Do not** change routing for AI in Node; PHP is the canonical backend for AI.
* **Do not** add `SetEnv OPENAI_API_KEY` lines in `.htaccess`.
* **If you must change endpoints**, mirror the contracts in §5 and update the .htaccess rules accordingly.
* **PRs must include**: updated README section, health‑check results, and a test screenshot of JSON output.

---

### Appendix A — Minimal CORS helper (only if you ever need cross‑origin)

*Add these at the top of a PHP endpoint **only if** you must accept requests from the non‑canonical origin.*

```php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, [
  'https://www.gardenwithserge.com',
  'https://gardenwithserge.com',
], true)) {
  header("Access-Control-Allow-Origin: $origin");
  header('Vary: Origin');
  header('Access-Control-Allow-Credentials: true');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  header('Access-Control-Allow-Methods: POST, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type, Authorization');
  http_response_code(204);
  exit;
}
```

---

**You can paste this README into the repo at** `README-AI.md` and keep it updated whenever endpoints or routing change.
