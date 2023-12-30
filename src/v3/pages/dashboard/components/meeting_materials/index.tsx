import { ListItem } from '@mui/material';
import { DashboardCard, DashboardMenu } from '@features/index';
import { IconImportFile, IconJwOrg, IconPodium } from '@icons';
import { useAppTranslation } from '@hooks/index';

const MeetingsMaterialsCard = () => {
  const { t } = useAppTranslation();

  return (
    <DashboardCard header={t('trans_meetingMaterials')}>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconPodium color="var(--black)" />} primaryText={t('trans_publicTalksList')} />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconJwOrg color="var(--black)" />} primaryText={t('trans_sourceImportJw')} />
      </ListItem>
      <ListItem disablePadding>
        <DashboardMenu icon={<IconImportFile color="var(--black)" />} primaryText={t('trans_sourceImportEPUB')} />
      </ListItem>
    </DashboardCard>
  );
};

export default MeetingsMaterialsCard;
