const RP_NAME = 'Organized';

const base64UrlEncode = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const base64UrlDecode = (value: string): ArrayBuffer => {
  const padded =
    value.replace(/-/g, '+').replace(/_/g, '/') +
    '='.repeat((4 - (value.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
};

const randomChallenge = (): Uint8Array => {
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);
  return challenge;
};

export const isBiometricAvailable = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  if (!window.PublicKeyCredential) return false;

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
      challenge: randomChallenge() as BufferSource,
      rp: { name: RP_NAME, id: window.location.hostname },
      user: {
        id: userIdBytes as BufferSource,
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

// Local-only unlock gate: a successful platform-authenticator assertion with
// userVerification: 'required' means the OS verified biometric/passcode.
// We do not validate the assertion server-side because nothing leaves the device.
export const verifyBiometric = async (
  credentialId: string
): Promise<boolean> => {
  try {
    const assertion = (await navigator.credentials.get({
      publicKey: {
        challenge: randomChallenge() as BufferSource,
        rpId: window.location.hostname,
        allowCredentials: [
          {
            id: base64UrlDecode(credentialId) as BufferSource,
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
