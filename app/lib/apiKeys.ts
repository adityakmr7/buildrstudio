import { randomBytes } from "crypto";

// Same format the Paddle webhook and the regenerate route issue. Kept in
// one place so every issuance path produces identical keys.
export function generateApiKey() {
  return `pk_live_${randomBytes(18).toString("hex")}`;
}
