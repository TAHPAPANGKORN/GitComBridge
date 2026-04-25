import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // For GCM
const AUTH_TAG_LENGTH = 16;

/**
 * Gets the encryption key from env or provided string.
 */
function getEncryptionKey(providedKey?: string): Buffer {
  const keyStr = providedKey || process.env.ENCRYPTION_KEY;
  if (!keyStr) {
    throw new Error("ENCRYPTION_KEY is not defined in environment variables.");
  }

  const key = keyStr.length === 64 
    ? Buffer.from(keyStr, "hex") 
    : Buffer.from(keyStr, "utf8");

  if (key.length !== 32) {
    throw new Error("Encryption key must be 32 bytes long (or 64 hex characters).");
  }

  return key;
}

/**
 * Encrypts a string using AES-256-GCM.
 */
export function encrypt(text: string, secretKey?: string): string {
  const key = getEncryptionKey(secretKey);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag().toString("hex");
  
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts a string encrypted with the above encrypt function.
 */
export function decrypt(encryptedText: string, secretKey?: string): string {
  // Safe check: If it doesn't contain colons, it's probably not encrypted (legacy token)
  if (!encryptedText.includes(":")) {
    return encryptedText;
  }

  const key = getEncryptionKey(secretKey);
  const [ivHex, authTagHex, encryptedDataHex] = encryptedText.split(":");
  
  if (!ivHex || !authTagHex || !encryptedDataHex) {
    return encryptedText; // Fallback if format is weird
  }

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedDataHex, "hex", "utf8");
  decrypted += decipher.final("utf8");
  
  return decrypted;
}
