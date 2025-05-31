import { useState } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { cookiesConsentState, isAccountChooseState } from '@states/app';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useTermsUse = () => {
  const [cookiesConsent, setCookiesConsent] = useAtom(cookiesConsentState);

  const setIsAccountChoose = useSetAtom(isAccountChooseState);

  const [readComplete, setReadComplete] = useState(false);

  const handleTermsUse = () => {
    const lang = localStorage.getItem('ui_lang') ?? 'eng';

    const font = localStorage.getItem('app_font') ?? 'Inter';

    localStorage.setItem('userConsent', 'accept');
    localStorage.setItem('ui_lang', lang);
    localStorage.setItem('app_font', font);

    setCookiesConsent(true);
  };

  const handleRejectTerms = async () => {
    setIsAccountChoose(true);
    await dbAppSettingsUpdate({ 'user_settings.account_type': '' });
  };

  return {
    cookiesConsent,
    handleTermsUse,
    readComplete,
    setReadComplete,
    handleRejectTerms,
  };
};

export default useTermsUse;
