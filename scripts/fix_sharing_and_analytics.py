#!/usr/bin/env python3
"""Normalise Garden's social-share meta and install the GA4 tag.

Three defects this repairs, all found by auditing the live pages:

  1. No analytics anywhere on the site. The GA4 measurement ID was written
     down in public/GOOGLE_ANALYTICS_SETUP.md and then never installed, so
     Garden is the only site in the portfolio with no traffic data at all.
  2. og:image is absent on 13 of 22 pages, and on three it points at an image
     far below the 200x200 social minimum (container-gardening.jpg is 233x148,
     indoor-gardening.jpg 148x148, and plant-doctor used the 36x36 favicon).
     Those render as tiny thumbnails or nothing.
  3. twitter:card is present on only 4 of 22 pages, so shared links show no
     large preview.

Share images are never upscaled: a page keeps its own card only if that file
is at least 600px wide, otherwise it falls back to a 1200x630 brand card cut
from the existing hero photograph. Every page therefore ends with identical,
correct markup, and re-running this script changes nothing.
"""
import os
import re
import sys

from PIL import Image

PUB = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public")
PUB = os.path.normpath(PUB)
SITE = "https://www.gardenwithserge.com"
GA_ID = "G-52BQHQ8HL1"          # from public/GOOGLE_ANALYTICS_SETUP.md
BRAND_SRC = "hero-garden-pathway.jpg"
BRAND_OUT = "garden-share-card-1200x630.jpg"

GA_BLOCK = """  <!-- Google tag (gtag.js) - GA4 property for gardenwithserge.com -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=%s"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '%s');
  </script>
""" % (GA_ID, GA_ID)

SHARE_KEYS = ("og:image", "og:image:width", "og:image:height", "og:image:alt",
              "twitter:card", "twitter:image")


def brand_card():
    """Cut a 1200x630 card from the hero photo, once, without upscaling."""
    src = os.path.join(PUB, BRAND_SRC)
    dst = os.path.join(PUB, BRAND_OUT)
    if os.path.isfile(dst):
        return dst
    im = Image.open(src).convert("RGB")
    w, h = im.size
    if w < 1200:
        raise SystemExit(f"{BRAND_SRC} is only {w}px wide - cannot make a 1200px card")
    target_h = min(h, round(w * 630 / 1200))
    top = max(0, (h - target_h) // 2)
    im = im.crop((0, top, w, top + target_h)).resize((1200, 630), Image.LANCZOS)
    im.save(dst, "JPEG", quality=86, optimize=True, progressive=True)
    return dst


def head_of(html):
    m = re.search(r"</head>", html, re.I)
    return html[:m.start()] if m else ""


def grab(head, pattern):
    m = re.search(pattern, head, re.S | re.I)
    return m.group(1).strip() if m else ""


def dims(path):
    try:
        return Image.open(path).size
    except Exception:
        return (0, 0)


def share_target(html, head):
    """The image this page should advertise, its real size, and why."""
    cur = grab(head, r'<meta[^>]+property="og:image"[^>]+content="([^"]*)"')
    if cur:
        name = cur.rsplit("/", 1)[-1]
        path = os.path.join(PUB, name)
        if os.path.isfile(path):
            w, h = dims(path)
            if w >= 600:
                return cur, (w, h), "kept (own card, %dx%d)" % (w, h)
            return SITE + "/" + BRAND_OUT, (1200, 630), "brand card (own art only %dpx)" % w
        return SITE + "/" + BRAND_OUT, (1200, 630), "brand card (referenced file missing)"
    return SITE + "/" + BRAND_OUT, (1200, 630), "brand card (no og:image)"


def strip_share_meta(head):
    out = head
    for key in SHARE_KEYS:
        prop = "property" if key.startswith("og:") else "name"
        out = re.sub(r'[ \t]*<meta[^>]+%s="%s"[^>]*>\r?\n?' % (prop, re.escape(key)), "", out, flags=re.I)
    return out


def insert_share_block(head, url, alt, size, nl):
    """Insert the share block using the page's own line ending.

    The advertised width/height must be the real dimensions of the file: a
    1200x675 hero declared as 1200x630 makes some scrapers crop it wrongly.
    """
    block = nl.join([
        '  <meta property="og:image" content="%s">' % url,
        '  <meta property="og:image:width" content="%d">' % size[0],
        '  <meta property="og:image:height" content="%d">' % size[1],
        '  <meta property="og:image:alt" content="%s">' % alt,
        '  <meta name="twitter:card" content="summary_large_image">',
        '  <meta name="twitter:image" content="%s">' % url,
        '',
    ])
    # after the last og:* meta line, so the share block stays in one place
    last = None
    for m in re.finditer(r'[ \t]*<meta[^>]+property="og:[^"]+"[^>]*>\r?\n', head, re.I):
        last = m
    if last:
        at = last.end()
        return head[:at] + block + head[at:]
    # otherwise directly before canonical, or failing that before </head>
    for pat in (r'[ \t]*<link[^>]+rel="canonical"[^>]*>', r'[ \t]*<title', r'\s*$'):
        m = re.search(pat, head, re.I)
        if m:
            return head[:m.start()] + block + head[m.start():]
    return head + block


def strip_analytics(html):
    """Remove a previously inserted GA block so it can be rewritten cleanly."""
    return re.sub(
        r"[ \t]*<!-- Google tag \(gtag\.js\).*?gtag\('config', '%s'\);\s*</script>\r?\n" % GA_ID,
        "", html, flags=re.S | re.I)


def add_analytics(html, nl):
    """Install the GA4 tag once, with this page's line endings."""
    html = strip_analytics(html)
    m = re.search(r"[ \t]*</head>", html, re.I)
    if not m:
        return html, False
    return html[:m.start()] + GA_BLOCK.replace("\n", nl) + html[m.start():], True


def ensure_canonical(html, url, nl):
    if re.search(r'rel="canonical"', html, re.I):
        return html, False
    m = re.search(r"[ \t]*<title", html, re.I) or re.search(r"[ \t]*</head>", html, re.I)
    if not m:
        return html, False
    tag = '  <link rel="canonical" href="%s">%s' % (url, nl)
    return html[:m.start()] + tag + html[m.start():], True


def ensure_noindex(html, nl):
    if re.search(r'name="robots"[^>]*noindex', html, re.I):
        return html, False
    m = re.search(r"[ \t]*<title", html, re.I) or re.search(r"[ \t]*</head>", html, re.I)
    if not m:
        return html, False
    tag = '  <meta name="robots" content="noindex, follow">%s' % nl
    return html[:m.start()] + tag + html[m.start():], True


def main():
    card = brand_card()
    print("brand card:", os.path.basename(card), Image.open(card).size)

    # pages that are utility endpoints, not content: they should never rank
    NOINDEX = {"newsletter_form.html", "verify-payment-setup.html", "404.html",
               "payment-cancel.html", "payment-success.html"}
    # indexable utility pages that were simply missing a canonical
    CANONICAL = {"billing-support.html"}

    changed, report = 0, []
    for name in sorted(os.listdir(PUB)):
        if not name.endswith(".html"):
            continue
        path = os.path.join(PUB, name)
        with open(path, encoding="utf-8", newline="") as fh:
            html = fh.read()
        # A fragment (an include with no <head>) has nowhere to put meta tags:
        # writing them at the top of the file would inject them into the body
        # of whatever page includes it.
        if not re.search(r"</head>", html, re.I):
            report.append((name, "skipped (fragment, no <head>)"))
            continue
        orig = html
        nl = "\r\n" if "\r\n" in html else "\n"
        url = SITE + "/" + name

        head = head_of(html)
        image, size, why = share_target(html, head)
        alt = grab(head, r'<meta[^>]+property="og:image:alt"[^>]+content="([^"]*)"')
        if not alt:
            title = grab(head, r"<title[^>]*>(.*?)</title>")
            alt = title.split("|")[0].strip() or "Garden with Serge"
        alt = alt.replace('"', "&quot;")

        new_head = insert_share_block(strip_share_meta(head), image, alt, size, nl)
        html = new_head + html[len(head):]

        html, ga = add_analytics(html, nl)
        if name in CANONICAL:
            html, canon = ensure_canonical(html, url, nl)
        else:
            canon = False
        if name in NOINDEX:
            html, noidx = ensure_noindex(html, nl)
        else:
            noidx = False

        if html != orig:
            with open(path, "w", encoding="utf-8", newline="") as fh:
                fh.write(html)
            changed += 1
        bits = [why]
        if ga: bits.append("GA4")
        if canon: bits.append("canonical")
        if noidx: bits.append("noindex")
        report.append((name, ", ".join(bits)))

    for name, bits in report:
        print(f"  {name:52} {bits}")
    print(f"\n{changed} of {len(report)} files written")


if __name__ == "__main__":
    main()
