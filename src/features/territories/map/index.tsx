import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import { Box, Stack } from '@mui/material';
import { Button, CustomDivider, Typography } from '@components/index';
import TabSwitcher from '@components/tab_switcher';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import { useNavigate } from 'react-router';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { systemBarInset } from '@utils/common';
import {
  IconAdd,
  IconEdit,
  IconFullscreen,
  IconFullscreenExit,
  IconInfo,
  IconCellMerge,
  IconMapOverview,
  IconMyLocation,
  IconPanelClose,
  IconPanelOpen,
  IconRemove,
  IconVisibility,
} from '@icons/index';
import { ViewToolbar } from '@features/territories/map/edit_toolbar';
import NewTerritoryDialog from '@features/territories/components/new_territory_dialog';
import {
  ContextSpot,
  EditHeader,
  EditRail,
  IdleRail,
  MapContextMenu,
  StyleBar,
  ToolHint,
} from '@features/territories/map/edit_tools';
import LabelDialog from '@features/territories/map/label_dialog';
import TerritoryFieldsDialog from '@features/territories/map/split_merge_dialog';
import MarkerChip from '@features/territories/map/marker_chip';
import MapFilters from '@features/territories/map/map_filters';
import MapIsland, {
  MapAction,
  NorthAction,
} from '@features/territories/map/map_island';
import { LegendIsland } from '@features/territories/map/map_legend';
import { MAP_COLORS } from '@features/territories/map/constants';
import TerritoryPicker from '@features/territories/map/territory_picker';
import { TerritoriesMapState } from '@features/territories/map/useTerritoriesMap';
import 'maplibre-gl/dist/maplibre-gl.css';

const PANEL_WIDTH = 320;

// Organized's subpage slide (the settings redesign)
const SLIDE = '340ms cubic-bezier(0.32, 0.72, 0, 1)';

const BOTTOM_GAP = 16;

// maplibre's info icon, redrawn as a mask so it takes the accent color
const INFO_ICON =
  'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22%3E%3Cpath fill-rule=%22evenodd%22 d=%22M4 10a6 6 0 1 0 12 0 6 6 0 1 0-12 0m5-3a1 1 0 1 0 2 0 1 1 0 1 0-2 0m0 3a1 1 0 1 1 2 0v3a1 1 0 1 1-2 0%22/%3E%3C/svg%3E")';

// the attribution sits in the map's bottom-left corner like the other map
// buttons, and opens to the right so it never runs off the map
// OSM's attribution guidelines: legible, in a corner, shown when the map loads
// (MapLibre's compact control opens at first and folds into the button)
const ATTRIBUTION_STYLES = {
  '& .maplibregl-ctrl-bottom-left': { left: '12px', bottom: '12px' },
  '& .maplibregl-ctrl-bottom-left .maplibregl-ctrl-attrib.maplibregl-compact': {
    margin: 0,
    // 24 × 24 folded, border included
    height: '24px',
    minHeight: '24px',
    padding: '0 0 0 22px',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    borderRadius: 'var(--radius-max)',
    border: '1px solid var(--accent-200)',
    backgroundColor: 'rgba(var(--white-base), 0.9)',
    color: 'var(--grey-400)',
    fontSize: '10px',
    lineHeight: '14px',
  },
  '& .maplibregl-ctrl-bottom-left .maplibregl-ctrl-attrib.maplibregl-compact-show':
    { padding: '0 10px 0 22px' },
  '& .maplibregl-ctrl-attrib a': { color: 'var(--grey-400)' },
  '& .maplibregl-ctrl-attrib-button': {
    top: 0,
    left: 0,
    right: 'auto',
    width: '22px',
    height: '22px',
    borderRadius: 'var(--radius-max)',
    backgroundImage: 'none',
    backgroundColor: 'transparent',
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      backgroundColor: 'var(--accent-main)',
      mask: `${INFO_ICON} center / 14px no-repeat`,
    },
    '&:hover': { backgroundColor: 'var(--accent-150)' },
  },
  '& .maplibregl-compact-show .maplibregl-ctrl-attrib-button': {
    backgroundColor: 'transparent',
  },
};

const LAYOUT_GAP = 32;

const panelSlide = (shown: boolean) => ({
  transform: shown ? 'none' : 'translateX(calc(-100% - 24px))',
  opacity: shown ? 1 : 0,
  visibility: shown ? 'visible' : 'hidden',
  transition: `transform ${SLIDE}, opacity ${SLIDE}, visibility 0s ${shown ? '0s' : '340ms'}`,
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
});

// the panel's button leaves as the panel comes, and returns once it has gone
const buttonReveal = (hidden: boolean) => ({
  opacity: hidden ? 0 : 1,
  transform: hidden ? 'scale(0.9)' : 'none',
  visibility: hidden ? 'hidden' : 'visible',
  transition: hidden
    ? 'opacity 120ms, transform 120ms, visibility 0s 120ms'
    : 'opacity 200ms 180ms, transform 200ms 180ms',
  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
});

// the scroll area reaches 12px past the cards so their shadows aren't clipped
const PANEL_STACK = {
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  overflowY: 'auto',
  pointerEvents: 'none',
  '& > *': { pointerEvents: 'auto', boxShadow: 'var(--hover-shadow)' },
} as const;

const SWITCH_SHELL = {
  borderRadius: 'var(--radius-l)',
  boxShadow: 'var(--hover-shadow)',
};

// a second row under the buttons along the top
const SECOND_ROW = {
  position: 'absolute',
  top: '66px',
  right: '12px',
  zIndex: 2,
  display: 'flex',
  justifyContent: 'center',
  pointerEvents: 'none',
  '& > *': { pointerEvents: 'auto' },
} as const;

const LONG_PRESS = 550;

const PanelToggle = ({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: VoidFunction;
}) => {
  const { t } = useAppTranslation();
  return (
    <MapIsland corner="static">
      <MapAction
        title={
          open ? t('tr_territoryHideThePanel') : t('tr_territoryShowThePanel')
        }
        // the panel slides under the pointer, so the tip waits
        delaySpeed="slow"
        onClick={onToggle}
      >
        {open ? (
          <IconPanelClose color="var(--accent-main)" />
        ) : (
          <IconPanelOpen color="var(--accent-main)" />
        )}
      </MapAction>
    </MapIsland>
  );
};

const FullscreenToggle = ({
  fullscreen,
  onToggle,
}: {
  fullscreen: boolean;
  onToggle: VoidFunction;
}) => {
  const { t } = useAppTranslation();
  return (
    <MapAction
      title={
        fullscreen
          ? t('tr_territoryExitFullScreen')
          : t('tr_territoryFullScreen')
      }
      placement="top"
      onClick={onToggle}
    >
      {fullscreen ? (
        <IconFullscreenExit color="var(--accent-main)" />
      ) : (
        <IconFullscreen color="var(--accent-main)" />
      )}
    </MapAction>
  );
};

const mapViewportStyles = (fullscreen: boolean) =>
  ({
    height: fullscreen ? '100%' : 'auto',
    // takes back the 32px the page layout keeps under every page
    marginBottom: fullscreen ? 0 : `${BOTTOM_GAP - LAYOUT_GAP}px`,
    ...(fullscreen && {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1300,
      paddingTop: `calc(12px + ${systemBarInset('top')})`,
      paddingRight: `calc(12px + ${systemBarInset('right')})`,
      paddingBottom: `calc(12px + ${systemBarInset('bottom')})`,
      paddingLeft: `calc(12px + ${systemBarInset('left')})`,
      backgroundColor: 'var(--white)',
    }),
  }) as const;

const TerritoriesMap = ({ map }: { map: TerritoriesMapState }) => {
  const { t } = useAppTranslation();

  const navigate = useNavigate();

  const { laptopUp, tabletUp } = useBreakpoints();

  // on a phone the panel would cover the map, so it starts closed there
  const [panelOpen, setPanelOpen] = useState(laptopUp);

  const [top, setTop] = useState(130);

  const [spot, setSpot] = useState<ContextSpot>();

  // where the bar along the top ends, so the style bar stays under it
  const topRow = useRef<HTMLDivElement>(null);
  const [topBottom, setTopBottom] = useState(56);
  useEffect(() => {
    const row = topRow.current;
    if (!row) return;
    const measure = () => {
      const tallest = Math.max(
        0,
        ...Array.from(
          row.children,
          (child) => (child as HTMLElement).offsetHeight
        )
      );
      setTopBottom(row.offsetTop + tallest);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    Array.from(row.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [map.editor.editing, map.editor.tool]);

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

  const compact = !laptopUp;

  // with the text tool, a note follows the pointer, so it's clear a click
  // places it, and where
  const [ghost, setGhost] = useState<{ x: number; y: number }>();
  const [newTerritory, setNewTerritory] = useState(false);
  // only a mouse moves without clicking, so a touch screen never shows it
  const ghostOn = editor.editing && editor.tool === 'text';
  useEffect(() => {
    const instance = map.instance;
    if (!instance || !ghostOn) return setGhost(undefined);
    const move = (event: maplibregl.MapMouseEvent) =>
      setGhost({ x: event.point.x, y: event.point.y });
    const leave = () => setGhost(undefined);
    instance.on('mousemove', move);
    instance.on('mouseout', leave);
    return () => {
      instance.off('mousemove', move);
      instance.off('mouseout', leave);
      setGhost(undefined);
    };
  }, [map.instance, ghostOn]);

  // the panel belongs to viewing: in edit mode it steps aside for the tools,
  // so the switch visibly changes what is on the map
  const showPanel = panelOpen && map.mode === 'view' && !editor.editing;

  // a right click, or a long press on a phone, opens what fits right there
  useEffect(() => {
    const instance = map.instance;
    if (!instance || !editor.editing) return;

    const open = (point: maplibregl.Point, at: maplibregl.LngLat) => {
      const rect = instance.getContainer().getBoundingClientRect();
      const pixel = { x: point.x, y: point.y };
      const lngLat: [number, number] = [at.lng, at.lat];
      setSpot({
        x: rect.left + point.x,
        y: rect.top + point.y,
        at: lngLat,
        item: editor.itemAt(pixel, lngLat),
        corner:
          editor.tool === 'points' && editor.cornerAt(pixel) !== undefined,
      });
    };

    const onContext = (event: maplibregl.MapMouseEvent) => {
      event.preventDefault();
      open(event.point, event.lngLat);
    };

    let timer: ReturnType<typeof setTimeout> | undefined;
    let start: maplibregl.Point | undefined;
    const cancel = () => {
      clearTimeout(timer);
      timer = undefined;
    };
    const onTouchStart = (event: maplibregl.MapTouchEvent) => {
      cancel();
      if (event.points.length !== 1) return;
      start = event.point;
      const at = event.lngLat;
      timer = setTimeout(() => open(event.point, at), LONG_PRESS);
    };
    const onTouchMove = (event: maplibregl.MapTouchEvent) => {
      if (start && event.point.dist(start) > 10) cancel();
    };

    instance.on('contextmenu', onContext);
    instance.on('touchstart', onTouchStart);
    instance.on('touchmove', onTouchMove);
    instance.on('touchend', cancel);
    instance.on('touchcancel', cancel);
    return () => {
      cancel();
      instance.off('contextmenu', onContext);
      instance.off('touchstart', onTouchStart);
      instance.off('touchmove', onTouchMove);
      instance.off('touchend', cancel);
      instance.off('touchcancel', cancel);
    };
  }, [map.instance, editor]);

  const editTitle =
    editor.scope === 'congregation'
      ? t('tr_territoryCongregationArea')
      : t('tr_territoryTerritory', {
          number: (map.edited ?? map.selected)?.number ?? '',
        });

  // on a wide screen the switch keeps the top left and the panel slides out
  // from under it, so nothing jumps when it opens or closes
  const inset = compact ? '12px' : `${PANEL_WIDTH + 24}px`;

  const modeSwitch = (
    <TabSwitcher
      ariaLabel={t('tr_territoryMapMode')}
      surface="light"
      // a letter or two says nothing; the icons say more
      collapseBelow={180}
      value={map.mode}
      onChange={(mode: 'view' | 'edit') => {
        map.setMode(mode);
        if (mode === 'edit' && map.selected && !editor.editing) {
          map.startEditing('territory');
        }
      }}
      options={[
        {
          value: 'view',
          label: t('tr_territoryView'),
          icon: <IconVisibility />,
        },
        { value: 'edit', label: t('tr_edit'), icon: <IconEdit /> },
      ]}
      // as tall as the map's button islands
      sx={{
        width: compact ? '264px' : '100%',
        maxWidth: '100%',
        '& button': { minHeight: '36px' },
      }}
    />
  );

  // while checking, the hint reports what the check found
  const counts = map.coverageCounts;
  let coverageHint: string | undefined;
  if (map.coverageCheck && counts) {
    coverageHint =
      counts.gaps + counts.overlaps === 0
        ? t('tr_territoryNoGapsOrOverlaps')
        : t('tr_territoryGapsOverlaps', counts);
  }

  // shaped like the switch, so the two read as one control and its state
  const selectHint = map.mode === 'edit' && !editor.editing && (
    <Box
      role="status"
      sx={{
        ...SWITCH_SHELL,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        minWidth: 0,
        '& svg': { flexShrink: 0 },
        height: '46px',
        padding: '0 14px 0 12px',
        backgroundColor: 'var(--accent-100)',
        border: '1px solid var(--accent-200)',
      }}
    >
      <IconInfo color="var(--grey-400)" width={20} height={20} />
      <Typography className="body-small-regular" color="var(--grey-400)" noWrap>
        {coverageHint ?? t('tr_territorySelectATerritory')}
      </Typography>
    </Box>
  );

  const panelButton = (
    <PanelToggle open={showPanel} onToggle={() => setPanelOpen(!showPanel)} />
  );

  const viewToolbar = map.selected && (
    <ViewToolbar
      compact={compact}
      fullWidth={compact}
      selected={map.selected}
      onDetails={() =>
        map.selected &&
        navigate(`/territories/${map.selected.id}`, {
          state: { parent: t('tr_territoryTerritoryCoverageMap') },
        })
      }
    />
  );

  const panelContents = (
    <>
      {!editor.editing && (
        <>
          <MapFilters
            colorView={map.colorView}
            onColorViewChange={map.setColorView}
            heatmapPeriod={map.heatmapPeriod}
            onHeatmapPeriodChange={map.setHeatmapPeriod}
            legend={map.legend}
            onCollapse={() => setPanelOpen(false)}
          />

          <Box sx={{ flex: '1 0 200px', minHeight: '200px' }}>
            <TerritoryPicker
              territories={map.territories}
              selectedId={map.selectedId}
              onSelect={(id) => {
                map.pickTerritory(id);
                if (!laptopUp) setPanelOpen(false);
              }}
              height="100%"
            />
          </Box>
        </>
      )}
    </>
  );

  return (
    <Box sx={mapViewportStyles(map.fullscreen)}>
      <Box
        ref={map.wrapper}
        sx={{
          position: 'relative',
          height: map.fullscreen
            ? '100%'
            : `max(320px, calc(100dvh - ${top + BOTTOM_GAP}px - ${systemBarInset('top')} - ${systemBarInset('bottom')}))`,
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
        {map.mapError && (
          <Stack
            role="alert"
            spacing="16px"
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 10,
              backgroundColor: 'var(--white)',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--dialog-padding)',
            }}
          >
            <Typography>
              {t('tr_territoryTheMapPausedBecauseTheDeviceRanOutOf')}
            </Typography>
            <Button variant="main" onClick={map.reloadMap}>
              {t('tr_territoryReloadMap')}
            </Button>
          </Stack>
        )}

        {compact && (
          <Box
            sx={{
              position: 'absolute',
              // on a phone it opens under the top row, which stays usable; its
              // cards start 8px under it, where the closed panel's button sits
              top: '54px',
              left: 0,
              bottom: 0,
              width: '100%',
              zIndex: 3,
              ...PANEL_STACK,
              // slides in and out as on a wide screen
              ...panelSlide(showPanel),
            }}
          >
            {panelContents}
          </Box>
        )}

        {!compact && (
          <Stack
            spacing="8px"
            sx={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              // leaves the corner below free for the attribution button
              bottom: '44px',
              width: `${PANEL_WIDTH}px`,
              zIndex: 3,
              pointerEvents: 'none',
              '& > *': { pointerEvents: 'auto' },
            }}
          >
            <Box sx={SWITCH_SHELL}>{modeSwitch}</Box>

            {/* only what shows takes the pointer; the rest pans the map */}
            <Box
              sx={{
                position: 'relative',
                flex: 1,
                minHeight: 0,
                '&&': { pointerEvents: 'none' },
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: '-12px',
                  ...PANEL_STACK,
                  ...panelSlide(showPanel),
                }}
              >
                {panelContents}
              </Box>

              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  pointerEvents: 'auto',
                  ...buttonReveal(showPanel || map.mode === 'edit'),
                }}
              >
                {panelButton}
              </Box>
            </Box>
          </Stack>
        )}

        <Stack
          ref={topRow}
          direction="row"
          sx={{
            position: 'absolute',
            top: '12px',
            left: inset,
            right: '12px',
            zIndex: 2,
            gap: compact ? '6px' : '8px',
            alignItems: 'flex-start',
            pointerEvents: 'none',
            '& > *': { pointerEvents: 'auto' },
          }}
        >
          {/* on a phone the switch keeps the top left, as on a wide screen */}
          {compact && !editor.editing && (
            // shrinks with the map, the labels clipped with an ellipsis
            <Box sx={{ minWidth: 0, ...SWITCH_SHELL }}>{modeSwitch}</Box>
          )}

          {!compact && map.mode === 'view' && map.selected && viewToolbar}

          {tabletUp && selectHint && (
            <Box sx={{ marginLeft: 'auto', minWidth: 0 }}>{selectHint}</Box>
          )}

          {editor.editing && (
            <Box sx={{ minWidth: 0 }}>
              <EditHeader
                title={editTitle}
                onUp={editor.scope === 'territory' ? map.editArea : undefined}
                onCancel={map.stepBack}
              />
            </Box>
          )}
        </Stack>

        {map.mode === 'edit' && (
          <Box
            // down the left on every screen, phones included
            sx={{ position: 'absolute', left: '12px', top: '64px', zIndex: 3 }}
          >
            {editor.editing ? (
              <EditRail editor={editor} vertical />
            ) : (
              <IdleRail
                onNewTerritory={() => setNewTerritory(true)}
                onCongregation={() => map.startEditing('congregation')}
                checking={map.coverageCheck}
                onCheck={map.toggleCoverageCheck}
              />
            )}
          </Box>
        )}

        {newTerritory && (
          <NewTerritoryDialog onClose={() => setNewTerritory(false)} />
        )}

        {ghostOn && ghost && (
          <Box
            sx={{
              position: 'absolute',
              left: `${ghost.x}px`,
              top: `${ghost.y}px`,
              transform: 'translate(-50%, -50%)',
              opacity: 0.75,
              pointerEvents: 'none',
              zIndex: 2,
            }}
          >
            <MarkerChip
              item={{
                id: 'ghost',
                kind: 'text',
                text: t('tr_territoryText'),
                position: [0, 0],
                color: 'red',
              }}
            />
          </Box>
        )}

        {editor.editing && (
          <StyleBar
            editor={editor}
            map={map.instance}
            minTop={topBottom}
            canSave={!!editor.draft.boundary?.length}
            onSave={map.save}
          />
        )}

        {editor.editing && editor.tool === 'split' && (
          <ToolHint
            minTop={topBottom}
            text={t('tr_territoryDrawALineAcrossTheTerritory')}
            action={
              <Button
                variant="small"
                disableAutoStretch
                disabled={!editor.canSplit}
                onClick={editor.completeSplit}
              >
                {t('tr_territorySplit')}
              </Button>
            }
          />
        )}

        {editor.editing && editor.tool === 'merge' && (
          <ToolHint
            minTop={topBottom}
            text={t('tr_territoryPickTheNeighbouringTerritories')}
            action={
              <Button
                variant="small"
                disableAutoStretch
                disabled={map.mergeCount === 0}
                startIcon={<IconCellMerge />}
                onClick={map.mergePicked}
                sx={{ minHeight: '32px' }}
              >
                {t('tr_territoryCombineCount', { n: map.mergeCount })}
              </Button>
            }
          />
        )}

        {/* under the switch, as on a wide screen: the panel button while the
            panel is closed (open, it has its own), then the picked territory */}
        {compact && map.mode === 'view' && (
          <Box
            sx={{
              ...SECOND_ROW,
              left: '12px',
              gap: '8px',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              transformOrigin: 'top left',
              ...buttonReveal(showPanel),
            }}
          >
            {panelButton}
            {map.selected && (
              <Box sx={{ flex: 1, minWidth: 0 }}>{viewToolbar}</Box>
            )}
          </Box>
        )}

        {/* on a phone the top row is full, so it waits under the switch */}
        {!tabletUp && selectHint && (
          <Box
            sx={{ ...SECOND_ROW, left: '12px', justifyContent: 'flex-start' }}
          >
            {selectHint}
          </Box>
        )}

        {map.coverageCheck && (
          <Box
            sx={{
              position: 'absolute',
              left: '12px',
              bottom: '44px',
              zIndex: 2,
            }}
          >
            <LegendIsland
              defaultOpen={!compact}
              items={[
                {
                  key: 'gap',
                  label: 'tr_territoryGaps',
                  color: MAP_COLORS.red,
                },
                {
                  key: 'overlap',
                  label: 'tr_territoryOverlaps',
                  color: MAP_COLORS.purple,
                },
              ]}
            />
          </Box>
        )}

        {/* on a wide screen the legend sits in the panel, under the Display select */}
        {/* editing shows the territories in their own colours, without a legend */}
        {compact && map.mode === 'view' && !editor.editing && (
          <Box
            sx={{
              position: 'absolute',
              left: '12px',
              // just above the attribution button
              bottom: '44px',
              zIndex: 2,
            }}
          >
            <LegendIsland items={map.legend} />
          </Box>
        )}

        <Box
          sx={{
            position: 'absolute',
            left: '12px',
            right: '12px',
            bottom: '12px',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '8px',
            pointerEvents: 'none',
            '& > *': { pointerEvents: 'auto' },
          }}
        >
          <MapIsland corner="static" vertical>
            <MapAction
              title={t('tr_territoryZoomIn')}
              placement="left"
              onClick={map.zoomIn}
            >
              <IconAdd color="var(--accent-main)" />
            </MapAction>

            <CustomDivider color="var(--accent-200)" sx={{ width: '24px' }} />

            <MapAction
              title={t('tr_territoryZoomOut')}
              placement="left"
              onClick={map.zoomOut}
            >
              <IconRemove color="var(--accent-main)" />
            </MapAction>
          </MapIsland>

          <MapIsland corner="static">
            <NorthAction map={map.instance} placement="top" />

            <MapAction
              title={t('tr_territoryMyLocation')}
              placement="top"
              onClick={map.locate}
            >
              <IconMyLocation color="var(--accent-main)" />
            </MapAction>

            <MapAction
              title={t('tr_territoryShowAllTerritories')}
              placement="top"
              onClick={map.fitAll}
            >
              <IconMapOverview color="var(--accent-main)" />
            </MapAction>

            <FullscreenToggle
              fullscreen={map.fullscreen}
              onToggle={map.toggleFullscreen}
            />
          </MapIsland>
        </Box>
      </Box>

      <Dialog
        open={map.pendingLeave}
        onClose={map.keepEditing}
        title={t('tr_discardChanges')}
        description={t('tr_unsavedChangesDesc')}
      >
        <DialogActions>
          <Button variant="secondary" onClick={map.keepEditing}>
            {t('tr_territoryKeepEditing')}
          </Button>
          <Button variant="main" color="red" onClick={map.confirmLeave}>
            {t('tr_territoryDiscard')}
          </Button>
        </DialogActions>
      </Dialog>

      {editor.labelling !== undefined && (
        <LabelDialog
          initial={editor.labelStart}
          onSave={editor.saveLabel}
          onClose={() => editor.saveLabel('')}
        />
      )}

      {map.splitDialog && (
        <TerritoryFieldsDialog
          title={t('tr_territorySplitTerritory')}
          description={t(
            'tr_territoryTheHighlightedPartBecomesANewTerritoryHistoryAnd',
            { number: map.selected?.number ?? '' }
          )}
          confirm={t('tr_territorySplit')}
          low
          {...map.splitDialog}
        />
      )}

      {map.mergeDialog && (
        <TerritoryFieldsDialog
          title={t('tr_territoryCombineTerritories')}
          description={t('tr_territoryCombineDescription')}
          confirm={t('tr_territoryCombine')}
          {...map.mergeDialog}
        />
      )}

      <MapContextMenu
        editor={editor}
        spot={spot}
        onClose={() => setSpot(undefined)}
      />
    </Box>
  );
};

export default TerritoriesMap;
