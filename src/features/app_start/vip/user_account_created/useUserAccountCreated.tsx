import { useSetRecoilState } from 'recoil';
import {
  isCongAccountCreateState,
  isUserAccountCreatedState,
} from '@states/app';

const useUserAccountCreated = () => {
  const setCongCreate = useSetRecoilState(isCongAccountCreateState);
  const setUserCreated = useSetRecoilState(isUserAccountCreatedState);

  const handleCreateCongregation = () => {
    setUserCreated(false);
    setCongCreate(true);
  };

  return { handleCreateCongregation };
};

export default useUserAccountCreated;
