import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { congAccountConnectedState } from '@states/app';
import { publicTalksLocaleState } from '@states/publicTalks';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { useAppTranslation } from '@hooks/index';
import { apiFetchPublicTalks } from '@services/api/sources';
import { resetS34s } from '@services/dexie/publicTalks';
import { handleUpdateSetting } from '@services/dexie/settings';

const usePublicTalksList = () => {
  const { t } = useAppTranslation();

  const isConnected = useRecoilValue(congAccountConnectedState);
  const talksList = useRecoilValue(publicTalksLocaleState);

  const [isFetching, setIsFetching] = useState(false);

  const handleSyncTalks = async () => {
    try {
      setIsFetching(true);

      const { data, status } = await apiFetchPublicTalks();

      if (status !== 200) {
        setIsFetching(false);

        await displaySnackNotification({
          header: t('tr_errorTitle'),
          message: getMessageByCode(data.message),
          severity: 'error',
        });

        return;
      }

      await resetS34s(data);
      await handleUpdateSetting({ public_talk_sync: new Date().toISOString() });
      setIsFetching(false);
    } catch (error) {
      console.error(error);
      setIsFetching(false);

      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return { isConnected, talksList, isFetching, handleSyncTalks };
};

export default usePublicTalksList;
