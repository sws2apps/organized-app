import { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isAccountChooseState, isShowTermsUseState } from '@states/app';
import { setShowTermsUse } from '@services/recoil/app';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useTermsUse = () => {
  const setIsAccountChoose = useSetRecoilState(isAccountChooseState);

  const showTermsUse = useRecoilValue(isShowTermsUseState);

  const [readComplete, setReadComplete] = useState(false);

  const handleTermsUse = () => {
    localStorage.setItem('termsUse', 'false');
    setShowTermsUse(false);
  };

  const handleRejectTerms = async () => {
    setIsAccountChoose(true);
    await dbAppSettingsUpdate({ 'user_settings.account_type': '' });
  };

  return {
    showTermsUse,
    handleTermsUse,
    readComplete,
    setReadComplete,
    handleRejectTerms,
  };
};

export default useTermsUse;
