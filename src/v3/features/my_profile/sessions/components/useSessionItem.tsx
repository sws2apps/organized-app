import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SessionResponseType } from '@definition/api';
import { formatDate } from '@services/dateformat';
import { useAppTranslation } from '@hooks/index';
import { useRecoilValue } from 'recoil';
import { visitorIDState } from '@states/app';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { accountTypeState } from '@states/settings';
import { apiRevokeVIPSession } from '@services/api/user';

const useSessionItem = (session: SessionResponseType) => {
  const { t } = useAppTranslation();

  const queryClient = useQueryClient();

  const visitorID = useRecoilValue(visitorIDState);
  const accountType = useRecoilValue(accountTypeState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCurrent, setIsCurrent] = useState(false);
  const [location, setLocation] = useState('');
  const [browser, setBrowser] = useState('');
  const [lastSeen, setLastSeen] = useState('');

  const handleTerminate = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      if (accountType === 'vip') {
        const result = await apiRevokeVIPSession(session.visitorid);

        if (result.status === 200) {
          await queryClient.refetchQueries({ queryKey: ['sessions'] });
          return;
        }

        await displaySnackNotification({
          header: t('tr_errorTitle'),
          message: getMessageByCode(result.data.message),
          severity: 'error',
        });
      }
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
    setIsCurrent(visitorID === session.visitorid);

    setLocation(session.ip);

    if (session.country_name.length > 0) {
      setLocation((prev) => `${prev} - ${session.country_name}`);
    }

    setBrowser(session.device.browserName);

    if (session.device.os.length > 0) {
      setBrowser((prev) => `${prev} - ${session.device.os}`);
    }

    const tmpDate = session.last_seen ? formatDate(new Date(session.last_seen), t('tr_longDateTimeFormat')) : '';
    setLastSeen(tmpDate.length > 0 ? t('tr_lastSeen', { date: tmpDate }) : '');
  }, [session, t, visitorID]);

  return { isProcessing, handleTerminate, isCurrent, location, browser, lastSeen };
};

export default useSessionItem;
