#!/usr/bin/env node
// x402 Verified by ForgeMesh — pulls the machine feed from forgemeshlabs/x402-verified
// (dist/verified.json) and writes it to public/partners.json (served at
// https://forgemesh.io/partners.json). site/lib/verified.ts reads that file.
//
// Usage: node scripts/verified-sync.js [--from <path>]
//   --from <path>   load a local JSON file instead of fetching from GitHub
//                   (fixtures, dry runs). Still validated and written the same way.
//
// On any failure (fetch error, bad JSON, wrong shape) this exits non-zero and leaves
// the existing public/partners.json untouched — a bad feed never takes the page down.
// GITHUB_TOKEN, if set, is sent as a bearer token (raises the rate limit; not required
// for a public raw file).
//
// Cron (added separately, not by this script): 25 */6 * * *
const fs = require("fs");
const path = require("path");
const https = require("https");

const FEED_URL =
  "https://raw.githubusercontent.com/forgemeshlabs/x402-verified/main/dist/verified.json";
const OUT_FILE = path.join(__dirname, "..", "public", "partners.json");
const UA = "Mozilla/5.0 (compatible; ForgeMesh-VerifiedSync/1.0; +https://forgemesh.io)";

function fetchRemote(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            "User-Agent": UA,
            Accept: "application/json",
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
      )
      .on("error", reject);
  });
}

function validate(feed) {
  if (!feed || typeof feed !== "object") throw new Error("feed is not an object");
  if (feed.version !== 2) throw new Error(`expected version 2, got ${JSON.stringify(feed.version)}`);
  if (!Array.isArray(feed.sellers)) throw new Error("feed.sellers is not an array");
  if (!Array.isArray(feed.partners)) throw new Error("feed.partners is not an array");
}

function writeAtomic(file, data) {
  const tmp = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, data);
  fs.renameSync(tmp, file);
}

async function run() {
  const fromIdx = process.argv.indexOf("--from");
  const fromPath = fromIdx !== -1 ? process.argv[fromIdx + 1] : null;

  let raw;
  if (fromPath) {
    raw = fs.readFileSync(path.resolve(fromPath), "utf8");
    console.log(`loaded local fixture: ${fromPath}`);
  } else {
    raw = await fetchRemote(FEED_URL);
    console.log(`fetched: ${FEED_URL}`);
  }

  let feed;
  try {
    feed = JSON.parse(raw);
  } catch (e) {
    throw new Error(`feed is not valid JSON: ${e.message}`);
  }
  validate(feed);

  writeAtomic(OUT_FILE, JSON.stringify(feed, null, 2));
  console.log(
    `wrote ${feed.sellers.length} seller(s), ${feed.partners.length} partner(s) -> ${OUT_FILE}`
  );
}

run().catch((e) => {
  console.error(`verified-sync failed: ${e.message}`);
  process.exit(1);
});
