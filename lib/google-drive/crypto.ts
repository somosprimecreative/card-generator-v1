import "server-only";

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

export type EncryptedValue = { ciphertext: string; iv: string };

function encryptionKey(encoded: string) {
  const key = Buffer.from(encoded, "base64");
  if (key.length !== 32) throw new Error("A chave de criptografia do Google Drive deve ter 32 bytes em Base64.");
  return key;
}

export function encrypt(value: string, encodedKey: string): EncryptedValue {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(encodedKey), iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final(), cipher.getAuthTag()]);
  return { ciphertext: ciphertext.toString("base64"), iv: iv.toString("base64") };
}

export function decrypt(value: EncryptedValue, encodedKey: string) {
  const payload = Buffer.from(value.ciphertext, "base64");
  if (payload.length < 17) throw new Error("Token do Google Drive inválido.");
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(encodedKey), Buffer.from(value.iv, "base64"));
  decipher.setAuthTag(payload.subarray(-16));
  return Buffer.concat([decipher.update(payload.subarray(0, -16)), decipher.final()]).toString("utf8");
}
