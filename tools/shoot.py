"""Screenshot pages of the built site. Usage: python3 shoot.py <outdir> <path> [<path>...]
Env: W (width, default 1440), FULL=1 for full page, H (height)."""
import sys, os, asyncio
from playwright.async_api import async_playwright

out = sys.argv[1]; paths = sys.argv[2:]
W = int(os.environ.get("W", 1440)); H = int(os.environ.get("H", 900)); FULL = os.environ.get("FULL", "1") == "1"
os.makedirs(out, exist_ok=True)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        ctx = await b.new_context(viewport={"width": W, "height": H}, device_scale_factor=1)
        page = await ctx.new_page()
        errs = []
        page.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errs.append(str(e)))
        for path in paths:
            await page.goto(f"http://localhost:8765/{path}", wait_until="networkidle")
            # reveal everything for a static capture
            await page.evaluate("""() => { document.querySelectorAll('[data-reveal]').forEach(e => e.classList.add('is-in')); }""")
            if os.environ.get("CONSENT") != "keep":
                await page.evaluate("""() => { const b = document.getElementById('cookie-banner'); if (b) b.hidden = true; }""")
            await page.evaluate("""() => document.querySelectorAll('img[loading=lazy]').forEach(i => i.loading = 'eager')""")
            await page.evaluate("""async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 140)); } window.scrollTo(0, 0); }""")
            await page.wait_for_timeout(1600)
            name = (path.strip("/").replace("/", "_") or "home") + f"_{W}.png"
            await page.screenshot(path=os.path.join(out, name), full_page=FULL)
            print("shot", name)
        if errs: print("ERRORS:", errs)
        await b.close()

asyncio.run(main())
