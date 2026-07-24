const PBKDF2_ITERATIONS = 250_000;
const PBKDF2_KEY_LEN_BITS = 256;
const SALT_BYTES = 16;
const HEX_REGEX = /^[0-9a-fA-F]+$/;

const bytesToHex = (bytes: Uint8Array): string => {
  return Array.from(bytes)
    .map((b) => ('00' + b.toString(16)).slice(-2))
    .join('');
};

const hexToBytes = (hex: string): Uint8Array => {
  if (typeof hex !== 'string' || hex.length === 0) {
    throw new Error('hexToBytes: input must be a non-empty string');
  }
  if (hex.length % 2 !== 0) {
    throw new Error(
      `hexToBytes: input must have even length (got ${hex.length})`
    );
  }
  if (!HEX_REGEX.test(hex)) {
    throw new Error('hexToBytes: input contains non-hex characters');
  }
  const result = new Uint8Array(hex.length / 2);
  for (let i = 0; i < result.length; i++) {
    result[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return result;
};

export const generateSalt = (): string => {
  const array = new Uint8Array(SALT_BYTES);
  crypto.getRandomValues(array);
  return bytesToHex(array);
};

export const hashPin = async (
  pin: string,
  salt: string,
  iterations: number = PBKDF2_ITERATIONS
): Promise<string> => {
  const pinBytes = new TextEncoder().encode(pin);
  const saltBytes = hexToBytes(salt);

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    pinBytes as BufferSource,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derived = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes as BufferSource,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    PBKDF2_KEY_LEN_BITS
  );

  return bytesToHex(new Uint8Array(derived));
};

export const verifyPin = async (
  pin: string,
  hash: string,
  salt: string,
  iterations: number = PBKDF2_ITERATIONS
): Promise<boolean> => {
  const candidate = await hashPin(pin, salt, iterations);

  if (candidate.length !== hash.length) return false;

  let diff = 0;
  for (let i = 0; i < candidate.length; i++) {
    diff |= (candidate.codePointAt(i) ?? 0) ^ (hash.codePointAt(i) ?? 0);
  }

  return diff === 0;
};

export const APP_LOCK_PBKDF2_ITERATIONS = PBKDF2_ITERATIONS;
