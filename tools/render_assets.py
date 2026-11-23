"""Render the Open Graph image and the placeholder criteria sheet PDF from the built site's assets.
Usage: python3 tools/render_assets.py  (run from project root after `node build.mjs`)"""
import asyncio, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from playwright.async_api import async_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
D = ROOT / "dist"; S = ROOT / "src/static"
fonts = f"""
@font-face{{font-family:C;font-weight:300;src:url('file://{D}/assets/fonts/cormorant-garamond-latin-300-normal.woff2')}}
@font-face{{font-family:C;font-style:italic;font-weight:300;src:url('file://{D}/assets/fonts/cormorant-garamond-latin-300-italic.woff2')}}
@font-face{{font-family:I;font-weight:100 900;src:url('file://{D}/assets/fonts/inter-latin-wght-normal.woff2')}}"""

OG = f"""<html><head><style>{fonts} body{{margin:0;width:1200px;height:630px;background:#FAF8F5;font-family:I;color:#1E2227;position:relative;overflow:hidden}}
.s{{position:absolute;top:0;right:0;bottom:0;width:430px;background:url('file://{D}/assets/img/photo/hero-city-day-1200.jpg') center/cover}} .s:after{{content:'';position:absolute;inset:0;background:linear-gradient(90deg,#FAF8F5,rgba(250,248,245,0) 40%)}} .r{{position:absolute;left:0;right:0;bottom:0;height:6px;background:linear-gradient(90deg,#F17823,#F6AE13)}}.c{{position:absolute;left:80px;bottom:90px;right:80px}}
.e{{font-size:15px;letter-spacing:.2em;text-transform:uppercase;color:#C4202E;font-weight:600}} h1{{font-family:C;font-weight:300;font-size:84px;line-height:1;margin:24px 0 0;letter-spacing:-.02em}} h1 em{{color:#D2461C}}
.b{{position:absolute;left:80px;top:60px}} .b img{{height:110px}} .c{{right:470px}} h1{{font-size:68px}}</style></head>
<body><div class=s></div><div class=b><img src='file://{D}/assets/img/brand/phoenix-capital-logo.svg'></div><div class=r></div><div class=c><div class=e>Specialist property finance · phoenix-capital.uk</div><h1>Decisive capital for property <em>and business.</em></h1></div></body></html>"""
SHEET = f"""<html><head><style>{fonts} @page{{size:A4;margin:0}} body{{margin:0;font-family:I;color:#1A1D21;background:#FAF8F5;width:210mm;height:297mm;position:relative}}
header{{background:#fff;color:#1E2227;padding:14mm 18mm 10mm;border-bottom:3px solid #F17823}} header img{{height:24mm}} h1{{font-family:C;font-weight:300;font-size:40px;margin:10px 0 0}} .e{{font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#C4202E;font-weight:600;margin-top:6mm}}
main{{padding:12mm 18mm}} table{{width:100%;border-collapse:collapse;font-size:10px}} th,td{{text-align:left;padding:8px 6px;border-bottom:1px solid rgba(133,101,42,.35)}} th{{font-size:8px;letter-spacing:.16em;text-transform:uppercase;color:#5B6068;font-weight:500}}
td:first-child{{font-family:C;font-size:15px}} .ph{{display:inline-block;border:1px dashed #9A4E25;color:#9A4E25;font-size:8px;letter-spacing:.18em;padding:4px 8px;text-transform:uppercase;margin-bottom:10mm}}
footer{{position:absolute;bottom:12mm;left:18mm;right:18mm;font-size:7.5px;line-height:1.6;color:#5B6068;border-top:1px solid rgba(133,101,42,.35);padding-top:4mm}}</style></head><body>
<header><img src='file://{D}/assets/img/brand/phoenix-capital-logo.svg'><div class=e>Lending criteria · For intermediary use</div></header><main><span class=ph>Placeholder document — figures to be confirmed</span>
<table><tr><th>Product</th><th>Loan size</th><th>Max LTV</th><th>Term</th><th>Rates from</th></tr>
{''.join(f'<tr><td>{p}</td><td>£[X] – £[Y]</td><td>[X]%</td><td>[X]–[Y] months</td><td>[X]% pm</td></tr>' for p in ['Bridging Finance','Refurbishment Finance','Development Finance','Auction Finance','Commercial Bridging','Business Loans'])}
</table><p style="font-size:10px;margin-top:10mm">Enquiries: enquiries@phoenix-capital.uk · [020 XXXX XXXX] · phoenix-capital.uk</p></main>
<footer>Phoenix Capital provides loans for business and investment purposes only. Our loans are not regulated by the Financial Conduct Authority. We do not lend on properties that are, or will be, occupied by the borrower or a member of their family. All loans are subject to status, valuation and underwriting. Your property may be repossessed if you do not keep up repayments on a loan secured on it.<br>Phoenix Capital is a trading name of Phoenix Accountancy Service Ltd. Registered in England and Wales, company number 08778431. Registered office: 21 Heath Drive, Romford, Essex, RM2 5QH.</footer></body></html>"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox", "--allow-file-access-from-files"])
        pg = await b.new_page(viewport={"width": 1200, "height": 630})
        (ROOT / "tools/_og.html").write_text(OG); await pg.goto(f"file://{ROOT}/tools/_og.html"); await pg.wait_for_timeout(500)
        await pg.screenshot(path=str(S / "assets/img/og-default.jpg"), type="jpeg", quality=85)
        (ROOT / "tools/_sheet.html").write_text(SHEET); await pg.goto(f"file://{ROOT}/tools/_sheet.html"); await pg.wait_for_timeout(500)
        await pg.pdf(path=str(S / "assets/docs/phoenix-capital-criteria-sheet.pdf"), format="A4", print_background=True)
        await b.close()
    for f in ("_og.html", "_sheet.html"): (ROOT / "tools" / f).unlink()
asyncio.run(main())
print("rendered og-default.jpg and criteria sheet PDF")
