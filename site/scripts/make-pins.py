from PIL import Image, ImageDraw, ImageFont
import json, os, textwrap, re

POSTS = [
 ("agentic-payments-alliance-circle-x402", "Visa + Mastercard Are Writing the Agent Payment Rules. Circle Is in the Room.", "Authorization rules, not pricing — and the rail that's actually shrinking"),
 ("how-to-read-a-vin", "A VIN Starting With J Really Does Mean Japan", "17 characters, 3 you can read by eye — and a built-in typo detector from 1981"),
 ("congress-trades-tracker-launch", "Agents Paid Us $44 for Congress Trading Data. We Gave It to Humans Free.", "10,622 trades, 129 members, updated daily"),
 ("x402-python-v2-21-sei-payment-flows", "x402 Python SDK v2.21: Sei, Payment Flows, Batch Settlement Guard", "The changelog, decoded"),
 ("nvidia-hugging-face-12b-acquisition", "Nvidia Is Buying the GitHub of AI for $12.9 Billion", "13M devs, 2.5M models — the model layer gets a tollbooth"),
 ("fall-2026-case-file", "Everything Moved in the Same 12 Days. We Opened a Case File.", "7 exhibits, 3 strings, 1 labeled hypothesis"),
 ("fall-2026-calendar-convergence", "Every Clock in the Machine Economy Strikes This Fall", "Sept 15 double-header + the 1,064-day clock"),
 ("texas-ercot-300-data-center-audit", "Texas Peaks at 91 GW. Its Data-Center Queue Wants 474.", "ERCOT audits 300 sites, approvals paused"),
 ("x402-record-day-money-didnt-move", "x402's Biggest Day Ever Moved $38K — at 3¢ a Payment", "1.17M payments in 15 hours, flat volume"),
 ("mppscan-vanishing-volume", "An 'All-Time' Volume Counter Fell 97% in Six Days", "Cumulative totals can't shrink"),
 ("solana-flips-base-x402-catalog", "Solana Flipped Base on x402 Txns — With 1.4% of the Catalog", "Throughput is not builders"),
 ("x402swag-agent-merch-store", "The Merch Store Where AI Agents Can Buy Shirts", "Card or USDC over x402 — 49 designs"),
 ("stack-basics-free-course", "Free Course: Everything Before You Build", "5 modules, no email, free ebook"),
 ("free-agent-economy-scanners", "Can Agents Find, Trust & Pay You? Scan It Free.", "30+ checks, no signup, no spend"),
 ("x401-identity-protocol-agent-economy", "401 Asks Who You Are. 402 Asks You to Pay.", "The agent web just got both"),
 ("address-poisoning-dust-attack-x402-agent-wallets", "We Funded a Wallet at Breakfast. Scammers Impersonated It by Lunch.", "The $0.00 payment that wasn't"),
 ("x402-v1-v2-client-split-your-endpoint-may-be-unpayable", "Your Paid API May Be Silently Unpayable", "The x402 v1/v2 client split"),
 ("x402-bazaar-health-census-august-2026", "1 in 4 AI-Economy Sellers Can't Take an Agent's Money", "We health-checked all 1,225"),
 ("stripe-openrouter-genius-act-agent-payment-rules", "3 Rulebooks Are Being Written for How AI Agents Pay", "Stripe, Google, and the U.S. Treasury"),
 ("x402-500-character-description-limit", "One Extra Byte Makes Your Listing Unpurchasable", "The 500-character cliff"),
 ("x402-catalog-purge-overnight-july-2026", "43% of the AI-Payments Catalog Vanished Overnight", "Nobody announced it"),
 ("open-usd-circle-stablecoin-x402", "140 Companies Blindsided Circle With a New Stablecoin", "The fight over agent money"),
 ("why-ai-agents-need-crypto", "AI x Crypto Finally Makes Sense — Agents Needed Wallets", "The convergence nobody predicted"),
 ("x402-bazaar-economy-data-july-2026", "One Seller Is 40% of the Entire AI-Payments Catalog", "The x402 economy, measured"),
 ("lessons-from-500-paid-x402-endpoints", "5 Lessons From Running 500+ Paid AI Endpoints", "Field notes from the machine economy"),
 ("x402-foundation-linux-foundation-launch", "Visa, Mastercard & Stripe Just Joined the x402 Foundation", "Agent payments went institutional"),
]

W,H = 1000,1500
BG=(5,5,9); BLUE=(96,165,250); SLATE=(148,163,184); WHITE=(241,245,249)
bold="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
reg="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
# content/assets is served by the dynamic route at request time — no rebuild
# or restart needed for new cards. public/blog stays as fallback for old posts.
SITE = "/home/ubuntu/dev/forgemesh/site"
os.makedirs(f"{SITE}/content/assets/pins", exist_ok=True)

def hero_for(slug):
    for p in (f"{SITE}/content/assets/{slug}.png", f"{SITE}/public/blog/{slug}.png"):
        if os.path.exists(p):
            return p
    raise FileNotFoundError(f"no hero for {slug} in content/assets or public/blog")

for slug, title, kicker in POSTS:
    img = Image.new("RGB",(W,H),BG)
    d = ImageDraw.Draw(img)
    hero = Image.open(hero_for(slug)).convert("RGB")
    hw = W-80; hh = int(hw*hero.height/hero.width)
    hero = hero.resize((hw,hh))
    img.paste(hero,(40,120))
    # kicker
    fk = ImageFont.truetype(reg, 30)
    d.text((40,60), "FORGEMESH LABS  ·  FIELD NOTES", font=fk, fill=BLUE)
    y = 120+hh+50
    d.text((40,y), kicker.upper(), font=ImageFont.truetype(reg,32), fill=SLATE)
    y += 60
    ft = ImageFont.truetype(bold, 64)
    for line in textwrap.wrap(title, width=26):
        d.text((40,y), line, font=ft, fill=WHITE)
        y += 78
    # accent bar
    d.rectangle([40,y+20,240,y+28], fill=BLUE)
    # footer
    ff = ImageFont.truetype(reg, 34)
    d.text((40,H-110), "forgemesh.io/blog", font=ff, fill=BLUE)
    d.text((40,H-64), "Plain-language field reports from the AI agent economy", font=ImageFont.truetype(reg,26), fill=SLATE)
    img.save(f"{SITE}/content/assets/pins/{slug}.png","PNG")
    print("pin:",slug)
