import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EncryptionService {

  private KEY_HEX =
    'e409f1f33f5d69243f24cefd2ca36fbe95932c280a79b37ca0507971d2a1957a';

  private hexToUint8(hex: string): Uint8Array {
    if (hex.length % 2 !== 0) hex = '0' + hex;
    const arr = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      arr[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return arr;
  }

  private uint8ToHex(bytes: ArrayBuffer | Uint8Array): string {
    const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    return Array.from(u8)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private async importKey(): Promise<CryptoKey> {
  const keyBytes = this.hexToUint8(this.KEY_HEX);

  // ✅ Fix: Explicit cast to BufferSource (resolves SharedArrayBuffer type issues)
  return crypto.subtle.importKey(
    'raw',
    keyBytes as unknown as BufferSource,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

  async encrypt(plainText: string): Promise<{ iv: string; content: string; tag: string }> {
    const key = await this.importKey();
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const data = new TextEncoder().encode(plainText);

    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);

    const encryptedBytes = new Uint8Array(encrypted);
    const tagLengthBytes = 16; // 128-bit tag
    const ctBytes = encryptedBytes.slice(0, encryptedBytes.length - tagLengthBytes);
    const tagBytes = encryptedBytes.slice(encryptedBytes.length - tagLengthBytes);

    return {
      iv: this.uint8ToHex(iv),
      content: this.uint8ToHex(ctBytes),
      tag: this.uint8ToHex(tagBytes),
    };
  }

  async decrypt(payload: { iv: string; content: string; tag: string }): Promise<string> {
  const key = await this.importKey();

  // Convert hex to plain Uint8Array (with ArrayBuffer backing)
  const ivBytes = new Uint8Array(this.hexToUint8(payload.iv));   // 👈 ensures ArrayBuffer, not SharedArrayBuffer
  const ctBytes = new Uint8Array(this.hexToUint8(payload.content));
  const tagBytes = new Uint8Array(this.hexToUint8(payload.tag));

  // Combine ciphertext + tag into one contiguous ArrayBuffer
  const combined = new Uint8Array(ctBytes.length + tagBytes.length);
  combined.set(ctBytes, 0);
  combined.set(tagBytes, ctBytes.length);

  // ✅ Fix: force cast ivBytes to BufferSource (resolves type incompatibility)
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBytes as unknown as BufferSource },
    key,
    combined.buffer
  );

  return new TextDecoder().decode(decrypted);
}

async decryptAndParse(encryptedData: any): Promise<any> {
  try {
    // Step 1: decrypt (string output)
    const decryptedText = await this.decrypt(encryptedData);

    // Step 2: convert to JSON
    return JSON.parse(decryptedText);

  } catch (err) {
    console.error("❌ Failed to decrypt/parse response:", err);
    return null;
  }
}
}