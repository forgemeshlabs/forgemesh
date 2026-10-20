// Generate a 16:9 blog hero with Gemini image model. Usage: node scripts/hero-gemini.mjs <out.png> "<prompt>"
// Key: GEMINI_API_KEY (interactive shell env; see ~/.bashrc). Free-tier model per imagegen-model-strategy.
import fs from "node:fs";
const [out, prompt] = process.argv.slice(2);
if (!out || !prompt) { console.error("usage: hero-gemini.mjs <out.png> <prompt>"); process.exit(1); }
const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
if (!key) { console.error("GEMINI_API_KEY missing"); process.exit(1); }
const model = process.env.GEMINI_IMAGE_MODEL || "gemini-3.1-flash-image-preview";
const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
  method: "POST", headers: { "content-type": "application/json" },
  body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "16:9" } } })
});
const j = await res.json();
const part = j.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
if (!part) { console.error(JSON.stringify(j).slice(0, 800)); process.exit(2); }
fs.writeFileSync(out, Buffer.from(part.inlineData.data, "base64"));
console.log("wrote", out, part.inlineData.mimeType);
