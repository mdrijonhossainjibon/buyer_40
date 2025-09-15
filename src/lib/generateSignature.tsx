import crypto from "crypto";

export function generateSignature(data: string, secret: string) {
    const timestamp = Date.now().toString();
  
    // step 1: hash
    const hash = crypto.createHash("sha256").update(data + timestamp).digest("hex");
  
    // step 2: signature
    const signature = crypto.createHmac("sha256", secret).update(hash).digest("hex");
  
    return { timestamp, hash, signature };
  }



export function verifySignature(
    timestamp: string,
    secret: string,
    signature: string,
    hash: string,
    allowedDelay: number = 10_000 // default 10s
  ): boolean {
    // Expected signature আবার জেনারেট করো
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(hash)
      .digest("hex");
  
    // Signature মিল আছে কিনা
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
   
    const now = Date.now();
    const isFresh = Math.abs(now - parseInt(timestamp)) <= allowedDelay;
  
    return isValid && isFresh;
  }
