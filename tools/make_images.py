"""Generate original tonal placeholder images for the Phoenix Capital site.

These are abstract, original compositions (no stock, no people) intended to be
replaced by licensed photography. Each is written at two widths for srcset.
Usage: python3 make_images.py <output_dir>
"""
import sys, os, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)

MID = (11, 15, 20)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def vgrad(w, h, stops):
    """stops: list of (pos 0..1, (r,g,b))"""
    arr = np.zeros((h, w, 3), dtype=np.float32)
    ys = np.linspace(0, 1, h)
    for c in range(3):
        xp = [s[0] for s in stops]
        fp = [s[1][c] for s in stops]
        arr[:, :, c] = np.interp(ys, xp, fp)[:, None]
    return arr


def radial(arr, cx, cy, r, color, strength):
    h, w, _ = arr.shape
    yy, xx = np.mgrid[0:h, 0:w]
    d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / r
    m = np.clip(1 - d, 0, 1) ** 2 * strength
    for c in range(3):
        arr[:, :, c] = arr[:, :, c] * (1 - m) + color[c] * m
    return arr


def finish(arr, name, grain=7, vignette=0.35, sizes=(1200, 2400), quality=78):
    h, w, _ = arr.shape
    yy, xx = np.mgrid[0:h, 0:w]
    d = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
    v = 1 - np.clip(d - 0.55, 0, 1) * vignette
    arr = arr * v[:, :, None]
    rng = np.random.default_rng(7)
    arr = arr + rng.normal(0, grain, (h, w, 1))
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    for s in sizes:
        if s > w:
            continue
        im = img.resize((s, int(h * s / w)), Image.LANCZOS)
        im.save(os.path.join(OUT, f"{name}-{s}.jpg"), quality=quality, optimize=True, progressive=True)


def to_arr(img):
    return np.asarray(img).astype(np.float32)


# ---------------------------------------------------------------- skyline
def skyline(name, w=2400, h=1500, seed=3, horizon=0.72, sun=(0.68, 0.70)):
    random.seed(seed)
    arr = vgrad(w, h, [(0, (9, 13, 19)), (0.45, (22, 26, 34)), (0.66, (88, 62, 40)), (horizon, (176, 122, 70)), (1, (40, 30, 24))])
    arr = radial(arr, w * sun[0], h * sun[1], w * 0.45, (214, 160, 92), 0.55)
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    lay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    # far layer
    x = 0
    base = int(h * horizon)
    while x < w:
        bw = random.randint(40, 120)
        bh = random.randint(30, 160)
        d.rectangle([x, base - bh, x + bw, h], fill=(48, 40, 38, 255))
        x += bw - random.randint(0, 10)
    # near layer
    x = -20
    while x < w:
        bw = random.randint(60, 220)
        bh = random.randint(80, 420)
        if random.random() < 0.12:
            bh = random.randint(450, 640)
        top = base - bh + 120
        col = (14, 17, 22, 255)
        d.rectangle([x, top, x + bw, h], fill=col)
        r = random.random()
        if r < 0.12:  # spire
            d.polygon([(x + bw * 0.35, top), (x + bw * 0.5, top - random.randint(60, 160)), (x + bw * 0.65, top)], fill=col)
        elif r < 0.2:  # dome
            d.pieslice([x + bw * 0.2, top - bw * 0.3, x + bw * 0.8, top + bw * 0.3], 180, 360, fill=col)
        # windows
        for wy in range(top + 18, h, 22):
            for wx in range(x + 10, x + bw - 10, 16):
                if random.random() < 0.08:
                    a = random.randint(90, 200)
                    d.rectangle([wx, wy, wx + 4, wy + 7], fill=(226, 184, 110, a))
        x += bw + random.randint(-10, 18)
    img = Image.alpha_composite(img.convert("RGBA"), lay).convert("RGB")
    arr = to_arr(img)
    # atmospheric haze at horizon
    arr = radial(arr, w * sun[0], h * (horizon - 0.02), w * 0.6, (150, 104, 66), 0.12)
    finish(arr, name)


# ---------------------------------------------------------------- townhouse facade
def townhouse(name, w=1600, h=2000, scaffold=True, seed=5):
    random.seed(seed)
    arr = vgrad(w, h, [(0, (196, 178, 152)), (1, (150, 130, 104))])
    arr = radial(arr, w * 0.2, h * 0.1, w * 1.1, (232, 214, 184), 0.5)
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    d = ImageDraw.Draw(img, "RGBA")
    # stone courses
    for y in range(0, h, 46):
        d.line([(0, y), (w, y)], fill=(120, 102, 80, 50), width=2)
    # cornice bands
    for y in (int(h * 0.12), int(h * 0.43), int(h * 0.74)):
        d.rectangle([0, y, w, y + 26], fill=(214, 198, 172, 255))
        d.line([(0, y + 26), (w, y + 26)], fill=(90, 74, 58, 160), width=4)
    cols = 3
    for row, (y0, wh) in enumerate([(int(h * 0.17), 380), (int(h * 0.48), 330), (int(h * 0.79), 260)]):
        for c in range(cols):
            cx = int(w * (c + 0.5) / cols)
            ww = 230
            x0 = cx - ww // 2
            d.rectangle([x0 - 16, y0 - 16, x0 + ww + 16, y0 + wh + 16], fill=(222, 208, 186, 255))
            d.rectangle([x0, y0, x0 + ww, y0 + wh], fill=(26, 30, 36, 255))
            # reflection
            d.polygon([(x0, y0 + wh * 0.6), (x0 + ww * 0.7, y0), (x0 + ww, y0), (x0 + ww, y0 + wh * 0.15), (x0 + ww * 0.25, y0 + wh)], fill=(90, 96, 104, 70))
            for gx in (x0 + ww // 3, x0 + 2 * ww // 3):
                d.line([(gx, y0), (gx, y0 + wh)], fill=(232, 224, 210, 255), width=6)
            for gy in (y0 + wh // 3, y0 + 2 * wh // 3):
                d.line([(x0, gy), (x0 + ww, gy)], fill=(232, 224, 210, 255), width=6)
            d.line([(x0, y0 + wh // 2), (x0 + ww, y0 + wh // 2)], fill=(232, 224, 210, 255), width=10)
    if scaffold:
        sc = (70, 74, 80, 230)
        for x in range(60, w, 260):
            d.line([(x, 0), (x, h)], fill=sc, width=9)
        for y in range(120, h, 300):
            d.line([(0, y), (w, y)], fill=sc, width=9)
            d.rectangle([0, y - 4, w, y + 16], fill=(120, 96, 64, 200))  # boards
        for x in range(60, w - 260, 520):
            for y in range(120, h - 300, 600):
                d.line([(x, y), (x + 260, y + 300)], fill=(70, 74, 80, 170), width=6)
    arr = to_arr(img.filter(ImageFilter.GaussianBlur(1.2)))
    arr = radial(arr, w * 0.9, h * 0.95, w * 0.9, (40, 34, 30), 0.45)
    finish(arr, name, sizes=(800, 1600))


# ---------------------------------------------------------------- development site with crane
def development(name, w=2400, h=1500):
    random.seed(11)
    arr = vgrad(w, h, [(0, (32, 34, 44)), (0.4, (112, 82, 58)), (0.7, (214, 160, 96)), (0.78, (226, 178, 110)), (1, (30, 24, 20))])
    arr = radial(arr, w * 0.3, h * 0.74, w * 0.35, (246, 210, 150), 0.7)
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    d = ImageDraw.Draw(img, "RGBA")
    col = (18, 18, 22, 255)
    ground = int(h * 0.82)
    d.rectangle([0, ground, w, h], fill=col)
    # building frame
    bx0, bx1 = int(w * 0.48), int(w * 0.86)
    floors = 9
    fh = 62
    for i in range(floors + 1):
        y = ground - i * fh
        d.line([(bx0, y), (bx1 - (i > 6) * 160, y)], fill=col, width=12)
    for x in range(bx0, bx1 + 1, 76):
        top = ground - (floors - (x > bx1 - 160) * 3) * fh
        d.line([(x, ground), (x, top)], fill=col, width=9)
    # lower floors clad
    d.rectangle([bx0, ground - 3 * fh, bx1, ground], fill=(22, 22, 26, 255))
    for x in range(bx0 + 20, bx1 - 20, 38):
        for y in range(ground - 3 * fh + 14, ground - 10, fh):
            if random.random() < 0.25:
                d.rectangle([x, y, x + 16, y + 26], fill=(230, 180, 110, 140))
    # crane
    mx = int(w * 0.38)
    mtop = int(h * 0.12)
    mw = 34
    d.line([(mx, ground), (mx, mtop)], fill=col, width=6)
    d.line([(mx + mw, ground), (mx + mw, mtop)], fill=col, width=6)
    for y in range(ground, mtop, -40):
        d.line([(mx, y), (mx + mw, y - 40)], fill=col, width=3)
        d.line([(mx, y - 40), (mx + mw, y - 40)], fill=col, width=3)
    jy = mtop
    d.line([(mx - 260, jy), (mx + 1150, jy)], fill=col, width=8)
    d.line([(mx - 260, jy + 26), (mx + 1150, jy + 26)], fill=col, width=4)
    for x in range(mx - 260, mx + 1150, 40):
        d.line([(x, jy), (x + 40, jy + 26)], fill=col, width=2)
    d.polygon([(mx, jy), (mx + mw / 2, jy - 110), (mx + mw, jy)], fill=None, outline=col)
    d.line([(mx + mw / 2, jy - 110), (mx + 1150, jy)], fill=col, width=3)
    d.line([(mx + mw / 2, jy - 110), (mx - 260, jy)], fill=col, width=3)
    d.rectangle([mx - 250, jy + 4, mx - 150, jy + 70], fill=col)  # counterweight
    d.line([(mx + 820, jy + 26), (mx + 820, int(h * 0.48))], fill=col, width=2)
    d.rectangle([mx + 800, int(h * 0.48), mx + 840, int(h * 0.48) + 22], fill=col)
    arr = to_arr(img)
    finish(arr, name)


# ---------------------------------------------------------------- glass facade
def glass(name, w=2000, h=1400, warm=False, night=False):
    random.seed(17)
    if night:
        arr = vgrad(w, h, [(0, (10, 14, 20)), (1, (20, 26, 34))])
    else:
        arr = vgrad(w, h, [(0, (40, 52, 64)), (0.5, (96, 108, 116)), (1, (150, 128, 100) if warm else (60, 70, 80))])
    # diagonal reflection band
    yy, xx = np.mgrid[0:h, 0:w]
    band = np.exp(-(((xx * 0.6 + yy) - w * 0.7) / (w * 0.18)) ** 2)
    refl = (200, 170, 120) if (warm or night) else (190, 200, 206)
    for c in range(3):
        arr[:, :, c] = arr[:, :, c] * (1 - band * 0.45) + refl[c] * band * 0.45
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    d = ImageDraw.Draw(img, "RGBA")
    pw, ph = 150, 210
    for x in range(-20, w, pw):
        for y in range(-30, h, ph):
            shade = random.randint(-18, 18)
            d.rectangle([x + 4, y + 4, x + pw - 4, y + ph - 4], fill=(128 + shade, 128 + shade, 128 + shade, 18))
            if night and random.random() < 0.28:
                d.rectangle([x + 6, y + 6, x + pw - 6, y + ph - 6], fill=(224, 182, 112, random.randint(60, 140)))
    for x in range(-20, w, pw):
        d.line([(x, 0), (x, h)], fill=(14, 18, 24, 255), width=8)
    for y in range(-30, h, ph):
        d.line([(0, y), (w, y)], fill=(14, 18, 24, 255), width=12)
    arr = to_arr(img)
    finish(arr, name, sizes=(1000, 2000))


# ---------------------------------------------------------------- stone texture
def stone(name, w=2400, h=1200, dark=True):
    rng = np.random.default_rng(23)
    base = rng.normal(0, 1, (h // 8, w // 8))
    img = Image.fromarray(((base - base.min()) / (base.max() - base.min()) * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    img = img.filter(ImageFilter.GaussianBlur(6))
    n = np.asarray(img).astype(np.float32) / 255
    fine = rng.normal(0, 1, (h, w)) * 0.06
    n = np.clip(n * 0.7 + fine + 0.15, 0, 1)
    if dark:
        a, b = np.array([14, 17, 22]), np.array([40, 40, 40])
    else:
        a, b = np.array([208, 198, 182]), np.array([238, 232, 222])
    arr = a[None, None, :] + (b - a)[None, None, :] * n[:, :, None]
    im = Image.fromarray(arr.astype(np.uint8))
    d = ImageDraw.Draw(im, "RGBA")
    for y in range(0, h, 300):
        d.line([(0, y), (w, y)], fill=(0, 0, 0, 40) if dark else (120, 104, 84, 50), width=3)
        off = 0 if (y // 300) % 2 == 0 else 450
        for x in range(off, w, 900):
            d.line([(x, y), (x, y + 300)], fill=(0, 0, 0, 40) if dark else (120, 104, 84, 50), width=3)
    finish(to_arr(im), name, grain=4, vignette=0.2)


# ---------------------------------------------------------------- period door (auction)
def door(name, w=1600, h=2000):
    arr = vgrad(w, h, [(0, (184, 168, 146)), (1, (130, 114, 94))])
    arr = radial(arr, w * 0.75, h * 0.1, w, (226, 210, 184), 0.45)
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    d = ImageDraw.Draw(img, "RGBA")
    for y in range(0, h, 64):
        off = 0 if (y // 64) % 2 else 110
        d.line([(0, y), (w, y)], fill=(110, 90, 70, 70), width=3)
        for x in range(off, w, 220):
            d.line([(x, y), (x, y + 64)], fill=(110, 90, 70, 50), width=3)
    cx = w // 2
    dw, top, bot = 560, int(h * 0.3), int(h * 0.95)
    d.rectangle([cx - dw // 2 - 70, top - 260, cx + dw // 2 + 70, bot], fill=(226, 216, 198, 255))
    d.pieslice([cx - dw // 2, top - 280, cx + dw // 2, top + 280], 180, 360, fill=(28, 32, 38, 255))
    for a in range(180, 361, 20):
        import math
        r = dw / 2
        d.line([(cx, top), (cx + r * math.cos(math.radians(a)), top + r * math.sin(math.radians(a)))], fill=(226, 216, 198, 255), width=6)
    d.rectangle([cx - dw // 2, top, cx + dw // 2, bot], fill=(18, 24, 30, 255))
    for (x0, x1) in ((cx - dw // 2 + 50, cx - 25), (cx + 25, cx + dw // 2 - 50)):
        for (y0, y1) in ((top + 60, top + 520), (top + 600, bot - 60)):
            d.rectangle([x0, y0, x1, y1], outline=(46, 54, 62, 255), width=10)
    d.ellipse([cx - 22, top + 560, cx + 22, top + 604], fill=(196, 162, 96, 255))
    d.rectangle([cx - 60, top + 360, cx + 60, top + 380], fill=(196, 162, 96, 255))
    # steps
    for i in range(3):
        d.rectangle([cx - dw // 2 - 120 - i * 40, bot + i * 34, cx + dw // 2 + 120 + i * 40, bot + (i + 1) * 34], fill=(200 - i * 10, 190 - i * 10, 172 - i * 10, 255))
    arr = to_arr(img.filter(ImageFilter.GaussianBlur(1)))
    arr = radial(arr, w * 0.1, h * 0.9, w, (40, 34, 30), 0.4)
    finish(arr, name, sizes=(800, 1600))


# ---------------------------------------------------------------- portrait placeholder
def portrait(name, idx, w=900, h=1100):
    tones = [(222, 214, 204), (214, 216, 220), (226, 216, 202), (216, 214, 212), (220, 214, 208), (210, 214, 218)]
    arr = vgrad(w, h, [(0, tuple(min(255, t + 18) for t in tones[idx % 6])), (1, tones[idx % 6])])
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    d = ImageDraw.Draw(img, "RGBA")
    c = (176, 168, 158, 150)
    d.ellipse([w * 0.36, h * 0.24, w * 0.64, h * 0.52], fill=c)
    d.ellipse([w * 0.14, h * 0.58, w * 0.86, h * 1.25], fill=c)
    img = img.filter(ImageFilter.GaussianBlur(26))
    finish(to_arr(img), name, grain=4, vignette=0.12, sizes=(450, 900))



def skyline_day(name, w=2400, h=1600, seed=4):
    random.seed(seed)
    horizon = 0.70
    arr = vgrad(w, h, [(0, (214, 222, 228)), (0.45, (232, 232, 228)), (horizon, (244, 230, 210)), (1, (226, 220, 212))])
    arr = radial(arr, w * 0.62, h * 0.62, w * 0.55, (250, 214, 160), 0.45)
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).convert("RGBA")
    base = int(h * horizon)
    for layer, (col, hmin, hmax, wmin, wmax, off) in enumerate([((196, 198, 202), 40, 200, 50, 130, 0), ((168, 166, 164), 80, 430, 70, 220, 90), ((132, 126, 120), 60, 300, 90, 260, 260)]):
        lay = Image.new("RGBA", (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
        x = -30
        while x < w:
            bw = random.randint(wmin, wmax); bh = random.randint(hmin, hmax)
            if layer == 1 and random.random() < 0.1: bh = random.randint(480, 700)
            top = base - bh + off
            dv = random.randint(-8, 8); c = tuple(v + dv for v in col) + (255,)
            d.rectangle([x, top, x + bw, h], fill=c)
            r = random.random()
            if r < 0.1: d.polygon([(x + bw * .35, top), (x + bw * .5, top - random.randint(60, 150)), (x + bw * .65, top)], fill=c)
            elif r < 0.18: d.pieslice([x + bw * .2, top - bw * .3, x + bw * .8, top + bw * .3], 180, 360, fill=c)
            if layer > 0:
                for wy in range(top + 20, h, 26):
                    for wx in range(x + 10, x + bw - 10, 18):
                        if random.random() < 0.5:
                            d.rectangle([wx, wy, wx + 7, wy + 12], fill=tuple(max(0, v - 22) for v in col) + (120,))
                # light edge
                d.line([(x + bw, top), (x + bw, h)], fill=(250, 238, 220, 90), width=3)
            x += bw + random.randint(-10, 16)
        img = Image.alpha_composite(img, lay.filter(ImageFilter.GaussianBlur(2.2 - layer * 0.7)))
    arr = to_arr(img.convert("RGB"))
    arr = radial(arr, w * 0.6, h * 0.66, w * 0.7, (246, 232, 212), 0.18)
    finish(arr, name, grain=5, vignette=0.12)


def glass_day(name, w=2000, h=1400):
    random.seed(21)
    arr = vgrad(w, h, [(0, (196, 210, 220)), (0.5, (220, 226, 230)), (1, (236, 228, 214))])
    yy, xx = np.mgrid[0:h, 0:w]
    band = np.exp(-(((xx * 0.6 + yy) - w * 0.75) / (w * 0.2)) ** 2)
    for c, v in enumerate((252, 236, 212)):
        arr[:, :, c] = arr[:, :, c] * (1 - band * .5) + v * band * .5
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)); d = ImageDraw.Draw(img, "RGBA")
    pw, ph = 150, 210
    for x in range(-20, w, pw):
        for y in range(-30, h, ph):
            s = random.randint(-14, 14); d.rectangle([x + 4, y + 4, x + pw - 4, y + ph - 4], fill=(150 + s, 160 + s, 170 + s, 22))
    for x in range(-20, w, pw): d.line([(x, 0), (x, h)], fill=(236, 234, 230, 255), width=10)
    for y in range(-30, h, ph): d.line([(0, y), (w, y)], fill=(236, 234, 230, 255), width=14)
    for x in range(-20, w, pw): d.line([(x + 6, 0), (x + 6, h)], fill=(150, 154, 160, 120), width=2)
    finish(to_arr(img), name, sizes=(1000, 2000), grain=4, vignette=.1)


import sys as _s
which = _s.argv[2:] if len(_s.argv) > 2 else ["all"]
if "light" in which:
    skyline_day("hero-city-day")
    for i in range(6): portrait(f"team-{i + 1}", i)
    glass_day("office-day")
else:
    skyline("hero-london-dusk"); skyline("cta-city-night", seed=9, horizon=0.8, sun=(0.2, 0.84))
    townhouse("townhouse-refurbishment"); townhouse("townhouse-terrace", scaffold=False, seed=8)
    development("development-golden-hour"); glass("commercial-glass", warm=True); glass("office-night", night=True)
    stone("stone-dark"); stone("stone-light", dark=False); door("period-door")
    for i in range(6): portrait(f"team-{i + 1}", i)
print(sorted(os.listdir(OUT)))
