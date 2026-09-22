import { useLayoutEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { CustomDivider, Typography } from '@components/index';
import {
  IconAdd,
  IconClose,
  IconEdit,
  IconVisibility,
  IconFullscreen,
  IconFullscreenExit,
  IconMapOverview,
  IconMyLocation,
  IconPanelOpen,
  IconRemove,
} from '@icons/index';
import TabSwitcher from '@components/tab_switcher';
import EditToolbar, { IdleToolbar } from './edit_toolbar';
import LabelDialog from './label_dialog';
import MapFilters from './map_filters';
import MapIsland, { MapAction } from './map_island';
import TerritoryPicker from './territory_picker';
import { TerritoriesMapState } from './useTerritoriesMap';
import 'maplibre-gl/dist/maplibre-gl.css';

const PANEL_WIDTH = 320;

const HINT_KEY = 'territories.map.pointsHint';

const BOTTOM_GAP = 16;

const LAYOUT_GAP = 32;

const TerritoriesMap = ({ map }: { map: TerritoriesMapState }) => {
  const [panelOpen, setPanelOpen] = useState(true);

  const [hintDismissed, setHintDismissed] = useState(() => {
    try {
      return localStorage.getItem(HINT_KEY) === '1';
    } catch {
      return false;
    }
  });

  const dismissHint = () => {
    setHintDismissed(true);

    try {
      localStorage.setItem(HINT_KEY, '1');
    } catch {
      // private mode: the hint simply comes back next time
    }
  };

  const [top, setTop] = useState(130);

  useLayoutEffect(() => {
    const element = map.wrapper.current;
    if (!element) return;

    // offsets ignore the page's slide-in transform, which a bounding box would measure mid-animation
    const measure = () => {
      let offset = 0;
      let node: HTMLElement | null = element;

      while (node) {
        offset += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }

      setTop(offset);
    };

    measure();
    window.addEventListener('resize', measure);

    return () => window.removeEventListener('resize', measure);
  }, [map.wrapper]);

  const { editor } = map;

  const showPanel = panelOpen;

  const inset = showPanel ? `${PANEL_WIDTH + 24}px` : '12px';

  return (
    <Box
      sx={{
        height: map.fullscreen ? '100%' : 'auto',
        // takes back the 32px the page layout keeps under every page
        marginBottom: map.fullscreen ? 0 : `${BOTTOM_GAP - LAYOUT_GAP}px`,
        ...(map.fullscreen && {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1300,
          padding: '12px',
          backgroundColor: 'var(--white)',
        }),
      }}
    >
      <Box
        ref={map.wrapper}
        sx={{
          position: 'relative',
          height: map.fullscreen
            ? '100%'
            : `max(560px, calc(100dvh - ${top + BOTTOM_GAP}px))`,
          backgroundColor: 'var(--white)',
          borderRadius: 'var(--radius-l)',
          border: '1px solid var(--accent-200)',
          overflow: 'hidden',
          // a WebGL canvas ignores overflow clipping in Safari; clip-path doesn't
          clipPath: 'inset(0 round var(--radius-l))',
          '& .maplibregl-map': { height: '100%', width: '100%' },
          '& .maplibregl-ctrl-bottom-left': {
            left: inset,
            transition: 'left 0.2s ease',
          },
          '& .maplibregl-ctrl-attrib': {
            fontSize: '10px',
            borderRadius: 'var(--radius-s)',
          },
        }}
      >
        <Box ref={map.container} sx={{ height: '100%', width: '100%' }} />

        {showPanel && (
          <Box
            sx={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              bottom: editor.scope === 'congregation' ? 'auto' : '12px',
              maxHeight: 'calc(100% - 24px)',
              width: `${PANEL_WIDTH}px`,
              zIndex: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              overflowY: 'auto',
              pointerEvents: 'none',
              '& > *': {
                pointerEvents: 'auto',
                boxShadow: 'var(--hover-shadow)',
              },
            }}
          >
            <MapFilters
              search={map.search}
              onSearch={map.setSearch}
              colorView={map.colorView}
              onColorViewChange={map.setColorView}
              heatmapYear={map.heatmapYear}
              onHeatmapYearChange={map.setHeatmapYear}
              onCollapse={() => setPanelOpen(false)}
            />

            {editor.scope !== 'congregation' && (
              <Box sx={{ flex: '1 0 200px', minHeight: '200px' }}>
                <TerritoryPicker
                  territories={map.territories}
                  selectedId={map.selectedId}
                  onSelect={map.setSelectedId}
                  height="100%"
                  editing={map.editMode}
                />
              </Box>
            )}
          </Box>
        )}

        <Stack
          direction="row"
          sx={{
            position: 'absolute',
            top: '12px',
            left: inset,
            right: '12px',
            zIndex: 2,
            transition: 'left 0.2s ease',
            gap: '8px',
            alignItems: 'flex-start',
            pointerEvents: 'none',
            '& > *': { pointerEvents: 'auto' },
          }}
        >
          {!showPanel && (
            <MapIsland corner="static">
              <MapAction
                title="Show the panel"
                onClick={() => setPanelOpen(true)}
              >
                <IconPanelOpen color="var(--accent-main)" />
              </MapAction>
            </MapIsland>
          )}

          <TabSwitcher
            ariaLabel="Map mode"
            value={map.editMode ? 'edit' : 'view'}
            onChange={map.setMode}
            options={[
              { value: 'view', label: 'View', icon: <IconVisibility /> },
              { value: 'edit', label: 'Edit', icon: <IconEdit /> },
            ]}
            sx={{
              flexShrink: 0,
              width: '220px',
              backgroundColor: 'var(--white)',
              boxShadow: 'var(--hover-shadow)',
              '& [role="tab"]': { minHeight: '36px' },
            }}
          />

          {editor.editing && (
            <EditToolbar
              editor={editor}
              onCongregation={() =>
                map.switchScope(
                  editor.scope === 'congregation' ? 'territory' : 'congregation'
                )
              }
            />
          )}

          {map.editMode && !editor.editing && (
            <IdleToolbar
              onCongregation={() => map.switchScope('congregation')}
            />
          )}
        </Stack>

        <Box
          sx={{
            position: 'absolute',
            right: '12px',
            bottom: '12px',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '8px',
          }}
        >
          <MapIsland corner="static" vertical>
            <MapAction title="Zoom in" placement="left" onClick={map.zoomIn}>
              <IconAdd color="var(--accent-main)" />
            </MapAction>

            <CustomDivider color="var(--accent-200)" sx={{ width: '24px' }} />

            <MapAction title="Zoom out" placement="left" onClick={map.zoomOut}>
              <IconRemove color="var(--accent-main)" />
            </MapAction>
          </MapIsland>

          <MapIsland corner="static">
            <MapAction title="My location" placement="top" onClick={map.locate}>
              <IconMyLocation color="var(--accent-main)" />
            </MapAction>

            <MapAction
              title="Show all territories"
              placement="top"
              onClick={map.fitAll}
            >
              <IconMapOverview color="var(--accent-main)" />
            </MapAction>

            <MapAction
              title={map.fullscreen ? 'Exit full screen' : 'Full screen'}
              placement="top"
              onClick={map.toggleFullscreen}
            >
              {map.fullscreen ? (
                <IconFullscreenExit color="var(--accent-main)" />
              ) : (
                <IconFullscreen color="var(--accent-main)" />
              )}
            </MapAction>
          </MapIsland>
        </Box>

        {editor.editing && editor.tool === 'points' && !hintDismissed && (
          <Box
            sx={{
              position: 'absolute',
              bottom: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 2,
              maxWidth: 'min(520px, calc(100% - 200px))',
            }}
          >
            <MapIsland corner="static">
              <Typography
                className="label-small-regular"
                color="var(--grey-400)"
                sx={{ padding: '0 8px' }}
              >
                Drag a point to move it, drag a midpoint to add one, or pick a
                point and press Delete to remove it.
              </Typography>

              <MapAction title="Got it" onClick={dismissHint}>
                <IconClose color="var(--accent-main)" />
              </MapAction>
            </MapIsland>
          </Box>
        )}
      </Box>

      {editor.labelling !== undefined && (
        <LabelDialog
          onSave={editor.saveLabel}
          onClose={() => editor.saveLabel('')}
        />
      )}
    </Box>
  );
};

export default TerritoriesMap;
