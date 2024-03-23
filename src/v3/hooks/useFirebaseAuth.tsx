import { useEffect, useState } from 'react';
import { User, getAuth, onAuthStateChanged } from 'firebase/auth';
import worker from '@services/worker/backupWorker';
import { saveProfilePic } from '@services/app/settings';
import { displaySnackNotification, setCurrentProvider } from '@services/recoil/app';
import { getTranslation } from '@services/i18n/translation';

const useFirebaseAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, async (user: User) => {
      setUser(user);
      worker.postMessage({ field: 'userUID', value: user?.uid });

      if (user) {
        if (user.providerData.length > 1) {
          await displaySnackNotification({
            header: getTranslation({ key: 'tr_errorTitle' }),
            message: getTranslation({ key: 'oauthAccountExistsWithDifferentCredential' }),
            severity: 'error',
          });

          setIsAuthenticated(false);
          return;
        }

        const provider = user.providerData[0]?.providerId || 'none';
        await setCurrentProvider(provider);

        const photoURL = user.providerData[0]?.photoURL;
        saveProfilePic(photoURL, provider);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
  }, []);

  return { isAuthenticated, user };
};

export default useFirebaseAuth;
