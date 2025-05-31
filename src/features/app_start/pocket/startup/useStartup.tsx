import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { pocketStartup } from '@services/app';
import { isPocketSignUpState } from '@states/app';

const useStartup = () => {
  const isSignUp = useAtomValue(isPocketSignUpState);

  useEffect(() => {
    pocketStartup();
  }, []);

  return { isSignUp };
};

export default useStartup;
