import { useState } from 'react';
import { Box } from '@mui/material';
import { IconSave } from '@icons/index';
import { useBreakpoints } from '@hooks/index';
import { InfoNote } from '@components/index';
import NavBarButton from '@components/nav_bar_button';
import NavBarButtonGroup from '@components/nav_bar_button_group';
import PageTitle from '@components/page_title';
import TerritoriesMap from '@features/territories/map';
import useTerritoriesMap from '@features/territories/map/useTerritoriesMap';
import MapQuickSettings from '@features/territories/map/quick_settings';

// the map is created once on mount, so it only mounts where it can be shown
const MapScreen = () => {
  const map = useTerritoriesMap();

  const { editor } = map;

  const [settingsOpen, setSettingsOpen] = useState(false);

  const title = !editor.editing
    ? 'Territory coverage map'
    : editor.scope === 'congregation'
      ? 'Edit congregation border'
      : `Edit borders – ${map.selected?.number ?? ''}`;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <PageTitle
        title={title}
        onBack={editor.editing ? map.cancelEditing : undefined}
        quickSettings={() => setSettingsOpen(true)}
        buttons={
          editor.editing && (
            <NavBarButtonGroup>
              <NavBarButton
                text="Save map"
                icon={<IconSave />}
                main
                disabled={!editor.draft.boundary?.length}
                onClick={map.save}
              />
            </NavBarButtonGroup>
          )
        }
      />

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

const TerritoryMapPage = () => {
  const { tablet688Up, laptopUp } = useBreakpoints();

  if (laptopUp) return <MapScreen />;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        paddingBottom: tablet688Up ? '0px' : '60px',
      }}
    >
      <PageTitle title="Territory coverage map" />

      <InfoNote message="The territory map is edited on a desktop screen. Open this page on a computer to draw or change the borders." />
    </Box>
  );
};

export default TerritoryMapPage;
