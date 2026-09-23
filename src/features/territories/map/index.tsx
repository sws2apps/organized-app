import { useLayoutEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { Button, CustomDivider } from '@components/index';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import { useNavigate } from 'react-router';
import {
  IconAdd,
  IconFullscreen,
  IconFullscreenExit,
  IconMapOverview,
  IconMyLocation,
  IconPanelOpen,
  IconRemove,
} from '@icons/index';
import EditToolbar, { IdleToolbar, MapHint, ViewToolbar } from './edit_toolbar';
import EditPanel from './edit_panel';
import LabelDialog from './label_dialog';
import MapFilters from './map_filters';
import MapIsland, { MapAction } from './map_island';
import TerritoryPicker from './territory_picker';
import { TerritoriesMapState } from './useTerritoriesMap';
import 'maplibre-gl/dist/maplibre-gl.css';

const PANEL_WIDTH = 320;

const BOTTOM_GAP = 16;

// maplibre's info icon, redrawn as a mask so it takes the accent color
const INFO_ICON =
  'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22%3E%3Cpath fill-rule=%22evenodd%22 d=%22M4 10a6 6 0 1 0 12 0 6 6 0 1 0-12 0m5-3a1 1 0 1 0 2 0 1 1 0 1 0-2 0m0 3a1 1 0 1 1 2 0v3a1 1 0 1 1-2 0%22/%3E%3C/svg%3E")';

// the attribution sits in the map's bottom-left corner like the other map
// buttons, and opens to the right so it never runs off the map
const ATTRIBUTION_STYLES = {
  '& .maplibregl-ctrl-bottom-left': { left: '12px', bottom: '12px' },
  '& .maplibregl-ctrl-bottom-left .maplibregl-ctrl-attrib.maplibregl-compact': {
    margin: 0,
    minHeight: '36px',
    padding: '0 0 0 36px',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    borderRadius: 'var(--radius-max)',
    border: '1px solid var(--accent-200)',
    boxShadow: 'var(--hover-shadow)',
    backgroundColor: 'var(--white)',
    color: 'var(--grey-400)',
    fontSize: '11px',
  },
  '& .maplibregl-ctrl-bottom-left .maplibregl-ctrl-attrib.maplibregl-compact-show':
    { padding: '0 14px 0 36px' },
  '& .maplibregl-ctrl-attrib a': { color: 'var(--grey-400)' },
  '& .maplibregl-ctrl-attrib-button': {
    top: 0,
    left: 0,
    right: 'auto',
    width: '34px',
    height: '34px',
    borderRadius: 'var(--radius-max)',
    backgroundImage: 'none',
    backgroundColor: 'transparent',
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      backgroundColor: 'var(--accent-main)',
      mask: `${INFO_ICON} center / 20px no-repeat`,
    },
    '&:hover': { backgroundColor: 'var(--accent-150)' },
  },
  '& .maplibregl-compact-show .maplibregl-ctrl-attrib-button': {
    backgroundColor: 'transparent',
  },
};

const LAYOUT_GAP = 32;

const TerritoriesMap = ({ map }: { map: TerritoriesMapState }) => {
  const navigate = useNavigate();

  const [panelOpen, setPanelOpen] = useState(true);

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

  // the editing steps are the only guide while drawing, so they cannot be hidden
  const showPanel = panelOpen || editor.editing;

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
          ...ATTRIBUTION_STYLES,
        }}
      >
        <Box ref={map.container} sx={{ height: '100%', width: '100%' }} />

        {showPanel && (
          <Box
            sx={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              // leaves the corner below free for the attribution button
              bottom: '56px',
              maxHeight: 'calc(100% - 68px)',
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
            {editor.editing && (
              <EditPanel
                editor={editor}
                territory={map.selected}
                onSave={map.save}
              />
            )}

            {!editor.editing && (
              <>
                <MapFilters
                  search={map.search}
                  onSearch={map.setSearch}
                  colorView={map.colorView}
                  onColorViewChange={map.setColorView}
                  heatmapYear={map.heatmapYear}
                  onHeatmapYearChange={map.setHeatmapYear}
                  onCollapse={() => setPanelOpen(false)}
                />

                <Box sx={{ flex: '1 0 200px', minHeight: '200px' }}>
                  <TerritoryPicker
                    territories={map.territories}
                    selectedId={map.selectedId}
                    onSelect={map.setSelectedId}
                    height="100%"
                  />
                </Box>
              </>
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

          {editor.editing && <EditToolbar editor={editor} />}

          {!editor.editing && !map.selected && (
            <IdleToolbar
              onCongregation={() => map.startEditing('congregation')}
            />
          )}

          {!editor.editing && map.selected && (
            <ViewToolbar
              selected={map.selected}
              onEdit={() => map.startEditing('territory')}
              onDetails={() =>
                map.selected &&
                navigate(`/territories/${map.selected.id}`, {
                  state: { parent: 'Territory coverage map' },
                })
              }
            />
          )}
        </Stack>

        {/* what to do next, until a territory is picked */}
        {!editor.editing && !map.selected && (
          <Box
            sx={{
              position: 'absolute',
              bottom: '12px',
              left: `calc(${inset} + (100% - ${inset}) / 2)`,
              transform: 'translateX(-50%)',
              zIndex: 2,
              maxWidth: 'calc(100% - 400px)',
            }}
          >
            <MapHint text="Pick a territory on the map or in the list" />
          </Box>
        )}

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
      </Box>

      <Dialog
        open={map.pendingLeave}
        onClose={map.keepEditing}
        title="Discard changes"
        description="Your unsaved changes will be lost."
      >
        <DialogActions>
          <Button variant="secondary" onClick={map.keepEditing}>
            Keep editing
          </Button>
          <Button variant="main" color="red" onClick={map.confirmLeave}>
            Discard
          </Button>
        </DialogActions>
      </Dialog>

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
