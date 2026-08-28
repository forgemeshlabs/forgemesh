#!/usr/bin/env node
// Repo Watch — tracks significant x402 ecosystem releases (SDK versions,
// security advisories, new chain support). Polls GitHub tags API every
// 6h via cron, fetches changelog sections for new tags, filters for
// significance, writes to data/repo-watch.json (full history) and
// public/repo-watch.json (trimmed for the site).
//
// x402-foundation/x402 uses tags (not GitHub Releases), so we poll the
// tags endpoint and fetch CHANGELOG.md per SDK to get release notes.
//
// Usage: node scripts/repo-watch.js [--notify] [--backfill N]
//   --notify      posts new entries to fm-brief Discord via kodiak-gw
//   --backfill N  include up to N historical tags (default: only new)
//
// Cron:  15 */6 * * *  (every 6h at :15, offset from rail-pulse)
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const DATA_DIR = path.join(__dirname, "..", "data");
const STATE_FILE = path.join(DATA_DIR, "repo-watch.json");
const PUBLIC_FILE = path.join(__dirname, "..", "public", "repo-watch.json");
const PUBLIC_LIMIT = 50;
const UA =
  "Mozilla/5.0 (compatible; ForgeMesh-RepoWatch/1.0; +https://forgemesh.io)";

const KODIAK_URL = "http://127.0.0.1:3999/notify";
const BRIEF_CHANNEL = "1539595933132791858";

const REPOS = [
  {
    owner: "x402-foundation",
    repo: "x402",
    sdks: [
      {
        prefix: "pypi-x402@v",
        label: "Python SDK",
        pkg: "pypi",
        changelog: "python/x402/CHANGELOG.md",
      },
      {
        prefix: "npm-x402@v",
        label: "npm x402 (legacy)",
        pkg: "npm",
        changelog: "typescript/packages/core/CHANGELOG.md",
      },
      {
        prefix: "npm-@x402/svm@v",
        label: "@x402/svm",
        pkg: "npm",
        changelog: "typescript/packages/mechanisms/svm/CHANGELOG.md",
      },
      {
        prefix: "npm-@x402/tvm@v",
        label: "@x402/tvm",
        pkg: "npm",
        changelog: "typescript/packages/mechanisms/tvm/CHANGELOG.md",
      },
      {
        prefix: "npm-@x402/xrpl@v",
        label: "@x402/xrpl",
        pkg: "npm",
        changelog: "typescript/packages/mechanisms/xrpl/CHANGELOG.md",
      },
      {
        prefix: "npm-@x402/stellar@v",
        label: "@x402/stellar",
        pkg: "npm",
        changelog: "typescript/packages/mechanisms/stellar/CHANGELOG.md",
      },
      {
        prefix: "npm-x402-express@v",
        label: "x402-express",
        pkg: "npm",
        changelog: "typescript/packages/extensions/CHANGELOG.md",
      },
    ],
  },
];

function fetch_(url, accept) {
  return new Promise((resolve, reject) => {
    const get = url.startsWith("https") ? https.get : http.get;
    get(
      url,
      {
        headers: {
          "User-Agent": UA,
          Accept: accept || "application/vnd.github+json",
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
      },
      (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`${url} -> HTTP ${res.statusCode}`));
          res.resume();
          return;
        }
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (c) => (body += c));
        res.on("end", () => resolve(body));
      }
    ).on("error", reject);
  });
}

function fetchJson(url) {
  return fetch_(url).then(JSON.parse);
}

function fetchText(url) {
  return fetch_(url, "application/vnd.github.raw+json");
}

function postJson(url, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const u = new URL(url);
    const req = http.request(
      {
        hostname: u.hostname,
        port: u.port,
        path: u.pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => resolve({ status: res.statusCode, body }));
      }
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

function extractChangelogSection(changelog, version) {
  const escaped = version.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `^##\\s+(?:\\[?v?)?${escaped}\\]?.*?$`,
    "m"
  );
  const match = pattern.exec(changelog);
  if (!match) return null;

  const start = match.index + match[0].length;
  const nextHeading = changelog.indexOf("\n## ", start);
  const section =
    nextHeading === -1
      ? changelog.slice(start)
      : changelog.slice(start, nextHeading);
  return section.trim();
}

function classifySignificance(version, body) {
  const lower = (body || "").toLowerCase();
  if (
    lower.includes("security") ||
    lower.includes("vulnerability") ||
    lower.includes("cve")
  )
    return "security";
  if (lower.includes("breaking") || lower.includes("removed"))
    return "breaking";

  const vMatch = version.match(/(\d+)\.(\d+)\.(\d+)/);
  if (vMatch) {
    const [, , , patch] = vMatch.map(Number);
    if (patch === 0) return "minor";
  }

  if (
    lower.includes("new chain") ||
    lower.includes("mainnet") ||
    /added.*support/i.test(lower)
  )
    return "chain";
  if (lower.includes("payment") && lower.includes("flow")) return "feature";
  return "patch";
}

function cleanHighlight(text) {
  return text
    .replace(/\s*\(\[#\d+\]\([^)]*\)\)/g, "") // ([#1234](url))
    .replace(/\s*-?\s*Thanks\s+(?:\[@[^\]]+\]\([^)]*\)|@\w+|,|\s|and)+!?/gi, "") // - Thanks [@x](url) and [@y](url)!
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // [text](url) -> text
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractHighlights(body) {
  if (!body) return [];
  const lines = body.split("\n");
  const highlights = [];
  for (const line of lines) {
    const trimmed = line.replace(/^[\s*-]+/, "").trim();
    if (
      !trimmed ||
      trimmed.startsWith("#") ||
      trimmed.startsWith("<!--") ||
      trimmed.startsWith("**")
    )
      continue;
    if (
      /\b(add|introduc|support|implement|fix|restor|improv|new|break|remov|deprecat|align|consolidat|bump)/i.test(
        trimmed
      )
    ) {
      let h = cleanHighlight(trimmed);
      if (h.length > 220) {
        const cut = h.slice(0, 220);
        const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf(", "));
        h = (end > 80 ? cut.slice(0, end) : cut.replace(/\s+\S*$/, "")) + "…";
      }
      if (h) highlights.push(h);
      if (highlights.length >= 5) break;
    }
  }
  return highlights;
}

function shouldInclude(significance) {
  return significance !== "patch";
}

const changelogCache = new Map();

async function getChangelog(owner, repo, filepath) {
  const key = `${owner}/${repo}/${filepath}`;
  if (changelogCache.has(key)) return changelogCache.get(key);
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filepath}`;
    const text = await fetchText(url);
    changelogCache.set(key, text);
    return text;
  } catch (e) {
    console.error(`changelog fetch failed: ${key}: ${e.message}`);
    changelogCache.set(key, "");
    return "";
  }
}

async function run() {
  const notify = process.argv.includes("--notify");
  const backfillIdx = process.argv.indexOf("--backfill");
  const backfillLimit =
    backfillIdx !== -1 ? Number(process.argv[backfillIdx + 1]) || 20 : 0;

  fs.mkdirSync(DATA_DIR, { recursive: true });

  let state = { entries: [], lastChecked: null };
  try {
    state = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {}

  const seenTags = new Set(state.entries.map((e) => e.tag));
  const isFirstRun = state.entries.length === 0;
  const newEntries = [];

  for (const repo of REPOS) {
    let page = 1;
    let tags = [];
    while (page <= 3) {
      const url = `https://api.github.com/repos/${repo.owner}/${repo.repo}/tags?per_page=100&page=${page}`;
      let pageTags;
      try {
        pageTags = await fetchJson(url);
      } catch (e) {
        console.error(
          `tags fetch failed for ${repo.owner}/${repo.repo} p${page}: ${e.message}`
        );
        break;
      }
      tags = tags.concat(pageTags);
      if (pageTags.length < 100) break;
      page++;
    }
    console.log(`${repo.owner}/${repo.repo}: ${tags.length} tags`);

    for (const t of tags) {
      const tagName = t.name;
      if (seenTags.has(tagName)) continue;

      const sdk = repo.sdks.find((s) => tagName.startsWith(s.prefix));
      if (!sdk) continue;

      const version = tagName.slice(sdk.prefix.length);
      const changelog = await getChangelog(
        repo.owner,
        repo.repo,
        sdk.changelog
      );
      const section = extractChangelogSection(changelog, version);
      const significance = classifySignificance(version, section);

      if (!shouldInclude(significance)) {
        seenTags.add(tagName);
        continue;
      }

      if (isFirstRun && newEntries.length >= (backfillLimit || 30)) {
        seenTags.add(tagName);
        continue;
      }

      let date = null;
      try {
        const c = await fetchJson(t.commit.url);
        date = (c.commit?.committer?.date || c.commit?.author?.date || "").slice(0, 10) || null;
      } catch {}

      const entry = {
        tag: tagName,
        date,
        repo: `${repo.owner}/${repo.repo}`,
        sdk: sdk.label,
        pkg: sdk.pkg,
        version,
        significance,
        url: `https://github.com/${repo.owner}/${repo.repo}/releases/tag/${encodeURIComponent(tagName)}`,
        highlights: extractHighlights(section),
        collected: new Date().toISOString(),
      };

      newEntries.push(entry);
      seenTags.add(tagName);
      console.log(
        `new: ${sdk.label} v${version} (${significance}) — ${entry.highlights.length} highlights`
      );
    }
  }

  if (newEntries.length === 0) {
    console.log("no new significant releases");
    state.lastChecked = new Date().toISOString();
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
    return;
  }

  state.entries = [...newEntries, ...state.entries];
  state.lastChecked = new Date().toISOString();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));

  const publicData = {
    lastChecked: state.lastChecked,
    entries: state.entries.slice(0, PUBLIC_LIMIT),
  };
  fs.writeFileSync(PUBLIC_FILE, JSON.stringify(publicData, null, 2));

  console.log(
    `wrote ${newEntries.length} new entries (${state.entries.length} total)`
  );

  if (notify && !isFirstRun) {
    for (const entry of newEntries) {
      const bullets = entry.highlights
        .slice(0, 3)
        .map((h) => `→ ${h}`)
        .join("\n");
      const text = [
        `📦 **${entry.sdk} v${entry.version}** (${entry.significance})`,
        bullets,
        entry.url,
      ]
        .filter(Boolean)
        .join("\n\n");

      try {
        await postJson(KODIAK_URL, {
          channelId: BRIEF_CHANNEL,
          content: text,
        });
        console.log(`notified: ${entry.sdk} v${entry.version}`);
      } catch (e) {
        console.error(`notify failed: ${e.message}`);
      }
    }
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
