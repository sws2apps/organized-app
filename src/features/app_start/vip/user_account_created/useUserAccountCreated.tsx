import { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  featureFlagsState,
  isCongAccountCreateState,
  isUserAccountCreatedState,
  isUserSignInState,
} from '@states/app';

const useUserAccountCreated = () => {
  const setCongCreate = useSetRecoilState(isCongAccountCreateState);
  const setUserCreated = useSetRecoilState(isUserAccountCreatedState);
  const setSignin = useSetRecoilState(isUserSignInState);

  const FEATURE_FLAGS = useRecoilValue(featureFlagsState);

  const handleCreateCongregation = () => {
    setUserCreated(false);
    setCongCreate(true);
  };

  useEffect(() => {
    setSignin(false);
  }, [setSignin]);

  return { handleCreateCongregation, FEATURE_FLAGS };
};

export default useUserAccountCreated;
