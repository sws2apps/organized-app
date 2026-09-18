import {
  AuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  getAuth,
  indexedDBLocalPersistence,
  setPersistence,
  signInWithCustomToken,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

export const userSignOut = async () => {
  const auth = await getAuth();
  if (auth) {
    await signOut(auth);
  }
};

export class AuthNotReadyError extends Error {
  constructor() {
    super('Firebase auth did not settle in time');
    this.name = 'AuthNotReadyError';
  }
}

/**
 * Resolves once Firebase has restored (or ruled out) the signed-in user from
 * storage. Until then currentUser is null even for a signed-in user, and any
 * API call made in that window goes out without a token.
 *
 * If the SDK has not settled within the timeout this rejects instead of
 * resolving to null: "not known yet" must not be read as "signed out", or the
 * caller would send an unauthenticated request and sign the user out.
 */
export const waitForAuthReady = async (timeoutMs = 10000) => {
  const auth = getAuth();

  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    await Promise.race([
      auth.authStateReady(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new AuthNotReadyError()), timeoutMs);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }

  return auth.currentUser;
};

/**
 * Resolves with the signed-in user (or null) once Firebase has settled,
 * however long that takes. For recovering after waitForAuthReady timed out.
 */
export const whenAuthSettled = async () => {
  const auth = getAuth();

  await auth.authStateReady();

  return auth.currentUser;
};

export const currentAuthUser = () => {
  const auth = getAuth();
  const user = auth?.currentUser;
  return user;
};

export const setAuthPersistence = async () => {
  const auth = getAuth();

  await setPersistence(auth, indexedDBLocalPersistence);
};

export const userSignInCustomToken = async (code: string) => {
  const auth = getAuth();
  const userCredential = await signInWithCustomToken(auth, code);

  return userCredential?.user;
};

export const userSignInPopup = async (provider: AuthProvider) => {
  const auth = getAuth();
  const result = await signInWithPopup(auth, provider);

  return result?.user;
};

export const authProvider = {
  GitHub: new GithubAuthProvider(),
  Google: new GoogleAuthProvider(),
  Microsoft: new OAuthProvider('microsoft.com').setCustomParameters({
    prompt: 'consent',
  }),
  Yahoo: new OAuthProvider('yahoo.com'),
};
