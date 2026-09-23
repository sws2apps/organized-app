import { useEffect, useRef, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { saveAs } from 'file-saver';
import { displaySnackNotification } from '@services/states/app';
import { useNavigate } from 'react-router';
import { useAtomValue } from 'jotai';
import * as maplibregl from 'maplibre-gl';
import { Button, Typography } from '@components/index';
import {
  IconDrawShape,
  IconEditMap,
  IconLocation,
  IconShare,
} from '@icons/index';
import { openInMaps, territoryCenter } from '../helpers';
import { isDarkThemeState } from '@states/app';
import { territoriesState } from '@states/territories';
import { Territory } from '@definition/territory';
import { MAP_PROVIDER } from '../map/constants';
import { addAttribution, boundaryBounds } from '../map/helpers';
import { addTerritoryLayers } from '../map/layers';
import { captureTerritoryMap } from '../map/capture';
import { MarkerRegistry, syncMarkers } from '../map/markers';
import MapIsland from '../map/map_island';
import 'maplibre-gl/dist/maplibre-gl.css';

const BoundaryPreview = ({ territory }: { territory: Territory }) => {
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
      fitBoundsOptions: { padding: 32 },
      interactive: false,
      attributionControl: false,
    });

    addAttribution(instance);

    const registry: MarkerRegistry = new Map();

    instance.on('style.load', () => {
      addTerritoryLayers(instance, latest.current, 0.12);
      syncMarkers(instance, mapMarkers ?? [], registry);
      instance.triggerRepaint();
    });

    return () => {
      syncMarkers(instance, [], registry);
      instance.remove();
    };
  }, [boundary, mapShapes, mapLines, mapMarkers, isDark]);

  return <Box ref={container} sx={{ height: '100%', width: '100%' }} />;
};

const TerritoryMap = ({
  territory,
  readOnly = false,
}: {
  territory: Territory;
  // publishers look at the map; drawing it is for those who manage territories
  readOnly?: boolean;
}) => {
  const navigate = useNavigate();

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
