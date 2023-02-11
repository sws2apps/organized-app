import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { saveProfilePic } from '../utils/app';

const useFirebaseAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        const provider = user.providerData[0]?.providerId || 'none';
        saveProfilePic(user.photoURL, provider);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
  }, []);

  return { isAuthenticated, user };
};

export default useFirebaseAuth;
