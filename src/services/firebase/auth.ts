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

/**
 * Resolves once Firebase has restored (or ruled out) the signed-in user from
 * storage. Until then currentUser is null even for a signed-in user, and any
 * API call made in that window goes out without a token. The timeout guards
 * against the rare case where the SDK never settles.
 */
export const waitForAuthReady = async (timeoutMs = 10000) => {
  const auth = getAuth();

  await Promise.race([
    auth.authStateReady(),
    new Promise((resolve) => setTimeout(resolve, timeoutMs)),
  ]);

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
