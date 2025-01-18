import { useEffect, useRef } from 'react';
import useAppTranslation from './useAppTranslation';

const useConsoleWarning = () => {
  const { t } = useAppTranslation();

  const warningShownRef = useRef(false);

  useEffect(() => {
    const consoleWarningTitleStyle = ` 
        background: #DD8C2C; 
        color: #FFFFFF; 
        font-size: 32px; 
        font-weight: 700;
    `;

    const consoleWarningDescStyle = `
        font-weight: 500; 
        font-size: 20px;
    `;

    if (!warningShownRef.current) {
      console.log(`%c${t('tr_consoleWarningTitle')}`, consoleWarningTitleStyle);
      console.log(`%c${t('tr_consoleWarningDesc')}`, consoleWarningDescStyle);

      warningShownRef.current = true;
    }
  }, [t]);
};

export default useConsoleWarning;
