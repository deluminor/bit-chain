/**
 * AES-256-GCM encryption utilities for sensitive data at rest.
 *
 * Used to encrypt Monobank API tokens before persisting to the database.
 * The encryption key is read from MONOBANK_ENCRYPTION_KEY (32-byte base64 string).
 *
 * Storage format: `<iv_base64url>:<ciphertext_base64url>:<tag_base64url>`
 *
 * @example
 * ```typescript
 * const encrypted = await encrypt(monobankToken);
 * await prisma.integration.update({ data: { token: encrypted } });
 *
 * const decrypted = await decrypt(integration.token);
 * // use decrypted token for API calls
 * ```
 */

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256; // bits
const IV_LENGTH = 12; // bytes — standard for GCM

/**
 * Lazily loads and caches the AES-GCM CryptoKey from MONOBANK_ENCRYPTION_KEY env var.
 *
 * @throws {Error} If MONOBANK_ENCRYPTION_KEY is not set or has invalid length.
 */
async function getEncryptionKey(): Promise<CryptoKey> {
  const raw = process.env['MONOBANK_ENCRYPTION_KEY'];
  if (!raw) {
    throw new Error('MONOBANK_ENCRYPTION_KEY environment variable is not set');
  }

  const keyBytes = Buffer.from(raw, 'base64');
  if (keyBytes.length !== 32) {
    throw new Error(
      `MONOBANK_ENCRYPTION_KEY must be 32 bytes when base64-decoded, got ${keyBytes.length}`
    );
  }

  return crypto.subtle.importKey('raw', keyBytes, { name: ALGORITHM, length: KEY_LENGTH }, false, [
    'encrypt',
    'decrypt',
  ]);
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 *
 * @param plaintext - The string to encrypt (e.g., Monobank API token)
 * @returns Encoded string in format `iv:ciphertext:tag` (base64url parts, colon-separated)
 * @throws {Error} If encryption key is missing or invalid
 */
export async function encrypt(plaintext: string): Promise<string> {
  const key = await getEncryptionKey();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encoded = new TextEncoder().encode(plaintext);

  const ciphertextWithTag = await crypto.subtle.encrypt({ name: ALGORITHM, iv }, key, encoded);

  const ciphertextBytes = new Uint8Array(ciphertextWithTag);

  return [
    Buffer.from(iv).toString('base64url'),
    Buffer.from(ciphertextBytes).toString('base64url'),
  ].join(':');
}

/**
 * Decrypts a string previously encrypted with {@link encrypt}.
 *
 * @param ciphertext - Encoded string from `encrypt()` in `iv:ciphertext` format
 * @returns Original plaintext string
 * @throws {Error} If the ciphertext is malformed, key is wrong, or data is tampered
 */
export async function decrypt(ciphertext: string): Promise<string> {
  const parts = ciphertext.split(':');
  if (parts.length !== 2) {
    throw new Error('Invalid ciphertext format: expected "iv:ciphertext"');
  }

  const [ivPart, dataPart] = parts as [string, string];
  const key = await getEncryptionKey();
  const iv = Buffer.from(ivPart, 'base64url');
  const data = Buffer.from(dataPart, 'base64url');

  const decrypted = await crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, data);
  return new TextDecoder().decode(decrypted);
}

/**
 * Returns true if the given string looks like an encrypted token (iv:ciphertext format).
 * Use before calling decrypt() to avoid decrypting plain-text legacy tokens.
 *
 * @param value - String to check
 */
export function isEncrypted(value: string): boolean {
  const parts = value.split(':');
  return parts.length === 2 && (parts[0]?.length ?? 0) > 0 && (parts[1]?.length ?? 0) > 0;
}
