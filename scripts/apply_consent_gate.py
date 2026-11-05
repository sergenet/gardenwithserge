#!/usr/bin/env python3
"""Gate AdSense and GA4 behind Garden's cookie banner.

Removes the eager loaders that were put in every page's <head> and replaces
them with /consent.js, which only requests the third-party scripts after a
visitor presses Accept.

Idempotent: pages that already reference consent.js are reported and skipped.

Usage:
  python scripts/apply_consent_gate.py [--dry-run]
"""

import re
import sys
from pathlib import Path

PUBLIC = Path(__file__).resolve().parent.parent / "public"
CLIENT = "ca-pub-0467059729557007"
GA_ID = "G-52BQHQ8HL1"

# The AdSense loader, with whatever comment happened to precede it.
ADS_RE = re.compile(
    r"(?:[ \t]*<!--[^\n]*Google AdSense[^\n]*-->\r?\n)?"
    r"[ \t]*<script[^>]*pagead2\.googlesyndication\.com/pagead/js/adsbygoogle\.js\?client="
    + re.escape(CLIENT)
    + r"[^>]*>\s*</script>[ \t]*\r?\n?",
    re.I,
)

# The gtag loader plus the inline config block that used it.
GTAG_RE = re.compile(
    r"(?:[ \t]*<!--[^\n]*gtag\.js[^\n]*-->\r?\n)?"
    r"[ \t]*<script[^>]*googletagmanager\.com/gtag/js\?id=" + re.escape(GA_ID)
    + r"[^>]*>\s*</script>[ \t]*\r?\n?"
    r"[ \t]*<script>\s*"
    r"window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\];.*?gtag\(\s*['\"]config['\"]\s*,\s*['\"]"
    + re.escape(GA_ID) + r"['\"]\s*\);\s*</script>[ \t]*\r?\n?",
    re.S,
)

# .htaccess marks every .js/.css "public, max-age=31536000, immutable", so a
# changed consent.js would never reach anyone who already has it. Bump this
# whenever consent.js or consent.css changes, as app.min.js?v=N already does.
CONSENT_VERSION = "2"

GATE = (
    '  <!-- AdSense and GA4 are loaded by consent.js only after the visitor accepts. -->\n'
    '  <link rel="stylesheet" href="/consent.css?v=' + CONSENT_VERSION + '">\n'
    '  <script src="/consent.js?v=' + CONSENT_VERSION + '" defer></script>\n'
)


def version_refs(path: Path, raw: str, dry_run: bool) -> str:
    """Add ?v=N to consent.css / consent.js links that lack one."""
    out = raw
    out = re.sub(r'(/consent\.css)(?!\?v=)', r'\1?v=' + CONSENT_VERSION, out)
    out = re.sub(r'(/consent\.js)(?!\?v=)', r'\1?v=' + CONSENT_VERSION, out)
    if out == raw:
        return "skip (already gated)"
    if not dry_run:
        with open(path, "w", encoding="utf-8", newline="") as handle:
            handle.write(out)
    return "versioned refs (v%s)" % CONSENT_VERSION


def process(path: Path, dry_run: bool) -> str:
    with open(path, encoding="utf-8", newline="") as handle:
        raw = handle.read()
    if "consent.js" in raw:
        return version_refs(path, raw, dry_run)

    original = raw
    raw, n_ads = ADS_RE.subn("", raw)
    raw, n_gtag = GTAG_RE.subn("", raw)

    # newsletter_form.html is an embeddable <form> fragment with no document
    # head, so it carries no loaders and needs no gate.
    if not raw.count("</head>"):
        if raw.lstrip().startswith("<form"):
            return "skip (html fragment)"
        return "FAIL no </head>"
    if "consent.js" in raw:
        return "skip (already gated)"

    raw = raw.replace("</head>", GATE + "</head>", 1)

    # Guard rails: the gate must be the only loader left, and the head must survive.
    leftover = raw.count("googletagmanager.com/gtag/js") + raw.count("pagead2.googlesyndication.com")
    if leftover:
        return "FAIL third-party loader still in HTML (x%d)" % leftover
    if raw.count("<head>") != raw.count("</head>"):
        return "FAIL unbalanced head"

    changed = raw != original
    if changed and not dry_run:
        with open(path, "w", encoding="utf-8", newline="") as handle:
            handle.write(raw)
    return "gated (ads=%d gtag=%d)" % (n_ads, n_gtag)


def main():
    dry_run = "--dry-run" in sys.argv
    pages = sorted(PUBLIC.glob("*.html"))
    counts = {}
    for page in pages:
        result = process(page, dry_run)
        print("%-52s %s" % (page.name, result))
        key = result.split(" (")[0]
        counts[key] = counts.get(key, 0) + 1
    print()
    for key in sorted(counts):
        print("%-30s %d" % (key, counts[key]))
    print("\n%d pages surveyed%s" % (len(pages), " (dry run, nothing written)" if dry_run else ""))
    return 1 if any(k.startswith("FAIL") for k in counts) else 0


if __name__ == "__main__":
    raise SystemExit(main())
