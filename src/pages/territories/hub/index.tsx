import TerritorySyncStatus from '@features/territories/components/sync_status';
import TerritoryImport from '@features/territories/import';
import CampaignContext from '@features/territories/components/campaign_context';
import { ReactNode, useState } from 'react';
import { Box } from '@mui/material';
import {
  IconAdd,
  IconImportFile,
  IconMapAdd,
  IconRaiseHand,
  IconMapOverview,
} from '@icons/index';
import {
  useAppTranslation,
  useBreakpoints,
  useUpNavigation,
} from '@hooks/index';
import { useNavigate } from 'react-router';
import NavBarButton from '@components/nav_bar_button';
import NavBarButtonGroup from '@components/nav_bar_button_group';
import PageTitle from '@components/page_title';
import TerritoriesHub from '@features/territories/hub';
import NewTerritoryDialog from '@features/territories/components/new_territory_dialog';
import TerritoriesQuickSettings from '@features/territories/hub/quick_settings';
import useTerritoriesHub from '@features/territories/hub/useTerritoriesHub';

const Territories = () => {
  const { t } = useAppTranslation();

  const navigate = useNavigate();

  const { tablet688Up, desktopUp } = useBreakpoints();
  const { goUp } = useUpNavigation();
  const hub = useTerritoriesHub();

  const { isTerritoryEditor } = hub;

  const isFilterSubpage = !desktopUp && hub.filtersOpen;

  const [importOpen, setImportOpen] = useState(false);
  const [newOnMap, setNewOnMap] = useState(false);

  const { title } = hub;

  const isMine = hub.tabId === 'mine' || hub.tabId === 'requested';

  const mineButtons = hub.canBrowse && (
    <NavBarButtonGroup>
      <NavBarButton
        text={
          hub.canRequest
            ? t('tr_territoryRequest')
            : t('tr_territoryShowAvailableTerritories')
        }
        icon={hub.canRequest ? <IconRaiseHand /> : <IconMapOverview />}
        textImportant
        onClick={() => navigate('/territories?tab=recommended')}
      />
    </NavBarButtonGroup>
  );

  const browseButtons = isTerritoryEditor && (
    <NavBarButtonGroup>
      <NavBarButton
        text={t('tr_import')}
        icon={<IconImportFile />}
        onClick={() => setImportOpen(true)}
      />
      <NavBarButton
        text={t('tr_territoryNewMap')}
        icon={<IconMapAdd />}
        onClick={() => setNewOnMap(true)}
      />
      <NavBarButton
        text={t('tr_add')}
        icon={<IconAdd />}
        textImportant
        onClick={() =>
          navigate('/territories/new', { state: { parent: title } })
        }
      />
    </NavBarButtonGroup>
  );

  let buttons: ReactNode = hub.isBrowsing ? browseButtons : null;
  if (isMine) buttons = mineButtons;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        paddingBottom: tablet688Up ? '0px' : '60px',
      }}
    >
      {isTerritoryEditor && importOpen && (
        <TerritoryImport open onClose={() => setImportOpen(false)} />
      )}
      {newOnMap && <NewTerritoryDialog onClose={() => setNewOnMap(false)} />}

      {hub.quickSettingsOpen && (
        <TerritoriesQuickSettings
          open={hub.quickSettingsOpen}
          onClose={() => hub.setQuickSettingsOpen(false)}
          overdueMonths={hub.overdueMonths}
          onOverdueMonthsChange={hub.setOverdueMonths}
        />
      )}

      <PageTitle
        title={isFilterSubpage ? t('tr_filters') : title}
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
      <TerritorySyncStatus />

      <CampaignContext />
      <TerritoriesHub hub={hub} />
    </Box>
  );
};

export default Territories;
