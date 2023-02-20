import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { saveProfilePic } from '../utils/app';
import { displayMultiProviderAuthError } from '../utils/error';
import backupWorkerInstance from '../workers/backupWorker';

const useFirebaseAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      backupWorkerInstance.setUserUID(user?.uid || undefined);
      setUser(user);
      if (user) {
        if (user.providerData.length > 1) {
          displayMultiProviderAuthError();
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
