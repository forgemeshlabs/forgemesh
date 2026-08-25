from PIL import Image, ImageDraw, ImageFont
import json, os, textwrap, re

POSTS = [
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
os.makedirs("/home/ubuntu/dev/forgemesh/site/public/blog/pins", exist_ok=True)

for slug, title, kicker in POSTS:
    img = Image.new("RGB",(W,H),BG)
    d = ImageDraw.Draw(img)
    hero_path = f"/home/ubuntu/dev/forgemesh/site/public/blog/{slug}.png"
    hero = Image.open(hero_path).convert("RGB")
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
    img.save(f"/home/ubuntu/dev/forgemesh/site/public/blog/pins/{slug}.png","PNG")
    print("pin:",slug)
