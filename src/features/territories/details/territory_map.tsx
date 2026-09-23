import { useEffect, useRef, useState } from 'react';
import { Box, Dialog as MuiDialog, Stack } from '@mui/material';
import { saveAs } from 'file-saver';
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
import { openInMaps, territoryCenter } from '../helpers';
import { isDarkThemeState } from '@states/app';
import { territoriesState } from '@states/territories';
import { Territory } from '@definition/territory';
import { DEFAULT_PROVIDER, MAP_PROVIDER } from '../map/constants';
import { applyBasemapOptions, DEFAULT_BASEMAP } from '../map/basemap';
import { addAttribution, boundaryBounds } from '../map/helpers';
import { addOutsideVeil, addTerritoryLayers } from '../map/layers';
import { getCSSPropertyValue } from '@utils/common';
import { captureTerritoryMap } from '../map/capture';
import { MarkerRegistry, syncMarkers } from '../map/markers';
import MapIsland, { MapAction } from '../map/map_island';
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

  const container = useRef<HTMLDivElement>(null);

  // rebuild only when what the map draws changes, not on every keystroke
  const latest = useRef(territory);
  latest.current = territory;

  const { boundary, mapShapes, mapLines, mapMarkers } = territory;

  useEffect(() => {
    if (!container.current || !boundary?.length) return;

    const [west, south, east, north] = boundaryBounds(boundary);

    const instance = new maplibregl.Map({
      container: container.current,
      style: isDark ? MAP_PROVIDER.dark : MAP_PROVIDER.light,
      bounds: [west, south, east, north],
      // clear of the buttons above and the credits below
      fitBoundsOptions: {
        padding: interactive
          ? 64
          : { top: 64, bottom: 56, left: 32, right: 32 },
      },
      interactive,
      attributionControl: false,
    });

    addAttribution(instance);
    onReady?.(instance);

    const registry: MarkerRegistry = new Map();

    instance.on('style.load', () => {
      applyBasemapOptions(instance, DEFAULT_PROVIDER, DEFAULT_BASEMAP);
      addOutsideVeil(instance, boundary, getCSSPropertyValue('--white'));
      addTerritoryLayers(instance, latest.current, 0.12);
      syncMarkers(instance, mapMarkers ?? [], registry);
      instance.triggerRepaint();
    });

    return () => {
      onReady?.(undefined);
      syncMarkers(instance, [], registry);
      instance.remove();
    };
  }, [boundary, mapShapes, mapLines, mapMarkers, isDark, interactive, onReady]);

  return <Box ref={container} sx={{ height: '100%', width: '100%' }} />;
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
    <MuiDialog open fullScreen onClose={onClose}>
      <Box sx={{ position: 'relative', height: '100dvh' }}>
        <BoundaryPreview territory={territory} interactive onReady={setMap} />

        <MapIsland corner="top-left">
          <Typography
            className="body-small-semibold"
            color="var(--black)"
            noWrap
            // as tall as the Close button beside it
            sx={{ padding: '10px', maxWidth: 'calc(100vw - 220px)' }}
          >
            {[`Territory ${territory.number}`, territory.name]
              .filter(Boolean)
              .join(' · ')}
          </Typography>
          {doNotCalls > 0 && (
            <Badge
              size="small"
              color="red"
              filled={false}
              text={`Do not call: ${doNotCalls}`}
              sx={{ width: 'fit-content', flexShrink: 0, marginRight: '6px' }}
            />
          )}
        </MapIsland>

        <MapIsland corner="top-right">
          <MapAction title="Close" placement="left" onClick={onClose}>
            <IconClose color="var(--accent-main)" />
          </MapAction>
        </MapIsland>

        <MapIsland corner="bottom-right" vertical>
          <MapAction
            title="Zoom in"
            placement="left"
            onClick={() => map?.zoomIn()}
          >
            <IconAdd color="var(--accent-main)" />
          </MapAction>
          <MapAction
            title="Zoom out"
            placement="left"
            onClick={() => map?.zoomOut()}
          >
            <IconRemove color="var(--accent-main)" />
          </MapAction>
          {/* also turns the map back to north up */}
          <MapAction
            title="Show the whole territory"
            placement="left"
            onClick={fit}
          >
            <IconMapOverview color="var(--accent-main)" />
          </MapAction>
        </MapIsland>
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
      const image = await captureTerritoryMap(territory);

      if (!image) {
        displaySnackNotification({
          header: 'Sharing failed',
          message: 'The map picture could not be created. Please try again.',
          severity: 'error',
        });
        return;
      }

      const name = `Territory-${territory.number}.png`;
      const blob = await (await fetch(image)).blob();
      const file = new File([blob], name, { type: blob.type || 'image/png' });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Territory ${territory.number}`,
        });
      } else {
        saveAs(blob, name);
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        displaySnackNotification({
          header: 'Sharing failed',
          message: (error as Error).message,
          severity: 'error',
        });
      }
    } finally {
      setSharing(false);
    }
  };

  const small = { minHeight: '28px', padding: '2px 8px', minWidth: 'unset' };

  let emptyText = 'No borders yet.';
  if (!isSaved) emptyText = 'Save first to draw borders.';
  if (readOnly) emptyText = 'No map yet.';

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
          height: '320px',
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
        {hasBoundary && <BoundaryPreview territory={territory} />}

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
                Draw borders
              </Button>
            )}
          </Stack>
        )}

        {hasBoundary && (
          <MapIsland corner="top-right">
            {/* the same small size as Edit map across the top */}
            <Tooltip title="Full screen">
              <Button
                variant="small"
                disableAutoStretch
                aria-label="Full screen"
                onClick={() => setFullscreen(true)}
                sx={{ ...small, width: '28px', padding: '2px' }}
              >
                <IconFullscreen
                  color="var(--accent-main)"
                  width={20}
                  height={20}
                />
              </Button>
            </Tooltip>
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
              Edit map
            </Button>
          </MapIsland>
        )}
      </Box>

      {hasBoundary && (
        <Stack
          direction="row"
          sx={{ justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}
        >
          <Button
            variant="secondary"
            disableAutoStretch
            disabled={sharing}
            startIcon={<IconShare color="var(--accent-main)" />}
            onClick={handleShare}
          >
            Share map
          </Button>
          {center && (
            <Button
              variant="secondary"
              disableAutoStretch
              startIcon={<IconLocation color="var(--accent-main)" />}
              onClick={() => openInMaps(center)}
            >
              Open in maps
            </Button>
          )}
        </Stack>
      )}
    </Stack>
  );
};

export default TerritoryMap;
