import { ListItem } from '@mui/material';
import { IconGroups, IconPublisherRecordCard } from '@icons/index';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import DashboardCard from '@features/dashboard/card';
import DashboardMenu from '@features/dashboard/menu';

const CongregationCard = () => {
  const { t } = useAppTranslation();

  const { isPublisher, isAdmin, isElder, isGroup } = useCurrentUser();

  return (
    <DashboardCard
      header={isGroup ? t('tr_languageGroupShort') : t('tr_congregation')}
    >
      {(isAdmin || isPublisher) && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconGroups color="var(--black)" />}
            primaryText={t('tr_fieldServiceGroups')}
            path="/field-service-groups"
          />
        </ListItem>
      )}

      {isElder && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconPublisherRecordCard color="var(--black)" />}
            primaryText={t('tr_publishersRecords')}
            path="/publisher-records"
          />
        </ListItem>
      )}
    </DashboardCard>
  );
};

export default CongregationCard;
