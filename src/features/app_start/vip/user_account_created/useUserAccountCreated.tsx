import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import {
  isCongAccountCreateState,
  isUserAccountCreatedState,
  isUserSignInState,
} from '@states/app';

const useUserAccountCreated = () => {
  const setCongCreate = useSetAtom(isCongAccountCreateState);
  const setUserCreated = useSetAtom(isUserAccountCreatedState);
  const setSignin = useSetAtom(isUserSignInState);

  const handleCreateCongregation = () => {
    setUserCreated(false);
    setCongCreate(true);
  };

  useEffect(() => {
    setSignin(false);
  }, [setSignin]);

  return { handleCreateCongregation };
};

export default useUserAccountCreated;
