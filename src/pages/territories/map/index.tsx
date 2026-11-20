import TerritorySyncStatus from '@features/territories/components/sync_status';
import { useState } from 'react';
import { Box } from '@mui/material';
import { useAppTranslation, useUpNavigation } from '@hooks/index';
import PageTitle from '@components/page_title';
import TerritoriesMap from '@features/territories/map';
import useTerritoriesMap from '@features/territories/map/useTerritoriesMap';
import MapQuickSettings from '@features/territories/map/quick_settings';
import { PrintOverviewDialog } from '@features/territories/map/print_overview';
import NavBarButton from '@components/nav_bar_button';
import NavBarButtonGroup from '@components/nav_bar_button_group';
import { IconPrint } from '@icons/index';
import { useAtomValue } from 'jotai';
import {
  congregationBorderColorState,
  congregationBorderDashedState,
  congregationBoundaryState,
} from '@states/territories';

const TerritoryMapPage = () => {
  const { t } = useAppTranslation();

  const map = useTerritoriesMap();

  const { editor } = map;

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [printing, setPrinting] = useState(false);
  const congregation = useAtomValue(congregationBoundaryState);
  const borderColor = useAtomValue(congregationBorderColorState);
  const borderDashed = useAtomValue(congregationBorderDashedState);

  const { goUp } = useUpNavigation();

  let title = t('tr_territoryTerritoryCoverageMap');
  if (editor.editing) {
    title =
      editor.scope === 'congregation'
        ? t('tr_territoryCongregationArea')
        : t('tr_territoryMapWithNumber', {
            number: map.selected?.number ?? '',
          });
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <PageTitle
        title={title}
        secondaryTitle={
          editor.editing ? t('tr_territoryTerritoryCoverageMap') : undefined
        }
        onBack={editor.editing ? map.leaveTerritory : () => goUp('/')}
        quickSettings={editor.editing ? undefined : () => setSettingsOpen(true)}
        buttons={
          editor.editing ? undefined : (
            <NavBarButtonGroup>
              <NavBarButton
                main
                text={t('tr_territoryPrintMap')}
                icon={<IconPrint />}
                onClick={() => setPrinting(true)}
              />
            </NavBarButtonGroup>
          )
        }
      />
      <TerritorySyncStatus />

      {printing && (
        <PrintOverviewDialog
          open
          onClose={() => setPrinting(false)}
          territories={map.territories}
          areas={map.printAreas()}
          congregation={congregation}
          borderColor={borderColor}
          borderDashed={borderDashed}
        />
      )}

      {settingsOpen && (
        <MapQuickSettings
          map={map}
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      <TerritoriesMap map={map} />
    </Box>
  );
};

export default TerritoryMapPage;
