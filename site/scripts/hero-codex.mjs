// Generate a 16:9 blog hero with the Codex CLI image tool (ChatGPT subscription, no API credits).
// Usage: node scripts/hero-codex.mjs <out.png> "<prompt>"
// Requires `codex` logged in (~/.codex/auth.json). Output is resized to 1600x900 with sharp.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import sharp from "sharp";
const [out, prompt] = process.argv.slice(2);
if (!out || !prompt) { console.error("usage: hero-codex.mjs <out.png> <prompt>"); process.exit(1); }
const work = fs.mkdtempSync(path.join(os.tmpdir(), "hero-codex-"));
const task = `Use your image generation tool to create one image, landscape 16:9 (widest landscape size available), with this prompt: '${prompt.replace(/'/g, "")}'. Save the resulting image file into the current working directory as hero.png. Then print the absolute path of the saved file and nothing else.`;
execFileSync("codex", ["exec", "--skip-git-repo-check", "-s", "workspace-write", "-C", work, task], { stdio: ["ignore", "inherit", "inherit"], timeout: 420000 });
const src = path.join(work, "hero.png");
if (!fs.existsSync(src)) { console.error("codex did not write hero.png"); process.exit(2); }
const info = await sharp(src).resize(1600, 900, { fit: "cover" }).png({ palette: true, quality: 95, compressionLevel: 9 }).toFile(out);
fs.rmSync(work, { recursive: true, force: true });
console.log("wrote", out, info.width + "x" + info.height);
