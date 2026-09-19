#!/usr/bin/env node
// Date-scan approval loop, Discord side. Fourth copy of the
// brief-approval-poller.js pattern (Bot REST read of #fm-brief,
// channel-trust, stale-safe lock, save-before-act). Watches for operator
// replies after date-scan.js posted a queue:
//   "add N"   -> approve proposal N  (also "run N" — same habit as the factory)
//   "skip N"  -> skip proposal N
//   "all"     -> approve every still-proposed item in the targeted queue
//   👍 reaction on the queue post -> same as "all"
// Approved items are promoted into public/calendar.json by
// `date-scan.js --promote` right after the save — live on forgemesh.io/calendar
// and the .ics feed immediately, no build, no restart.
// Cron every 2 min; clean no-op when nothing is pending.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const SITE = path.join(__dirname, "..");
const QUEUE_FILE = path.join(SITE, "data", "calendar-proposed.json");
const LOCK = path.join(SITE, "data", ".date-approval-poller.lock");
const CHANNEL = "1539595933132791858"; // #fm-brief
const HEADER = "📅 **Date scan — queue for ";

// The bot token lives with the other Discord pollers; no dotenv in this package.
function botToken() {
  if (process.env.DISCORD_BOT_TOKEN) return process.env.DISCORD_BOT_TOKEN;
  try {
    const env = fs.readFileSync("/home/ubuntu/dev/x402-swag/shop/.env", "utf8");
    const m = env.match(/^DISCORD_BOT_TOKEN=["']?([^"'\n]+)/m);
    if (m) return m[1];
  } catch {}
  return null;
}
const TOKEN = botToken();
const H = { Authorization: `Bot ${TOKEN}`, "Content-Type": "application/json" };

function loadDoc() { try { return JSON.parse(fs.readFileSync(QUEUE_FILE, "utf8")); } catch { return null; } }
async function api(method, p, body) {
  const res = await fetch("https://discord.com/api/v10" + p, { method, headers: H, body: body ? JSON.stringify(body) : undefined });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(`${method} ${p} -> ${res.status}`);
  return data;
}
async function postMessage(content) {
  await api("POST", `/channels/${CHANNEL}/messages`, { content }).catch((e) => console.error("  discord post failed:", e.message));
}

(async () => {
  const doc = loadDoc();
  const queues = ((doc && doc.queues) || []).filter((q) => q.postedAt && q.items.some((t) => t.status === "proposed"));
  if (!queues.length) return; // clean no-op, no Discord calls
  if (!TOKEN) { console.error("no DISCORD_BOT_TOKEN"); process.exit(1); }

  try { if (Date.now() - fs.statSync(LOCK).mtimeMs < 5 * 60 * 1000) return; } catch { /* no lock */ }
  fs.writeFileSync(LOCK, String(process.pid));
  try {
    const recent = await api("GET", `/channels/${CHANNEL}/messages?limit=100`).catch(() => []);
    const decided = [];
    const queuePostFor = (q) => (recent || []).find((m) => m.author.bot && m.content.startsWith(`${HEADER}${q.date}**`));
    const isThumb = (r) => r.emoji && typeof r.emoji.name === "string" && r.emoji.name.startsWith("👍");

    for (const q of queues) {
      const post = queuePostFor(q);
      if (post && (post.reactions || []).some(isThumb)) {
        for (const t of q.items) if (t.status === "proposed") { t.status = "approved"; decided.push(`${q.date} #${t.n} added (👍)`); }
      }
    }

    const newest = queues[0];
    const newestPostedAt = new Date(newest.postedAt).getTime();
    const humanMsgs = (recent || []).filter((m) => !m.author.bot);
    for (const m of humanMsgs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))) {
      let target = null;
      const refId = m.message_reference && m.message_reference.message_id;
      if (refId) {
        const ref = (recent || []).find((x) => x.id === refId);
        const dm = ref && ref.content && ref.content.startsWith(HEADER) && ref.content.match(/queue for (\d{4}-\d{2}-\d{2})/);
        if (dm) target = queues.find((q) => q.date === dm[1]);
        if (!target) continue; // reply to something else — not ours
      } else {
        if (new Date(m.timestamp).getTime() <= newestPostedAt) continue; // pre-queue chatter
        target = newest;
      }
      const c = m.content.trim().toLowerCase();
      // Bare "all" belongs to the factory poller ("all"/"run all"); ours is "add all",
      // so the two queues never fight over one reply. 👍 on OUR post is unambiguous.
      if (c === "add all") {
        for (const t of target.items) if (t.status === "proposed") { t.status = "approved"; decided.push(`${target.date} #${t.n} added`); }
        continue;
      }
      const mm = c.match(/^(add|skip)\s+([\d\s,&+]+(?:and[\d\s,&+]*)*)$/);
      if (!mm) continue;
      const nums = (mm[2].match(/\d+/g) || []).map(Number);
      for (const n of nums) {
        const t = target.items.find((x) => x.n === n);
        if (!t || t.status !== "proposed") continue;
        t.status = mm[1] === "add" ? "approved" : "skipped";
        decided.push(`${target.date} #${t.n} ${t.status === "approved" ? "added" : "skipped"}`);
      }
    }

    if (decided.length) {
      const now = new Date().toISOString();
      for (const q of queues) if (!q.items.some((t) => t.status === "proposed")) q.decidedAt = q.decidedAt || now;
      fs.writeFileSync(QUEUE_FILE, JSON.stringify(doc, null, 2) + "\n"); // save BEFORE acting
      let promoted = "";
      try {
        promoted = execFileSync(process.execPath, [path.join(__dirname, "date-scan.js"), "--promote"], { encoding: "utf8", timeout: 60000 });
      } catch (e) { console.error("promote failed:", e.message); }
      const n = (promoted.match(/^\s+\S/gm) || []).length;
      await postMessage(`📅 noted: ${decided.join(", ")}.${n ? ` ${n} event${n === 1 ? "" : "s"} now live at <https://forgemesh.io/calendar> (+ .ics).` : ""}`);
      console.log(`${now} date approvals: ${decided.join(", ")} | ${promoted.trim().replace(/\n/g, " / ")}`);
    }
  } finally {
    try { fs.unlinkSync(LOCK); } catch {}
  }
})();
