import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userLocalUIDState } from '@states/settings';

const useStartup = () => {
  const userLocalUID = useRecoilValue(userLocalUIDState);

  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const checkLoginState = async () => {
      if (userLocalUID.length === 0) {
        setIsSignUp(true);
        return;
      }
    };

    checkLoginState();
  }, [userLocalUID]);

  return { isSignUp };
};

export default useStartup;
