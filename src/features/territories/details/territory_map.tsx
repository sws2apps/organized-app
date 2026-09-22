import { useEffect, useRef, useState } from 'react';
import { Box, FormControlLabel, RadioGroup, Stack } from '@mui/material';
import { saveAs } from 'file-saver';
import Radio from '@components/radio';
import { displaySnackNotification } from '@services/states/app';
import { useNavigate } from 'react-router';
import { useAtomValue } from 'jotai';
import * as maplibregl from 'maplibre-gl';
import { Button, CustomDivider, Typography } from '@components/index';
import { useBreakpoints } from '@hooks/index';
import {
  IconDrawShape,
  IconEditMap,
  IconImgAdd,
  IconImgDelete,
  IconShare,
} from '@icons/index';
import { isDarkThemeState } from '@states/app';
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

const readPicture = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const pictureBlob = async (source: string) => (await fetch(source)).blob();

const TerritoryMap = ({
  territory,
  onChange,
}: {
  territory: Territory;
  onChange: (territory: Territory) => void;
}) => {
  const navigate = useNavigate();

  const { laptopUp } = useBreakpoints();

  const input = useRef<HTMLInputElement>(null);
  const [sharing, setSharing] = useState(false);

  const source = territory.mapSource ?? 'custom';
  const hasBoundary = !!territory.boundary?.length;
  const picture = territory.mapPicture;

  const shown = source === 'image' ? !!picture : hasBoundary;

  const openMap = () =>
    navigate(`/territories/map?territory=${territory.id}&edit=1`);

  const handlePick = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    const data = await readPicture(file);

    onChange({ ...territory, mapSource: 'image', mapPicture: data });
  };

  const handleShare = async () => {
    if (sharing) return;

    setSharing(true);

    try {
      const image =
        source === 'image' ? picture : await captureTerritoryMap(territory);

      if (!image) {
        displaySnackNotification({
          header: 'Sharing failed',
          message: 'The map picture could not be created. Please try again.',
          severity: 'error',
        });
        return;
      }

      const name = `Territory-${territory.number}.png`;
      const blob = await pictureBlob(image);
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

  return (
    <Stack spacing="16px">
      <RadioGroup
        row
        value={source}
        onChange={(event) =>
          onChange({
            ...territory,
            mapSource: event.target.value as 'custom' | 'image',
          })
        }
        sx={{ gap: '16px', marginLeft: '6px' }}
      >
        <FormControlLabel
          value="custom"
          label={<Typography className="body-regular">Custom map</Typography>}
          control={<Radio />}
        />
        <FormControlLabel
          value="image"
          label={<Typography className="body-regular">Image</Typography>}
          control={<Radio />}
        />
      </RadioGroup>

      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          handlePick(event.target.files);
          event.target.value = '';
        }}
      />

      <Box
        sx={{
          position: 'relative',
          height: '320px',
          overflow: 'hidden',
          borderRadius: 'var(--radius-l)',
          clipPath: 'inset(0 round var(--radius-l))',
          border: shown
            ? '1px solid var(--accent-200)'
            : '1px dashed var(--accent-300)',
          backgroundColor: shown ? 'var(--white)' : 'var(--accent-150)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {source === 'custom' && hasBoundary && (
          <BoundaryPreview territory={territory} />
        )}

        {source === 'image' && picture && (
          <Box
            component="img"
            src={picture}
            alt={`Territory ${territory.number}`}
            sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        )}

        {!shown && (
          <Stack spacing="8px" sx={{ alignItems: 'center' }}>
            <Typography className="body-regular" color="var(--grey-400)">
              {source === 'image'
                ? `No picture for territory ${territory.number} yet`
                : `Territory ${territory.number} has no borders yet`}
            </Typography>

            {source === 'image' ? (
              <Button
                variant="small"
                disableAutoStretch
                startIcon={<IconImgAdd color="var(--accent-main)" />}
                onClick={() => input.current?.click()}
                sx={small}
              >
                Add image
              </Button>
            ) : (
              laptopUp && (
                <Button
                  variant="small"
                  disableAutoStretch
                  startIcon={<IconDrawShape color="var(--accent-main)" />}
                  onClick={openMap}
                  sx={small}
                >
                  Draw borders
                </Button>
              )
            )}
          </Stack>
        )}

        {shown && (source === 'image' || laptopUp) && (
          <MapIsland corner="top-left">
            {source === 'custom' ? (
              <Button
                variant="small"
                disableAutoStretch
                startIcon={<IconEditMap color="var(--accent-main)" />}
                onClick={openMap}
                sx={small}
              >
                Edit borders
              </Button>
            ) : (
              <>
                <Button
                  variant="small"
                  disableAutoStretch
                  startIcon={<IconImgAdd color="var(--accent-main)" />}
                  onClick={() => input.current?.click()}
                  sx={small}
                >
                  Replace
                </Button>
                <CustomDivider
                  orientation="vertical"
                  flexItem
                  color="var(--accent-200)"
                  sx={{ margin: '4px 0' }}
                />
                <Button
                  variant="small"
                  color="red"
                  disableAutoStretch
                  startIcon={<IconImgDelete color="var(--red-main)" />}
                  onClick={() =>
                    onChange({ ...territory, mapPicture: undefined })
                  }
                  sx={small}
                >
                  Remove
                </Button>
              </>
            )}
          </MapIsland>
        )}
      </Box>

      {shown && (
        <Button
          variant="secondary"
          disabled={sharing}
          startIcon={<IconShare color="var(--accent-main)" />}
          onClick={handleShare}
        >
          Share map
        </Button>
      )}
    </Stack>
  );
};

export default TerritoryMap;
