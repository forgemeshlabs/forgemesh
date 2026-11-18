# IG feed cards: 1080x1350 (4:5) JPEG variants of the pin cards.
# IG rejects 2:3 Pinterest cards; JPEG required for the content-publishing API.
# Reuses the curated (slug, title, kicker) tuples from make-pins.py.
from PIL import Image, ImageDraw, ImageFont
import os, textwrap, importlib.util

spec = importlib.util.spec_from_file_location("make_pins", os.path.join(os.path.dirname(__file__), "make-pins.py"))
# make-pins.py executes its render loop on import; we only want POSTS, so read it textually instead.
POSTS = []
src = open(os.path.join(os.path.dirname(__file__), "make-pins.py")).read()
exec(src.split("W,H")[0])  # runs just the POSTS assignment (everything before render constants)

W, H = 1080, 1350
BG = (5, 5, 9); BLUE = (96, 165, 250); SLATE = (148, 163, 184); WHITE = (241, 245, 249)
bold = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
reg = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
# content/assets is served at request time — no rebuild/restart for new cards.
SITE = "/home/ubuntu/dev/forgemesh/site"
OUT = f"{SITE}/content/assets/pins/ig"
os.makedirs(OUT, exist_ok=True)

def hero_for(slug):
    for p in (f"{SITE}/content/assets/{slug}.png", f"{SITE}/public/blog/{slug}.png"):
        if os.path.exists(p):
            return p
    raise FileNotFoundError(f"no hero for {slug} in content/assets or public/blog")

FOOTER = {"wordpress-pay-per-crawl-pro": ("proxy.forgemesh.io/wp  ·  link in bio", "Dashboard, weekly digest, alerts · up to 5 sites"), "wordpress-plugin-page": ("forgemesh.io/wordpress  ·  link in bio", "Humans read free · AI crawlers pay USDC per page"), "vin-checker": ("forgemesh.io/vin  ·  link in bio", "Free VIN check · official U.S. government safety data")}

def wrap_px(d, text, font, maxw):
    """Word-wrap by measured pixel width so no line runs off the card."""
    lines, cur = [], ""
    for w in text.split():
        t = (cur + " " + w).strip()
        if cur and d.textlength(t, font=font) > maxw:
            lines.append(cur); cur = w
        else:
            cur = t
    if cur: lines.append(cur)
    return lines

def clip_px(d, text, font, maxw):
    """Cut a one-line string at a word boundary to fit, adding an ellipsis."""
    if d.textlength(text, font=font) <= maxw: return text
    words = text.rstrip("…").split()
    while words and d.textlength(" ".join(words) + "…", font=font) > maxw:
        words.pop()
    return (" ".join(words).rstrip(" ·—-") + "…") if words else text

for slug, title, kicker in POSTS:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    hero = Image.open(hero_for(slug)).convert("RGB")
    hw = W - 100; hh = int(hw * hero.height / hero.width)
    hero = hero.resize((hw, hh))
    img.paste(hero, (50, 150))
    d.text((50, 80), "FORGEMESH LABS  ·  FIELD NOTES", font=ImageFont.truetype(reg, 34), fill=BLUE)
    y = 150 + hh + 60
    fkk = ImageFont.truetype(reg, 36)
    d.text((50, y), clip_px(d, kicker.upper(), fkk, W - 100), font=fkk, fill=SLATE)
    y += 70
    ft = ImageFont.truetype(bold, 68)
    for line in wrap_px(d, title, ft, W - 100):
        d.text((50, y), line, font=ft, fill=WHITE)
        y += 84
    d.rectangle([50, y + 24, 270, y + 33], fill=BLUE)
    furl, ftag = FOOTER.get(slug, ("forgemesh.io/blog  ·  link in bio", "Plain-language field reports from the AI agent economy"))
    d.text((50, H - 120), furl, font=ImageFont.truetype(reg, 38), fill=BLUE)
    d.text((50, H - 68), ftag, font=ImageFont.truetype(reg, 28), fill=SLATE)
    img.save(f"{OUT}/{slug}.jpg", "JPEG", quality=92)
    print("ig card:", slug)
