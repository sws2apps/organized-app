import { ReactNode } from 'react';
import { IconGroups, IconRaiseHand } from '@components/icons';
import { PreachingPartnerTab } from '@definition/preaching_partner';
import { useAppTranslation } from '@hooks/index';

const usePreachingPartnerTabs = () => {
  const { t } = useAppTranslation();

  const tabs: {
    id: PreachingPartnerTab;
    label: string;
    description: string;
    renderIcon: (color: string) => ReactNode;
  }[] = [
    {
      id: 'my-requests',
      label: t('tr_myPartnerRequests'),
      description: t('tr_myPartnerRequestsDesc'),
      renderIcon: (color) => <IconRaiseHand color={color} />,
    },
    {
      id: 'congregation-requests',
      label: t('tr_congregationPartnerRequests'),
      description: t('tr_congregationPartnerRequestsDesc'),
      renderIcon: (color) => <IconGroups color={color} />,
    },
  ];

  return tabs;
};

export default usePreachingPartnerTabs;
