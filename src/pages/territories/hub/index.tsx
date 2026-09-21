import { Box } from '@mui/material';
import {
  IconAdd,
  IconAssign,
  IconAssignmetHistory,
  IconInformationBoard,
  IconListView,
  IconMapView,
  IconStatsYear,
} from '@icons/index';
import { useBreakpoints, useCurrentUser } from '@hooks/index';
import { useNavigate } from 'react-router';
import NavBarButton from '@components/nav_bar_button';
import NavBarButtonGroup from '@components/nav_bar_button_group';
import PageTitle from '@components/page_title';
import TerritoriesHub from '@features/territories/hub';
import TerritoriesQuickSettings from '@features/territories/hub/quick_settings';
import useTerritoriesHub from '@features/territories/hub/useTerritoriesHub';

const Territories = () => {
  const navigate = useNavigate();

  const { tablet688Up, laptopUp } = useBreakpoints();
  const { isElder, isServiceCommittee } = useCurrentUser();

  const hub = useTerritoriesHub();

  const isTerritoryEditor = isElder || isServiceCommittee;

  const buttons = (
    <NavBarButtonGroup>
      <NavBarButton
        text={hub.isBoard ? 'List' : 'Board'}
        icon={hub.isBoard ? <IconListView /> : <IconInformationBoard />}
        onClick={() => hub.setIsBoard(!hub.isBoard)}
      />
      {/* drawing borders needs a pointer and room, so it stays on desktop */}
      {laptopUp && (
        <NavBarButton
          text="Map"
          icon={<IconMapView />}
          onClick={() => navigate('/territories/map')}
        />
      )}
      <NavBarButton
        text="History"
        icon={<IconAssignmetHistory />}
        onClick={() => navigate('/territories/history')}
      />
      <NavBarButton
        text="Statistics"
        icon={<IconStatsYear />}
        onClick={() => navigate('/territories/statistics')}
      />
      {isTerritoryEditor ? (
        <NavBarButton
          text="Add"
          icon={<IconAdd />}
          textImportant
          onClick={() => navigate('/territories/new')}
        />
      ) : (
        <NavBarButton text="Get" icon={<IconAssign />} textImportant />
      )}
    </NavBarButtonGroup>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        paddingBottom: tablet688Up ? '0px' : '60px',
      }}
    >
      {hub.quickSettingsOpen && (
        <TerritoriesQuickSettings
          open={hub.quickSettingsOpen}
          onClose={() => hub.setQuickSettingsOpen(false)}
          showHouseholds={hub.showHouseholds}
          onShowHouseholdsChange={hub.setShowHouseholds}
          overdueMonths={hub.overdueMonths}
          onOverdueMonthsChange={hub.setOverdueMonths}
        />
      )}

      <PageTitle
        title="Territories"
        buttons={buttons}
        quickSettings={() => hub.setQuickSettingsOpen(true)}
      />

      <TerritoriesHub hub={hub} />
    </Box>
  );
};

export default Territories;
