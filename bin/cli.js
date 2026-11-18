#!/usr/bin/env node
/**
 * @bouncelayer/mcp — connect any MCP client to the hosted BounceLayer MCP server.
 *
 * A thin stdio <-> remote bridge: it reads your API key from BOUNCELAYER_API_KEY
 * and bridges stdio to the BounceLayer Streamable HTTP endpoint
 * (default https://api.bouncelayer.com/mcp/, no redirect) via the `mcp-remote` launcher, injecting
 * the X-API-Key header.
 */
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const require = createRequire(import.meta.url);
const DEFAULT_URL = "https://api.bouncelayer.com/mcp/";

function flagValue(name) {
  const i = process.argv.indexOf(name);
  if (i !== -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--")) {
    return process.argv[i + 1];
  }
  return undefined;
}

const url = flagValue("--url") || process.env.BOUNCELAYER_MCP_URL || DEFAULT_URL;
const apiKey = flagValue("--api-key") || process.env.BOUNCELAYER_API_KEY;

if (!apiKey) {
  process.stderr.write(
    "[@bouncelayer/mcp] No API key found (set BOUNCELAYER_API_KEY or pass --api-key). " +
      "Keyless tools still work: create_agent_account gets you a key with free " +
      "credits, and verify_email_demo needs no key. Other tools return an auth error until a key is provided.\n"
  );
}

function resolveMcpRemoteBin() {
  let pkgJsonPath;
  try {
    pkgJsonPath = require.resolve("mcp-remote/package.json");
  } catch {
    let dir = dirname(require.resolve("mcp-remote"));
    for (let i = 0; i < 6 && !pkgJsonPath; i++) {
      try {
        readFileSync(join(dir, "package.json"));
        pkgJsonPath = join(dir, "package.json");
      } catch {
        dir = dirname(dir);
      }
    }
  }
  if (!pkgJsonPath) throw new Error("mcp-remote not found");
  const pkg = JSON.parse(readFileSync(pkgJsonPath, "utf8"));
  const binRel =
    typeof pkg.bin === "string"
      ? pkg.bin
      : pkg.bin?.["mcp-remote"] || Object.values(pkg.bin || {})[0];
  if (!binRel) throw new Error("mcp-remote has no bin entry");
  return resolve(dirname(pkgJsonPath), binRel);
}

let binPath;
try {
  binPath = resolveMcpRemoteBin();
} catch {
  process.stderr.write(
    "[@bouncelayer/mcp] Could not locate the mcp-remote dependency. " +
      "Try reinstalling: npm i -g @bouncelayer/mcp  (or clear the npx cache).\n"
  );
  process.exit(1);
}

const args = [binPath, url];
if (apiKey) args.push("--header", `X-API-Key: ${apiKey}`);

const sep = process.argv.indexOf("--");
if (sep !== -1) args.push(...process.argv.slice(sep + 1));

const child = spawn(process.execPath, args, { stdio: "inherit" });

child.on("error", (err) => {
  process.stderr.write(`[@bouncelayer/mcp] bridge failed to start: ${err.message}\n`);
  process.exit(1);
});
child.on("exit", (code, signal) => {
  if (signal) {
    try {
      process.kill(process.pid, signal);
    } catch {
      process.exit(1);
    }
  } else {
    process.exit(code ?? 0);
  }
});
for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => {
    try {
      child.kill(sig);
    } catch {
      /* ignore */
    }
  });
}
