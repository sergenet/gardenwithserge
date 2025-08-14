<?php
session_start();
if (!isset($_SESSION['user_id'])) { header('Location: login.php'); exit; }
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Beginner Guides</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body{background:#f6f8f7}
    .card{background:#fff;border:1px solid #CDE7D8;border-radius:14px;box-shadow:0 1px 2px rgba(0,0,0,.03)}
    .pill{background:#e8f4ee;color:#145a32;border-radius:9999px;padding:.15rem .6rem;font-size:.8rem}
    .toc a{display:block;padding:.35rem .5rem;border-radius:.5rem}
    .toc a:hover{background:#ecfdf5}
  </style>
</head>
<body class="text-slate-800">
  <nav class="w-full bg-white border-b border-green-100 shadow-sm sticky top-0 z-20">
    <div class="max-w-6xl mx-auto flex items-center gap-4 px-4 py-2">
      <a href="/basic_members_dashboard.php" class="text-green-700 font-semibold hover:underline">← Back to Dashboard</a>
      <span class="pill">Beginner Guides</span>
    </div>
  </nav>

  <main class="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
    <aside class="card p-4 toc h-max">
      <div class="font-semibold mb-2 text-green-800">Topics</div>
      <a href="#watering">Watering Basics</a>
      <a href="#soil">Soil & Potting Mix</a>
      <a href="#sunlight">Sunlight & Placement</a>
      <a href="#fertilizer">Fertilizing 101</a>
      <a href="#pruning">Pruning & Deadheading</a>
      <a href="#pests">Pests & Diseases</a>
      <a href="#propagation">Propagation (Cuttings/Seeds)</a>
      <a href="#repotting">Repotting & Containers</a>
      <a href="#seasonal">Seasonal Care</a>
      <a href="#herbs">Growing Kitchen Herbs</a>
    </aside>

    <section class="md:col-span-2 space-y-6">
      <article id="watering" class="card p-5">
        <h2 class="text-2xl font-bold text-green-800 mb-2">Watering Basics</h2>
        <p>Check soil moisture with your finger 2–3 cm deep. Water thoroughly, then let excess drain. Most plants prefer consistent, not constant, moisture.</p>
        <ul class="list-disc ml-6 mt-2">
          <li>Morning watering reduces evaporation and disease risk.</li>
          <li>Use room-temperature water.</li>
          <li>Overwatering is more common than underwatering.</li>
        </ul>
      </article>

      <article id="soil" class="card p-5">
        <h2 class="text-2xl font-bold text-green-800 mb-2">Soil & Potting Mix</h2>
        <p>Use well-draining mixes. Add perlite/bark for drainage, compost for nutrients. Avoid heavy garden soil in pots.</p>
      </article>

      <article id="sunlight" class="card p-5">
        <h2 class="text-2xl font-bold text-green-800 mb-2">Sunlight & Placement</h2>
        <p>Match plant needs: “full sun” = 6–8 h direct; “bright indirect” = near a sunny window, not in sunbeams.</p>
      </article>

      <article id="fertilizer" class="card p-5">
        <h2 class="text-2xl font-bold text-green-800 mb-2">Fertilizing 101</h2>
        <p>During active growth, feed lightly every 2–4 weeks. Flush pots occasionally to prevent salt buildup.</p>
      </article>

      <article id="pruning" class="card p-5">
        <h2 class="text-2xl font-bold text-green-800 mb-2">Pruning & Deadheading</h2>
        <p>Remove dead/diseased growth. Pinch tips to encourage branching. Sterilize tools between plants.</p>
      </article>

      <article id="pests" class="card p-5">
        <h2 class="text-2xl font-bold text-green-800 mb-2">Pests & Diseases</h2>
        <p>Inspect undersides of leaves. Treat early with insecticidal soap or neem. Improve airflow to reduce fungal issues.</p>
      </article>

      <article id="propagation" class="card p-5">
        <h2 class="text-2xl font-bold text-green-800 mb-2">Propagation (Cuttings/Seeds)</h2>
        <p>Softwood cuttings root fast in humid warmth. Use sterile medium; label and date your starts.</p>
      </article>

      <article id="repotting" class="card p-5">
        <h2 class="text-2xl font-bold text-green-800 mb-2">Repotting & Containers</h2>
        <p>Repot when roots circle the pot or water runs straight through. Move up 2–5 cm only; add fresh mix.</p>
      </article>

      <article id="seasonal" class="card p-5">
        <h2 class="text-2xl font-bold text-green-800 mb-2">Seasonal Care</h2>
        <p>Adjust water/light with seasons. Protect from frost; provide shade in extreme heat.</p>
      </article>

      <article id="herbs" class="card p-5">
        <h2 class="text-2xl font-bold text-green-800 mb-2">Growing Kitchen Herbs</h2>
        <p>Basil, parsley, mint, chives are great starters. Bright light, frequent trimming, well-draining mix.</p>
      </article>
    </section>
  </main>
</body>
</html>
