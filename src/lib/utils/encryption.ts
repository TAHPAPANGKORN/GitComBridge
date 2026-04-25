import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // For GCM
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypts a string using AES-256-GCM.
 * The key must be 32 characters long (256 bits).
 */
export function encrypt(text: string, secretKey: string): string {
  // If key is 64 hex chars, it's 32 bytes. If 32 chars, it's also 32 bytes (utf8).
  const key = secretKey.length === 64 
    ? Buffer.from(secretKey, "hex") 
    : Buffer.from(secretKey, "utf8");

  if (key.length !== 32) {
    throw new Error("Encryption key must be 32 bytes long (or 64 hex characters).");
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag().toString("hex");
  
  // Format: iv:authTag:encryptedData
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts a string encrypted with the above encrypt function.
 */
export function decrypt(encryptedText: string, secretKey: string): string {
  const key = secretKey.length === 64 
    ? Buffer.from(secretKey, "hex") 
    : Buffer.from(secretKey, "utf8");

  if (key.length !== 32) {
    throw new Error("Encryption key must be 32 bytes long (or 64 hex characters).");
  }

  const [ivHex, authTagHex, encryptedDataHex] = encryptedText.split(":");
  
  if (!ivHex || !authTagHex || !encryptedDataHex) {
    throw new Error("Invalid encrypted text format.");
  }

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedDataHex, "hex", "utf8");
  decrypted += decipher.final("utf8");
  
  return decrypted;
}
