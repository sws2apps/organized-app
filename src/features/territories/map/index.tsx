import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import { Button, CustomDivider, InfoNote, Typography } from '@components/index';
import { useBreakpoints } from '@hooks/index';
import {
  IconAddPin,
  IconClose,
  IconDashedLine,
  IconDelete,
  IconDrawLine,
  IconDrawShape,
  IconFullscreen,
  IconFullscreenExit,
  IconAdd,
  IconGlobe,
  IconPanelOpen,
  IconRemove,
  IconMapOverview,
  IconMoveAround,
  IconMyLocation,
  IconRedo,
  IconSave,
  IconSolidLine,
  IconTypeText,
  IconUndo,
} from '@icons/index';
import LabelDialog from './label_dialog';
import MapFilters from './map_filters';
import MapIsland, { MapAction } from './map_island';
import TerritoryPicker from './territory_picker';
import useTerritoriesMap, { MapTool } from './useTerritoriesMap';
import 'maplibre-gl/dist/maplibre-gl.css';

const TOOLS: { id: MapTool; title: string; Icon: typeof IconMoveAround }[] = [
  { id: 'move', title: 'Move and edit', Icon: IconMoveAround },
  { id: 'shape', title: 'Draw the borders', Icon: IconDrawShape },
  { id: 'line', title: 'Draw a line', Icon: IconDrawLine },
  { id: 'pin', title: 'Add a pin', Icon: IconAddPin },
  { id: 'text', title: 'Add text', Icon: IconTypeText },
];

const TerritoriesMap = () => {
  const { laptopUp } = useBreakpoints();

  const [panelOpen, setPanelOpen] = useState(true);

  const map = useTerritoriesMap();

  const showPanel = panelOpen && !map.fullscreen;

  const mapHeight = map.fullscreen
    ? '100%'
    : laptopUp
      ? 'max(460px, calc(100dvh - 130px))'
      : '420px';

  if (!laptopUp) {
    return (
      <InfoNote message="The territory map is edited on a desktop screen. Open this page on a computer to draw or change the borders." />
    );
  }

  const surface = (
    <Box
      sx={{
        display: 'grid',
        gap: '16px',
        height: map.fullscreen ? '100%' : 'auto',
        gridTemplateColumns:
          laptopUp && showPanel ? '344px minmax(0, 1fr)' : '1fr',
        ...(map.fullscreen && {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1300,
          gridTemplateRows: 'minmax(0, 1fr)',
          padding: '12px',
          backgroundColor: 'var(--white)',
        }),
      }}
    >
      {showPanel && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <MapFilters
            search={map.search}
            onSearch={map.setSearch}
            provider={map.provider}
            onProviderChange={map.setProvider}
            heatmap={map.heatmap}
            onHeatmapChange={map.setHeatmap}
            view={map.view}
            onViewChange={map.setView}
            showNumbers={map.showNumbers}
            onShowNumbersChange={map.setShowNumbers}
            showHouseholds={map.showHouseholds}
            onShowHouseholdsChange={map.setShowHouseholds}
            hidePoi={map.hidePoi}
            onHidePoiChange={map.setHidePoi}
            onCollapse={() => setPanelOpen(false)}
          />

          <TerritoryPicker
            territories={map.territories}
            selectedId={map.selectedId}
            onSelect={map.setSelectedId}
            height={laptopUp ? 'calc(100dvh - 620px)' : '200px'}
          />
        </Box>
      )}

      <Box
        ref={map.wrapper}
        sx={{
          position: 'relative',
          height: mapHeight,
          backgroundColor: 'var(--white)',
          '&:fullscreen': { height: '100%', borderRadius: 0 },
          borderRadius: 'var(--radius-l)',
          border: '1px solid var(--accent-200)',
          overflow: 'hidden',
          '& .maplibregl-map': { height: '100%', width: '100%' },
          '& .maplibregl-ctrl-attrib': {
            fontSize: '10px',
            borderRadius: 'var(--radius-s)',
          },
        }}
      >
        <Box ref={map.container} sx={{ height: '100%', width: '100%' }} />

        <MapIsland corner="top-left">
          {!showPanel && !map.fullscreen && (
            <MapAction
              title="Show the panel"
              onClick={() => setPanelOpen(true)}
            >
              <IconPanelOpen color="var(--accent-main)" />
            </MapAction>
          )}

          <MapAction
            title="Edit the congregation border"
            active={map.editing && map.scope === 'congregation'}
            onClick={() => map.startEditing('congregation')}
          >
            <IconGlobe color="var(--accent-main)" />
          </MapAction>
        </MapIsland>

        {/* the map's own controls sit in the bottom right corner */}
        <Box
          sx={{
            position: 'absolute',
            right: '12px',
            bottom: '48px',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '8px',
          }}
        >
          <Stack
            sx={{
              alignItems: 'center',
              borderRadius: 'var(--radius-l)',
              backgroundColor: 'var(--white)',
              border: '1px solid var(--accent-200)',
              boxShadow: '0px 2px 8px 0px rgba(28, 28, 28, 0.12)',
            }}
          >
            <MapAction title="Zoom in" onClick={map.zoomIn}>
              <IconAdd color="var(--accent-main)" />
            </MapAction>

            <CustomDivider color="var(--accent-200)" sx={{ width: '24px' }} />

            <MapAction title="Zoom out" onClick={map.zoomOut}>
              <IconRemove color="var(--accent-main)" />
            </MapAction>
          </Stack>

          <MapIsland corner="static">
            <MapAction title="My location" onClick={map.locate}>
              <IconMyLocation color="var(--accent-main)" />
            </MapAction>

            <MapAction title="Show all territories" onClick={map.fitAll}>
              <IconMapOverview color="var(--accent-main)" />
            </MapAction>

            <MapAction
              title={map.fullscreen ? 'Exit full screen' : 'Full screen'}
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

        {/* the drawing tools only exist while an area is being edited */}
        {map.editing && (
          <MapIsland corner="left" vertical>
            {TOOLS.filter(
              ({ id }) =>
                map.scope === 'territory' || id === 'move' || id === 'shape'
            ).map(({ id, title, Icon }) => (
              <MapAction
                key={id}
                title={title}
                active={map.activeTool === id}
                onClick={() => map.pickTool(id)}
              >
                <Icon
                  color={
                    map.activeTool === id
                      ? 'var(--accent-dark)'
                      : 'var(--accent-main)'
                  }
                />
              </MapAction>
            ))}

            {map.activeTool === 'line' && map.scope === 'territory' && (
              <>
                <CustomDivider
                  color="var(--accent-200)"
                  sx={{ width: '100%' }}
                />

                <MapAction
                  title="Solid line"
                  active={map.activeLineStyle === 'solid'}
                  onClick={() => map.pickLineStyle('solid')}
                >
                  <IconSolidLine color="var(--accent-main)" />
                </MapAction>

                <MapAction
                  title="Dashed line"
                  active={map.activeLineStyle === 'dashed'}
                  onClick={() => map.pickLineStyle('dashed')}
                >
                  <IconDashedLine color="var(--accent-main)" />
                </MapAction>
              </>
            )}
          </MapIsland>
        )}

        {map.selected && !map.editing && (
          <MapIsland corner="bottom-left">
            <Typography
              className="body-small-semibold"
              color="var(--black)"
              sx={{ padding: '0 8px' }}
              noWrap
            >
              {map.selected.number} · {map.selected.name}
            </Typography>

            <CustomDivider
              orientation="vertical"
              flexItem
              color="var(--accent-200)"
              sx={{ margin: '4px 0' }}
            />

            <Button
              variant="small"
              disableAutoStretch
              startIcon={<IconDrawShape color="var(--accent-main)" />}
              onClick={(() => map.startEditing('territory')) as never}
              sx={{ minHeight: '28px', padding: '2px 8px', minWidth: 'unset' }}
            >
              {map.selected.boundary?.length ? 'Edit map' : 'Draw borders'}
            </Button>
          </MapIsland>
        )}

        {map.editing && (
          <MapIsland corner="bottom-left">
            <Typography
              className="body-small-semibold"
              color="var(--black)"
              sx={{ padding: '0 8px' }}
              noWrap
            >
              {map.scope === 'congregation'
                ? 'Congregation border'
                : map.selected?.number}
            </Typography>

            <CustomDivider
              orientation="vertical"
              flexItem
              color="var(--accent-200)"
              sx={{ margin: '4px 0' }}
            />

            <MapAction title="Undo" onClick={map.undo}>
              <IconUndo color="var(--accent-main)" />
            </MapAction>

            <MapAction title="Redo" onClick={map.redo}>
              <IconRedo color="var(--accent-main)" />
            </MapAction>

            <MapAction title="Start over" onClick={map.clearDrawing}>
              <IconDelete color="var(--red-main)" />
            </MapAction>

            <CustomDivider
              orientation="vertical"
              flexItem
              color="var(--accent-200)"
              sx={{ margin: '4px 0' }}
            />

            <Button
              variant="small"
              disableAutoStretch
              startIcon={<IconClose color="var(--accent-main)" />}
              onClick={map.cancelEditing as never}
              sx={{ minHeight: '28px', padding: '2px 8px', minWidth: 'unset' }}
            >
              Cancel
            </Button>

            <Button
              variant="main"
              disableAutoStretch
              disabled={!map.draft.boundary?.length}
              startIcon={<IconSave color="var(--always-white)" />}
              onClick={map.saveBoundary as never}
              sx={{ minHeight: '28px', padding: '2px 12px', minWidth: 'unset' }}
            >
              Save
            </Button>
          </MapIsland>
        )}

        {!map.selected && (
          <Stack
            sx={{
              position: 'absolute',
              top: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 2,
              padding: '6px 12px',
              borderRadius: 'var(--radius-l)',
              backgroundColor: 'var(--white)',
              border: '1px solid var(--accent-200)',
            }}
          >
            <Typography className="body-small-regular" color="var(--grey-400)">
              Pick a territory to draw or edit its borders.
            </Typography>
          </Stack>
        )}
      </Box>

      {map.labelling !== undefined && (
        <LabelDialog onSave={map.saveLabel} onClose={() => map.saveLabel('')} />
      )}
    </Box>
  );

  return surface;
};

export default TerritoriesMap;
