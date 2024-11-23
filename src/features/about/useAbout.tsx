import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { isAboutOpenState } from '@states/app';
import { setIsAboutOpen, setIsSupportOpen } from '@services/recoil/app';
import { AboutProps } from './index.types';

const currentYear = new Date().getFullYear();

const useAbout = ({ updatePwa }: AboutProps) => {
  const { t } = useAppTranslation();

  const isOpen = useRecoilValue(isAboutOpenState);

  const privacyText = useMemo(() => {
    const parser = new DOMParser();

    const htmlString = t('tr_privacySecurityDesc');
    const html = parser.parseFromString(htmlString, 'text/html');
    const privacyLink = Array.from(html.querySelectorAll('a')).at(1);

    return privacyLink.textContent;
  }, [t]);

  const handleForceReload = () => {
    try {
      updatePwa();

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleClose = async () => {
    await setIsAboutOpen(false);
  };

  const handleOpenSupport = async () => {
    await setIsAboutOpen(false);
    await setIsSupportOpen(true);
  };

  const handleOpenDoc = () => {
    window.open(`https://guide.organized-app.com`, '_blank');
  };

  return {
    isOpen,
    handleClose,
    currentYear,
    handleOpenDoc,
    handleOpenSupport,
    handleForceReload,
    privacyText,
  };
};

export default useAbout;
