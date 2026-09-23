import { useState } from 'react';
import { Box } from '@mui/material';
import {
  IconAdd,
  IconRaiseHand,
  IconVisibility,
  IconAssignmetHistory,
  IconCancelCicle,
  IconImportExport,
} from '@icons/index';
import { useBreakpoints, useUpNavigation } from '@hooks/index';
import { useNavigate } from 'react-router';
import NavBarButton from '@components/nav_bar_button';
import NavBarButtonGroup from '@components/nav_bar_button_group';
import PageTitle from '@components/page_title';
import TerritoriesHub from '@features/territories/hub';
import TerritoryImport from '@features/territories/import';
import TerritoriesQuickSettings from '@features/territories/hub/quick_settings';
import useTerritoriesHub from '@features/territories/hub/useTerritoriesHub';

const Territories = () => {
  const navigate = useNavigate();

  const { tablet688Up, desktopUp } = useBreakpoints();
  const { goUp } = useUpNavigation();
  const hub = useTerritoriesHub();

  const { isTerritoryEditor } = hub;

  const isFilterSubpage = !desktopUp && hub.filtersOpen;

  const [importOpen, setImportOpen] = useState(false);

  const { title } = hub;

  const isMine = hub.tabId === 'mine' || hub.tabId === 'requested';

  const mineButtons = hub.canBrowse && (
    <NavBarButtonGroup>
      <NavBarButton
        text={hub.canRequest ? 'Request' : 'Available'}
        icon={hub.canRequest ? <IconRaiseHand /> : <IconVisibility />}
        textImportant
        onClick={() => navigate('/territories?tab=recommended')}
      />
    </NavBarButtonGroup>
  );

  // the tools live on the hub itself; the requests page stays a focused review
  const buttons = isMine ? (
    mineButtons
  ) : hub.isBrowsing ? (
    <NavBarButtonGroup>
      {isTerritoryEditor && (
        <NavBarButton
          text="Do not call"
          icon={<IconCancelCicle />}
          onClick={() =>
            navigate('/territories/do-not-calls', { state: { parent: title } })
          }
        />
      )}
      <NavBarButton
        text="History"
        icon={<IconAssignmetHistory />}
        onClick={() =>
          navigate('/territories/history', { state: { parent: title } })
        }
      />
      {isTerritoryEditor && (
        <NavBarButton
          text="Import"
          icon={<IconImportExport />}
          onClick={() => setImportOpen(true)}
        />
      )}
      {isTerritoryEditor && (
        <NavBarButton
          text="Add"
          icon={<IconAdd />}
          textImportant
          onClick={() =>
            navigate('/territories/new', { state: { parent: title } })
          }
        />
      )}
    </NavBarButtonGroup>
  ) : null;

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

      {importOpen && (
        <TerritoryImport open onClose={() => setImportOpen(false)} />
      )}

      <PageTitle
        title={isFilterSubpage ? 'Filters' : title}
        secondaryTitle={isFilterSubpage ? title : undefined}
        onBack={
          isFilterSubpage
            ? () => {
                hub.setFiltersOpen(false);
                window.scroll({ top: 0 });
              }
            : () => goUp('/')
        }
        buttons={!isFilterSubpage && buttons}
        quickSettings={() => hub.setQuickSettingsOpen(true)}
      />

      <TerritoriesHub hub={hub} />
    </Box>
  );
};

export default Territories;
