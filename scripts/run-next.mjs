import { rm } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { spawn } from "node:child_process";

const require = createRequire(import.meta.url);

const mode = process.argv[2];

if (!mode || !["dev", "build", "start"].includes(mode)) {
  console.error('Usage: node scripts/run-next.mjs <dev|build|start>');
  process.exit(1);
}

const rootDir = process.cwd();
const nextBin = require.resolve("next/dist/bin/next");

const targetsByMode = {
  dev: [".next-dev"],
  build: [".next"],
  start: []
};

async function cleanTargets() {
  for (const relativePath of targetsByMode[mode]) {
    await rm(resolve(rootDir, relativePath), {
      recursive: true,
      force: true
    });
  }
}

await cleanTargets();

const child = spawn(process.execPath, [nextBin, mode], {
  cwd: rootDir,
  stdio: "inherit",
  env: process.env
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
