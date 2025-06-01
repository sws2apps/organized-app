import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { pocketStartup } from '@services/app';
import { isPocketSignUpState } from '@states/app';
import logger from '@services/logger';

const useStartup = () => {
  const isSignUp = useAtomValue(isPocketSignUpState);

  useEffect(() => {
    logger.info('app', 'pocket signup check ran');
    pocketStartup();
  }, []);

  return { isSignUp };
};

export default useStartup;
