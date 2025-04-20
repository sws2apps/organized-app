import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { isAboutOpenState } from '@states/app';
import { setIsAboutOpen, setIsSupportOpen } from '@services/states/app';
import { AboutProps } from './index.types';

const parser = new DOMParser();

const currentYear = new Date().getFullYear();

const useAbout = ({ updatePwa }: AboutProps) => {
  const { t } = useAppTranslation();

  const isOpen = useAtomValue(isAboutOpenState);

  const privacyText = useMemo(() => {
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

  const handleClose = () => setIsAboutOpen(false);

  const handleOpenSupport = () => {
    setIsAboutOpen(false);
    setIsSupportOpen(true);
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
