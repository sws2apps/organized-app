import { useAppTranslation } from '@hooks/index';
import { useMemo } from 'react';

const useTabs = () => {
  const { t } = useAppTranslation();

  const categories = useMemo(
    () => [
      {
        title: t('tr_generalInformation'),
        key: 'general_information',
      },
      {
        title: t('tr_localAnnouncements'),
        key: 'local_announcements',
      },
      {
        title: t('tr_branchLetters'),
        key: 'branch_letters',
      },
      {
        title: t('tr_frequentlyUsedIformation'),
        key: 'frequently_used_information',
      },
    ],
    [t]
  );

  return {
    categories,
  };
};

export default useTabs;
