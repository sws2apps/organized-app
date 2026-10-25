import { useAppTranslation } from '@hooks/index';
import { mapRequest } from '@services/maps/offline';
import {
  downgradeMapTier,
  mapPerformanceOptions,
  watchMapPerformance,
} from '@services/maps/performance';
import { useEffect, useRef, useState } from 'react';
import { Box, Dialog as MuiDialog, Stack } from '@mui/material';
import { exportFile } from '@services/files/export';
import { displaySnackNotification } from '@services/states/app';
import { useNavigate } from 'react-router';
import { useAtomValue } from 'jotai';
import * as maplibregl from 'maplibre-gl';
import { Badge, Button, Typography } from '@components/index';
import {
  IconAdd,
  IconClose,
  IconDrawShape,
  IconEditMap,
  IconFullscreen,
  IconLocation,
  IconMapOverview,
  IconRemove,
  IconShare,
} from '@icons/index';
import { openInMaps, territoryCenter } from '@features/territories/helpers';
import { isDarkThemeState } from '@states/app';
import {
  territoriesShowDoNotCallMapState,
  territoriesState,
} from '@states/territories';
import { Territory } from '@definition/territory';
import {
  DEFAULT_PROVIDER,
  MAP_PROVIDER,
} from '@features/territories/map/constants';
import {
  applyBasemapOptions,
  DEFAULT_BASEMAP,
  hideStylePlaces,
  labelsAbove,
} from '@features/territories/map/basemap';
import {
  addAttribution,
  boundaryBounds,
  letterFrames,
  mapLocale,
} from '@features/territories/map/helpers';
import {
  addDoNotCallLayer,
  addOutsideVeil,
  addTerritoryLayers,
  setDoNotCallData,
} from '@features/territories/map/layers';
import { getCSSPropertyValue, systemBarInset } from '@utils/common';
import { captureTerritoryMap } from '@features/territories/map/capture';
import {
  frameZoom,
  MarkerRegistry,
  syncMarkers,
} from '@features/territories/map/markers';
import MapIsland, {
  MapAction,
  NorthAction,
} from '@features/territories/map/map_island';
import Tooltip from '@components/tooltip';
import 'maplibre-gl/dist/maplibre-gl.css';

const BoundaryPreview = ({
  territory,
  interactive = false,
  onReady,
}: {
  territory: Territory;
  // the full-screen view lets you pan, zoom and turn the map
  interactive?: boolean;
  onReady?: (map?: maplibregl.Map) => void;
}) => {
  const isDark = useAtomValue(isDarkThemeState);
  const showDoNotCalls = useAtomValue(territoriesShowDoNotCallMapState);

  const container = useRef<HTMLDivElement>(null);

  // rebuild only when what the map draws changes, not on every keystroke
  const latest = useRef(territory);
  latest.current = territory;

  const { boundary, mapShapes, mapLines, mapMarkers } = territory;

  useEffect(() => {
    if (!container.current || !boundary?.length) return;

    const bounds = boundaryBounds(boundary);
    const element = container.current;

    // a share of the frame rather than fixed pixels, so a bigger screen shows a bigger
    // territory; never less than the room the buttons and credits need
    const padding = () => {
      const { clientWidth: width, clientHeight: height } = element;
      const side = Math.max(32, width * 0.1);

      return {
        top: Math.max(64, height * 0.12),
        bottom: Math.max(56, height * 0.1),
        left: side,
        right: side,
      };
    };

    const instance = new maplibregl.Map({
      container: element,
      style: isDark ? MAP_PROVIDER.dark : MAP_PROVIDER.light,
      bounds,
      fitBoundsOptions: { padding: padding() },
      interactive,
      transformRequest: mapRequest,
      attributionControl: false,
      locale: mapLocale(),
      ...mapPerformanceOptions(),
    });

    instance.on('webglcontextlost', downgradeMapTier);
    if (interactive) watchMapPerformance(instance);

    // the card settles its size after the map starts, and changes with the window;
    // the small map follows, the full-screen one keeps wherever the user moved it
    const observer = new ResizeObserver(() => {
      instance.resize();
      if (!interactive)
        instance.fitBounds(bounds, { padding: padding(), duration: 0 });
    });
    observer.observe(element);

    addAttribution(instance);
    onReady?.(instance);

    const registry: MarkerRegistry = new Map();

    instance.on('style.load', () => {
      applyBasemapOptions(instance, DEFAULT_PROVIDER, DEFAULT_BASEMAP);
      hideStylePlaces(instance);
      addOutsideVeil(instance, boundary, getCSSPropertyValue('--white'));
      addTerritoryLayers(instance, latest.current);
      // the marked houses come with the part letters, once the territory fills the view
      if (showDoNotCalls) {
        addDoNotCallLayer(instance, frameZoom(instance, boundary) - 0.05);
        setDoNotCallData(instance, [latest.current]);
      }
      labelsAbove(instance);
      syncMarkers(
        instance,
        mapMarkers ?? [],
        registry,
        undefined,
        letterFrames([latest.current])
      );
      instance.triggerRepaint();
    });

    return () => {
      observer.disconnect();
      onReady?.(undefined);
      syncMarkers(instance, [], registry);
      instance.remove();
    };
  }, [
    boundary,
    mapShapes,
    mapLines,
    mapMarkers,
    isDark,
    interactive,
    onReady,
    showDoNotCalls,
  ]);

  return (
    <Box
      ref={container}
      sx={{ height: '100%', width: '100%', minWidth: 0, overflow: 'hidden' }}
    />
  );
};

const FullscreenMap = ({
  territory,
  doNotCalls,
  onClose,
}: {
  territory: Territory;
  // a reminder while walking the area, for those allowed to see them
  doNotCalls: number;
  onClose: VoidFunction;
}) => {
  const { t } = useAppTranslation();

  const [map, setMap] = useState<maplibregl.Map>();

  const fit = () => {
    if (!map || !territory.boundary?.length) return;

    map.fitBounds(boundaryBounds(territory.boundary), {
      padding: 64,
      bearing: 0,
      pitch: 0,
    });
  };

  return (
    <MuiDialog
      open
      fullScreen
      onClose={onClose}
      slotProps={{
        paper: {
          // the map runs under the system bars, as in a maps app; the shell
          // would otherwise pad the paper and leave white bands there
          sx: {
            backgroundColor: 'var(--white)',
            paddingTop: '0 !important',
            paddingBottom: '0 !important',
          },
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          '& .maplibregl-ctrl-bottom-left': {
            bottom: systemBarInset('bottom'),
            left: systemBarInset('left'),
          },
        }}
      >
        <BoundaryPreview territory={territory} interactive onReady={setMap} />

        {/* the controls keep clear of the bars the map runs under */}
        <Box
          sx={{
            position: 'absolute',
            top: systemBarInset('top'),
            right: systemBarInset('right'),
            bottom: systemBarInset('bottom'),
            left: systemBarInset('left'),
            pointerEvents: 'none',
            '& > *': { pointerEvents: 'auto' },
          }}
        >
          <MapIsland corner="top-left">
            <Typography
              className="body-small-semibold"
              color="var(--black)"
              noWrap
              // as tall as the Close button beside it
              sx={{ padding: '10px', maxWidth: 'calc(100vw - 220px)' }}
            >
              {[
                t('tr_territoryTerritory', { number: territory.number }),
                territory.name,
              ]
                .filter(Boolean)
                .join(' · ')}
            </Typography>
            {doNotCalls > 0 && (
              <Badge
                size="small"
                color="red"
                filled={false}
                text={t('tr_territoryDoNotCall', { n: doNotCalls })}
                sx={{ width: 'fit-content', flexShrink: 0, marginRight: '6px' }}
              />
            )}
          </MapIsland>

          <MapIsland corner="top-right">
            <MapAction title={t('tr_close')} placement="left" onClick={onClose}>
              <IconClose color="var(--accent-main)" />
            </MapAction>
          </MapIsland>

          <MapIsland corner="bottom-right" vertical>
            <NorthAction map={map} placement="left" />
            <MapAction
              title={t('tr_territoryZoomIn')}
              placement="left"
              onClick={() => map?.zoomIn()}
            >
              <IconAdd color="var(--accent-main)" />
            </MapAction>
            <MapAction
              title={t('tr_territoryZoomOut')}
              placement="left"
              onClick={() => map?.zoomOut()}
            >
              <IconRemove color="var(--accent-main)" />
            </MapAction>
            {/* also turns the map back to north up */}
            <MapAction
              title={t('tr_territoryShowTheWholeTerritory')}
              placement="left"
              onClick={fit}
            >
              <IconMapOverview color="var(--accent-main)" />
            </MapAction>
          </MapIsland>
        </Box>
      </Box>
    </MuiDialog>
  );
};

const TerritoryMap = ({
  territory,
  readOnly = false,
  showDoNotCalls = true,
}: {
  territory: Territory;
  // publishers look at the map; drawing it is for those who manage territories
  readOnly?: boolean;
  showDoNotCalls?: boolean;
}) => {
  const { t } = useAppTranslation();

  const navigate = useNavigate();

  const [fullscreen, setFullscreen] = useState(false);

  const canDraw = !readOnly;

  const center = territoryCenter(territory);

  const territories = useAtomValue(territoriesState);

  const [sharing, setSharing] = useState(false);

  // a new territory only exists once it is saved, and the map edits saved ones
  const isSaved = territories.some((item) => item.id === territory.id);
  const hasBoundary = !!territory.boundary?.length;

  const openMap = () =>
    navigate(`/territories/map?territory=${territory.id}&edit=1`);

  const handleShare = async () => {
    if (sharing) return;

    setSharing(true);

    try {
      const name = `${t('tr_territoryLabel')}-${territory.number}.png`;
      await exportFile(async () => {
        const image = await captureTerritoryMap(territory);
        if (!image)
          throw new Error(
            t('tr_territoryTheMapPictureCouldNotBeCreatedPleaseTry')
          );
        return (await fetch(image)).blob();
      }, name);
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        displaySnackNotification({
          header: t('tr_territorySharingFailed'),
          message: t((error as Error).message, {
            defaultValue: t(
              'tr_territoryTheTerritoryMapCouldNotBeSharedTryAgain'
            ),
          }),
          severity: 'error',
        });
      }
    } finally {
      setSharing(false);
    }
  };

  const small = { minHeight: '28px', padding: '2px 8px', minWidth: 'unset' };

  let emptyText = t('tr_territoryNoBordersYet');
  if (!isSaved) emptyText = t('tr_territoryEnterANumberFirstToDrawBorders');
  if (readOnly) emptyText = t('tr_territoryNoMapYet');

  return (
    <Stack spacing="16px">
      {fullscreen && (
        <FullscreenMap
          territory={territory}
          doNotCalls={showDoNotCalls ? territory.doNotCalls.length : 0}
          onClose={() => setFullscreen(false)}
        />
      )}
      <Box
        sx={{
          position: 'relative',
          // a shape rather than a height, so wide screens don't zoom the territory out
          aspectRatio: '3 / 2',
          width: '100%',
          minWidth: 0,
          overflow: 'hidden',
          borderRadius: 'var(--radius-l)',
          clipPath: 'inset(0 round var(--radius-l))',
          border: hasBoundary
            ? '1px solid var(--accent-200)'
            : '1px dashed var(--accent-300)',
          backgroundColor: hasBoundary ? 'var(--white)' : 'var(--accent-150)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {hasBoundary && !fullscreen && (
          <BoundaryPreview territory={territory} />
        )}

        {!hasBoundary && (
          <Stack
            spacing="12px"
            sx={{ alignItems: 'center', maxWidth: '320px', padding: '16px' }}
          >
            <Typography
              className="body-regular"
              color="var(--grey-400)"
              align="center"
            >
              {emptyText}
            </Typography>

            {isSaved && canDraw && (
              <Button
                variant="secondary"
                disableAutoStretch
                startIcon={<IconDrawShape color="var(--accent-main)" />}
                onClick={openMap}
              >
                {t('tr_territoryDrawBorders')}
              </Button>
            )}
          </Stack>
        )}

        {hasBoundary && (
          // the same small size as Edit map across the top
          <MapIsland corner="top-right">
            {[
              {
                label: 'tr_share',
                icon: IconShare,
                onClick: handleShare,
                disabled: sharing,
              },
              ...(center
                ? [
                    {
                      label: 'tr_territoryOpenInMaps',
                      icon: IconLocation,
                      onClick: () => openInMaps(center),
                      disabled: false,
                    },
                  ]
                : []),
              {
                label: 'tr_territoryFullScreen',
                icon: IconFullscreen,
                onClick: () => setFullscreen(true),
                disabled: false,
              },
            ].map(({ label, icon: Icon, onClick, disabled }) => (
              <Tooltip key={label} title={t(label)}>
                <Button
                  variant="small"
                  disableAutoStretch
                  ariaLabel={t(label)}
                  disabled={disabled}
                  onClick={onClick}
                  sx={{ ...small, width: '28px', padding: '2px' }}
                >
                  <Icon color="var(--accent-main)" width={20} height={20} />
                </Button>
              </Tooltip>
            ))}
          </MapIsland>
        )}

        {hasBoundary && canDraw && (
          <MapIsland corner="top-left">
            <Button
              variant="small"
              disableAutoStretch
              startIcon={<IconEditMap color="var(--accent-main)" />}
              onClick={openMap}
              sx={small}
            >
              {t('tr_edit')}
            </Button>
          </MapIsland>
        )}
      </Box>
    </Stack>
  );
};

export default TerritoryMap;
