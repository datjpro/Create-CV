import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

export default function nextConfig(phase) {
  return {
    reactStrictMode: true,
    // Keep dev and production artifacts separate so `next dev` does not race
    // with `next build`/`next start` over the same `.next` manifest files.
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next"
  };
}
