import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const uid = process.argv[2] ?? "i6e3j4RoqkhkuuhalEXjfRSFQie2";
const explicitKeyPath = process.argv[3] ?? process.env.FIREBASE_ADMIN_KEY_PATH;
const keyPathCandidates = explicitKeyPath
  ? [path.resolve(process.cwd(), explicitKeyPath)]
  : [
      path.join(repoRoot, "firebase-admin-key.json"),
      path.join(__dirname, "firebase-admin-key.json"),
    ];

let serviceAccount;
let resolvedKeyPath = "";

for (const candidate of keyPathCandidates) {
  try {
    const raw = await readFile(candidate, "utf8");
    serviceAccount = JSON.parse(raw);
    resolvedKeyPath = candidate;
    break;
  } catch {
    // Try the next known location.
  }
}

if (!serviceAccount) {
  console.error("Missing Firebase service account key.");
  console.error("Expected one of:");
  for (const candidate of keyPathCandidates) {
    console.error(`- ${candidate}`);
  }
  console.error("Usage: node scripts/set-admin-claim.mjs <uid> [path-to-key.json]");
  process.exit(1);
}

initializeApp({ credential: cert(serviceAccount) });

await getAuth().setCustomUserClaims(uid, { admin: true });
console.log(`Admin claim set for ${uid}`);
console.log(`Using service account: ${resolvedKeyPath}`);
