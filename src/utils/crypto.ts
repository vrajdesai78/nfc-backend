import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "crypto";

const algorithm = "aes-256-cbc";
const ivLength = 16;
const keyLength = 32;

function generateKey(password: string): Buffer {
  return scryptSync(password, "salt", keyLength);
}

export function encryptString(data: string, password: string): string {
  const key = generateKey(password);
  const iv = randomBytes(ivLength);
  const cipher = createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

export function decryptString(encodedData: string, password: string): string {
  const key = generateKey(password);
  const parts = encodedData.split(":");

  const iv = Buffer.from(parts.shift()!, "hex");
  const encryptedText = parts.join(":");

  const decipher = createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
