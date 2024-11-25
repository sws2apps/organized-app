import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { formatLongDate } from '@services/dateformat';
import { useAppTranslation } from '@hooks/index';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { SessionItemType } from './index.types';
import { hour24FormatState, shortDateFormatState } from '@states/settings';

const useSessionItem = ({ onTerminate, session }: SessionItemType) => {
  const { t } = useAppTranslation();

  const shortDateFormat = useRecoilValue(shortDateFormatState);
  const hour24 = useRecoilValue(hour24FormatState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCurrent, setIsCurrent] = useState(false);
  const [location, setLocation] = useState('');
  const [browser, setBrowser] = useState('');
  const [lastSeen, setLastSeen] = useState('');

  const handleTerminate = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      await onTerminate?.(session);

      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);

      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    setIsCurrent(session.isSelf);

    setLocation(session.ip);

    if (session.country_name.length > 0) {
      setLocation((prev) => `${prev} - ${session.country_name}`);
    }

    setBrowser(session.device.browserName);

    if (session.device.os.length > 0) {
      setBrowser((prev) => `${prev} - ${session.device.os}`);
    }

    let tmpDate = '';

    if (session.last_seen) {
      const toFormat = new Date(session.last_seen);
      tmpDate = formatLongDate(toFormat, shortDateFormat, hour24);
    }

    setLastSeen(tmpDate.length > 0 ? t('tr_lastSeen', { date: tmpDate }) : '');
  }, [session, t, hour24, shortDateFormat]);

  return {
    isProcessing,
    handleTerminate,
    isCurrent,
    location,
    browser,
    lastSeen,
  };
};

export default useSessionItem;
