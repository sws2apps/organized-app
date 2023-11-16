import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import backupWorkerInstance from '@services/worker/backupWorker';
import { saveProfilePic } from '@services/cpe/settings';
import { displaySnackNotification } from '@services/recoil/app';
import { getTranslation } from '@services/i18n/translation';

const useFirebaseAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
      setUser(user);
      backupWorkerInstance.setUserUID(user?.uid || undefined);

      if (user) {
        if (user.providerData.length > 1) {
          await displaySnackNotification({
            message: getTranslation({ key: 'oauthAccountExistsWithDifferentCredential' }),
            severity: 'warning',
          });

          setIsAuthenticated(false);
          return;
        }

        const provider = user.providerData[0]?.providerId || 'none';
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
