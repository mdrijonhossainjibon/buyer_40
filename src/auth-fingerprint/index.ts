import crypto from "crypto";

const ALGO = "aes-256-cbc"; // symmetric encryption

export interface SignatureResult {
  timestamp: string;
  hash: string;
  signature: string;
}

export interface VerifySignatureOptions {
  timestamp: string;
  hash: string;
  signature: string;
  allowedDelay?: number; // in milliseconds
}

export interface VerifyResult {
  success: boolean;
  data?: string;
}

/**
 * Generate a signed hash of the data
 */
export function generateSignature(data: string, secret: string): SignatureResult {
  const timestamp = Date.now().toString();

  // 1️⃣ Encrypt data
  const iv = crypto.randomBytes(16);
  const key = crypto.createHash("sha256").update(secret).digest();
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(data, "utf8"), cipher.final()]);
  const hash = `${iv.toString("hex")}:${encrypted.toString("hex")}`;

  // 2️⃣ Create hash & signature
  const hash1 = crypto.createHash("sha256").update(hash + timestamp).digest("hex");
  const signature = crypto.createHmac("sha256", secret).update(hash1).digest("hex");

  return { timestamp, hash, signature };
}

/**
 * Verify the signature and decrypt data
 */
export function verifySignature(
  options: VerifySignatureOptions,
  secret: string
): VerifyResult {
  const { timestamp, hash, signature, allowedDelay = 1000 * 5 } = options;

  // 1️⃣ Check timestamp
  if (Date.now() - parseInt(timestamp) > allowedDelay) return { success: false };

  // 2️⃣ Regenerate hash & signature
  const expectedHash = crypto.createHash("sha256").update(hash + timestamp).digest("hex");
  const expectedSignature = crypto.createHmac("sha256", secret).update(expectedHash).digest("hex");

  // 3️⃣ Compare signatures safely
  if (
    !crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    )
  ) {
    return { success: false };
  }

  // 4️⃣ Decrypt
  const [ivHex, encryptedHex] = hash.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");
  const key = crypto.createHash("sha256").update(secret).digest();
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");

  return { success: true, data: decrypted };
}


export * from './api';