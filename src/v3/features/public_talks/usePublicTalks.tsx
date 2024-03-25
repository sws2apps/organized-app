import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { publicTalksFilteredState, publicTalksSearchKeyState } from '@states/publicTalks';
import { publicTalkSyncState } from '@states/settings';
import { formatDate } from '@services/dateformat';
import { useAppTranslation } from '@hooks/index';
import { setPublicTalksSearchKey } from '@services/recoil/publicTalks';

const usePublicTalks = () => {
  const { t } = useAppTranslation();

  const talksList = useRecoilValue(publicTalksFilteredState);
  const lastSync = useRecoilValue(publicTalkSyncState);
  const txtSearch = useRecoilValue(publicTalksSearchKeyState);

  const [lastSyncFormatted, setLastSyncFormatted] = useState('');
  const [isExpandAll, setIsExpandAll] = useState(false);
  const [labelSearch, setLabelSearch] = useState('tr_countPublicTalks');

  const handleToggleExpandAll = () => {
    setIsExpandAll((prev) => !prev);
  };

  const handleSearch = async (value: string) => {
    await setPublicTalksSearchKey(value);
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

  useEffect(() => {
    if (txtSearch.length === 0) {
      setLabelSearch('tr_countPublicTalks');
    }

    if (txtSearch.length > 0) {
      setLabelSearch('tr_searchResults');
    }
  }, [txtSearch]);

  return { talksList, lastSyncFormatted, isExpandAll, handleToggleExpandAll, handleSearch, labelSearch, txtSearch };
};

export default usePublicTalks;
