import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { publicTalksLocaleState } from '@states/publicTalks';
import { publicTalkSyncState } from '@states/settings';
import { formatDate } from '@services/dateformat';
import { useAppTranslation } from '@hooks/index';

const usePublicTalks = () => {
  const { t } = useAppTranslation();

  const talksList = useRecoilValue(publicTalksLocaleState);
  const lastSync = useRecoilValue(publicTalkSyncState);

  const [lastSyncFormatted, setLastSyncFormatted] = useState('');
  const [isExpandAll, setIsExpandAll] = useState(false);
  const [txtSearch, setTxtSearch] = useState('');

  const handleToggleExpandAll = () => {
    setIsExpandAll((prev) => !prev);
  };

  const handleSearch = (value: string) => {
    setTxtSearch(value);
  };

  useEffect(() => {
    if (lastSync.length === 0) setLastSyncFormatted('');

    if (lastSync.length > 0) {
      const dateSync = new Date(lastSync);

      const dateFormatted = formatDate(dateSync, t('tr_shortDateFormatAlt'));
      const timeFormatted = formatDate(dateSync, t('tr_shortTimeFormat'));

      const result = t('tr_publicTalkLastSync', { date: dateFormatted, time: timeFormatted });
      setLastSyncFormatted(result);
    }
  }, [lastSync, t]);

  return { talksList, lastSyncFormatted, isExpandAll, handleToggleExpandAll, txtSearch, handleSearch };
};

export default usePublicTalks;
