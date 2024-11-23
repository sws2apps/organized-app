import { useSetRecoilState } from 'recoil';
import {
  isCongAccountCreateState,
  isUserAccountCreatedState,
  isUserSignInState,
} from '@states/app';
import { useEffect } from 'react';

const useUserAccountCreated = () => {
  const setCongCreate = useSetRecoilState(isCongAccountCreateState);
  const setUserCreated = useSetRecoilState(isUserAccountCreatedState);
  const setSignin = useSetRecoilState(isUserSignInState);

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
