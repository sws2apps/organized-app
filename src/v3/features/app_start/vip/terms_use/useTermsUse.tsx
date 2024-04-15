import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { isShowTermsUseState } from '@states/app';
import { setShowTermsUse } from '@services/recoil/app';

const useTermsUse = () => {
  const showTermsUse = useRecoilValue(isShowTermsUseState);
  const [readComplete, setReadComplete] = useState(false);

  const handleTermsUse = () => {
    localStorage.setItem('termsUse', 'false');
    setShowTermsUse(false);
  };

  return { showTermsUse, handleTermsUse, readComplete, setReadComplete };
};

export default useTermsUse;
