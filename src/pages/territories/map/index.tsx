import { useState } from 'react';
import { Box } from '@mui/material';
import { useUpNavigation } from '@hooks/index';
import PageTitle from '@components/page_title';
import TerritoriesMap from '@features/territories/map';
import useTerritoriesMap from '@features/territories/map/useTerritoriesMap';
import MapQuickSettings from '@features/territories/map/quick_settings';

const TerritoryMapPage = () => {
  const map = useTerritoriesMap();

  const { editor } = map;

  const [settingsOpen, setSettingsOpen] = useState(false);
  const cancel = () => map.requestLeave(map.cancelEditing);

  const { goUp } = useUpNavigation();

  let title = 'Territory coverage map';
  if (editor.editing) {
    title =
      editor.scope === 'congregation'
        ? 'Congregation border'
        : `Territory ${map.selected?.number ?? ''} map`;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <PageTitle
        title={title}
        secondaryTitle={editor.editing ? 'Territory coverage map' : undefined}
        onBack={editor.editing ? cancel : () => goUp('/')}
        quickSettings={editor.editing ? undefined : () => setSettingsOpen(true)}
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

export default TerritoryMapPage;
