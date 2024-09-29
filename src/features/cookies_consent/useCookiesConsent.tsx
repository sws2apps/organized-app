import { useSearchParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { cookiesConsentState } from '@states/app';

const useCookiesConsent = () => {
  const [params, setParams] = useSearchParams();

  const setConsent = useSetRecoilState(cookiesConsentState);

  const handleConsent = () => {
    const lang = params.get('locale') || 'en';
    const font = params.get('font') || 'Inter';

    localStorage.setItem('userConsent', 'accept');
    localStorage.setItem('app_lang', lang);
    localStorage.setItem('app_font', font);
    setConsent(true);

    setParams((params) => {
      params.delete('locale');
      params.delete('font');

      return params;
    });
  };

  const handleReject = () => {
    window.location.reload();
  };

  return { handleReject, handleConsent };
};

export default useCookiesConsent;
