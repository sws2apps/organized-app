import { ListItem } from '@mui/material';
import { IconImportFile, IconJwOrg, IconPodium } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import useMeetingMaterials from './useMeetingMaterials';
import DashboardCard from '@features/dashboard/card';
import DashboardMenu from '@features/dashboard/menu';

const MeetingsMaterialsCard = () => {
  const { t } = useAppTranslation();

  const { handleOpenJWImport, isNavigatorOnline, handleOpenEPUBFile } =
    useMeetingMaterials();

  return (
    <DashboardCard header={t('tr_meetingMaterials')}>
      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconPodium color="var(--black)" />}
          primaryText={t('tr_publicTalksList')}
          path="/public-talks-list"
        />
      </ListItem>

      {isNavigatorOnline && (
        <ListItem disablePadding>
          <DashboardMenu
            icon={<IconJwOrg color="var(--black)" />}
            primaryText={t('tr_sourceImportJw')}
            onClick={handleOpenJWImport}
          />
        </ListItem>
      )}

      <ListItem disablePadding>
        <DashboardMenu
          icon={<IconImportFile color="var(--black)" />}
          primaryText={t('tr_sourceImportEPUB')}
          onClick={handleOpenEPUBFile}
        />
      </ListItem>
    </DashboardCard>
  );
};

export default MeetingsMaterialsCard;
