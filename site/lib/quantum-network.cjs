'use strict';
const https = require('node:https');
const net = require('node:net');

const blocked = new net.BlockList();
for (const [ip, bits] of [['0.0.0.0',8],['10.0.0.0',8],['100.64.0.0',10],['127.0.0.0',8],['169.254.0.0',16],['172.16.0.0',12],['192.0.0.0',24],['192.0.2.0',24],['192.168.0.0',16],['198.18.0.0',15],['198.51.100.0',24],['203.0.113.0',24],['224.0.0.0',4],['240.0.0.0',4]]) blocked.addSubnet(ip,bits,'ipv4');
const global6 = new net.BlockList(); global6.addSubnet('2000::',3,'ipv6');
const blocked6 = new net.BlockList();
for (const [ip,bits] of [['2001::',23],['2001:db8::',32],['2002::',16],['3fff::',20]]) blocked6.addSubnet(ip,bits,'ipv6');
function isPrivateAddr(ip) {
  const family = net.isIP(ip);
  if (family === 4) return blocked.check(ip,'ipv4');
  if (family === 6) return !global6.check(ip,'ipv6') || blocked6.check(ip,'ipv6');
  return true;
}

// All HTTP probes use the same validated address as TLS. No redirects, fresh
// DNS lookups, connection pooling, or unbounded bodies. Host/SNI stay original.
function requestPinned(host, addr, path, method = 'GET', request = https.request) {
  return new Promise((resolve, reject) => {
    if (isPrivateAddr(addr)) return reject(new Error('private address refused'));
    let req, timer, done = false;
    const finish = (error, value) => {
      if (done) return;
      done = true; clearTimeout(timer);
      if (error) reject(error); else resolve(value);
    };
    timer = setTimeout(() => { finish(new Error('timeout')); req?.destroy(); }, 8000);
    try {
      req = request({ hostname: host, port: 443, servername: host, path, method,
        agent: false, rejectUnauthorized: true, maxHeaderSize: 16384,
        lookup: (_host, options, cb) => cb(null, options.all ? [{address: addr, family: net.isIP(addr)}] : addr, net.isIP(addr)),
        headers: {'user-agent': 'ForgeMeshQuantumCheck/1.0', accept: 'application/json'}
      }, res => {
        let size = 0; const chunks = [];
        res.on('error', () => finish(new Error('response failed')));
        res.on('aborted', () => finish(new Error('response aborted')));
        res.on('data', chunk => {
          size += chunk.length;
          if (size > 65536) { finish(new Error('response too large')); res.destroy(); req.destroy(); }
          else chunks.push(chunk);
        });
        res.on('end', () => finish(null, {status: res.statusCode || 0, headers: res.headers, body: Buffer.concat(chunks)}));
      });
      req.on('error', () => finish(new Error('request failed')));
      req.end();
    } catch { finish(new Error('request failed')); req?.destroy(); }
  });
}
function parseHsts(value) {
  if (typeof value !== 'string') return null;
  const seen = new Set(); let age = null, sub = false, preload = false;
  for (const item of value.split(';')) {
    const token = item.trim(); if (!token) continue;
    const match = /^([!#$%&'*+.^_`|~\w-]+)(?:\s*=\s*(?:"([^"\\]*)"|([!#$%&'*+.^_`|~\w-]+)))?$/.exec(token);
    if (!match) return null;
    const key = match[1].toLowerCase(), val = match[2] ?? match[3];
    if (seen.has(key)) return null; seen.add(key);
    if (key === 'max-age') { if (!/^\d+$/.test(val || '')) return null; age = Number(val); if (!Number.isSafeInteger(age)) return null; }
    if (key === 'includesubdomains') { if (val !== undefined) return null; sub = true; }
    if (key === 'preload') preload = true;
  }
  return age && age > 0 ? {max_age: age, include_subdomains: sub, preload} : null;
}
function isManifest(body) {
  try { const v = JSON.parse(body.toString('utf8')); return !!v && typeof v === 'object' && (Array.isArray(v.resources) || Array.isArray(v.endpoints)); } catch { return false; }
}
module.exports = {isPrivateAddr, requestPinned, parseHsts, isManifest};
