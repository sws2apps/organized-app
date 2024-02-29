import { ListItem } from '@mui/material';
import { DashboardCard, DashboardMenu } from '@features/index';
import { IconImportFile, IconJwOrg, IconPodium } from '@icons/index';
import { useAppTranslation } from '@hooks/index';

const MeetingsMaterialsCard = () => {
  const { t } = useAppTranslation();

  return (
    <DashboardCard header={t('tr_meetingMaterials')}>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconPodium color="var(--black)" />} primaryText={t('tr_publicTalksList')} />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconJwOrg color="var(--black)" />} primaryText={t('tr_sourceImportJw')} />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconImportFile color="var(--black)" />} primaryText={t('tr_sourceImportEPUB')} />
      </ListItem>
    </DashboardCard>
  );
};

export default MeetingsMaterialsCard;
