import { Paddle, Environment } from "@paddle/paddle-node-sdk";

// Lazily constructed — a missing PADDLE_API_KEY shouldn't crash the build or
// any page that doesn't touch billing (Next.js evaluates route modules
// during `collect page data` even for routes that never run in a given
// request). The error still surfaces, just at first real use.
let cached: Paddle | undefined;

export function getPaddle(): Paddle {
  if (cached) return cached;
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) {
    throw new Error("PADDLE_API_KEY is not set (see .env.example).");
  }
  cached = new Paddle(apiKey, {
    environment: process.env.PADDLE_ENV === "production" ? Environment.production : Environment.sandbox,
  });
  return cached;
}
