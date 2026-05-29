const RP_NAME = 'Organized';

const base64UrlEncode = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCodePoint(bytes[i]);
  }
  return btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
};

const base64UrlDecode = (value: string): ArrayBuffer => {
  const padded =
    value.replaceAll('-', '+').replaceAll('_', '/') +
    '='.repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.codePointAt(i) ?? 0;
  return bytes.buffer;
};

const randomChallenge = (): Uint8Array => {
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);
  return challenge;
};

export const isBiometricAvailable = async (): Promise<boolean> => {
  if (typeof globalThis.window === 'undefined') return false;
  if (!globalThis.PublicKeyCredential) return false;

  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
};

export const registerBiometric = async (
  userId: string,
  userName: string,
  displayName: string
): Promise<{ credentialId: string }> => {
  const userIdBytes = new TextEncoder().encode(userId || userName || 'user');

  const credential = (await navigator.credentials.create({
    publicKey: {
      challenge: randomChallenge(),
      rp: { name: RP_NAME, id: globalThis.window.location.hostname },
      user: {
        id: userIdBytes,
        name: userName || 'user',
        displayName: displayName || userName || 'user',
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },
        { type: 'public-key', alg: -257 },
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        residentKey: 'preferred',
      },
      timeout: 60_000,
      attestation: 'none',
    },
  })) as PublicKeyCredential | null;

  if (!credential) {
    throw new Error('Biometric registration was cancelled');
  }

  return { credentialId: base64UrlEncode(credential.rawId) };
};

// Local-only unlock: we trust the OS 'required' biometric/passcode check.
export const verifyBiometric = async (
  credentialId: string
): Promise<boolean> => {
  try {
    const assertion = (await navigator.credentials.get({
      publicKey: {
        challenge: randomChallenge(),
        rpId: globalThis.window.location.hostname,
        allowCredentials: [
          {
            id: base64UrlDecode(credentialId),
            type: 'public-key',
            transports: ['internal'],
          },
        ],
        userVerification: 'required',
        timeout: 60_000,
      },
    })) as PublicKeyCredential | null;

    return !!assertion;
  } catch {
    return false;
  }
};
