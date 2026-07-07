import { createHash, createHmac } from "node:crypto";
import { resolve } from "node:path";

const MINIFLARE_D1_OBJECT_UNIQUE_KEY = "miniflare-D1DatabaseObject";
const MINIFLARE_D1_OBJECT_DIR = "miniflare-D1DatabaseObject";

export function getLocalD1DatabaseHash(databaseName: string) {
  const key = createHash("sha256")
    .update(MINIFLARE_D1_OBJECT_UNIQUE_KEY)
    .digest();

  const nameHmac = createHmac("sha256", key)
    .update(databaseName)
    .digest()
    .subarray(0, 16);

  const hmac = createHmac("sha256", key)
    .update(nameHmac)
    .digest()
    .subarray(0, 16);

  return Buffer.concat([nameHmac, hmac]).toString("hex");
}

export function getLocalD1DatabasePath(databaseName: string) {
  return resolve(
    ".wrangler/state/v3/d1",
    MINIFLARE_D1_OBJECT_DIR,
    `${getLocalD1DatabaseHash(databaseName)}.sqlite`,
  );
}
