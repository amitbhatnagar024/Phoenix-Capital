"""Download the site's Unsplash photos so they are served from your own server.

Run from the project root on a computer with internet access:
    python3 tools/fetch_photos.py
    node build.mjs
Photos are saved to src/static/assets/img/photo/stock/. The build then uses
these local copies automatically instead of loading them from Unsplash.
(Photos are free to use under the Unsplash License: https://unsplash.com/license)
"""
import json, os, subprocess, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "src", "static", "assets", "img", "photo", "stock")
WIDTHS = [640, 960, 1280, 1920, 2560]

photos = json.loads(subprocess.check_output(
    ["node", "-e", "import('./src/config.mjs').then(m => console.log(JSON.stringify(m.photos)))"], cwd=ROOT))
os.makedirs(OUT, exist_ok=True)
for name, p in photos.items():
    for w in WIDTHS:
        url = f"https://images.unsplash.com/{p['id']}?fm=jpg&fit=crop&q=72&w={w}"
        dest = os.path.join(OUT, f"{name}-{w}.jpg")
        req = urllib.request.Request(url, headers={"User-Agent": "phoenix-capital-site-build"})
        with urllib.request.urlopen(req, timeout=60) as r, open(dest, "wb") as f:
            f.write(r.read())
        print("saved", os.path.relpath(dest, ROOT))
print("Done. Now run: node build.mjs")
