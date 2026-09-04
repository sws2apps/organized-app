import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { SessionItemType } from './index.types';
import { hour24FormatState, shortDateFormatState } from '@states/settings';
import { formatLongDate } from '@utils/date';
import { copyToClipboard } from '@utils/common';

const useSessionItem = ({ onTerminate, session }: SessionItemType) => {
  const { t } = useAppTranslation();

  const shortDateFormat = useAtomValue(shortDateFormatState);
  const hour24 = useAtomValue(hour24FormatState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCurrent, setIsCurrent] = useState(false);
  const [country, setCountry] = useState('');
  const [ip, setIp] = useState('');
  const [browser, setBrowser] = useState('');
  const [lastSeen, setLastSeen] = useState('');

  const handleCopyAddress = async () => {
    try {
      await copyToClipboard(session.ip);

      displaySnackNotification({
        header: t('tr_textCopied'),
        message: '',
        severity: 'success',
      });
    } catch (error) {
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode((error as Error).message),
        severity: 'error',
      });
    }
  };

  const handleTerminate = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      await onTerminate?.(session);

      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    setIsCurrent(session.isSelf);

    setCountry(session.country_name);
    setIp(session.ip);

    setBrowser(session.device.browserName);

    if (session.device.os.length > 0) {
      setBrowser((prev) => `${prev} - ${session.device.os}`);
    }

    let tmpDate = '';

    if (session.last_seen) {
      const toFormat = new Date(session.last_seen);
      tmpDate = formatLongDate(toFormat, shortDateFormat, hour24);
    }

    setLastSeen(tmpDate);
  }, [session, t, hour24, shortDateFormat]);

  return {
    isProcessing,
    handleCopyAddress,
    handleTerminate,
    isCurrent,
    country,
    ip,
    browser,
    lastSeen,
  };
};

export default useSessionItem;
