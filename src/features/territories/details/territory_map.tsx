import { useEffect, useRef } from 'react';
import { Box, Stack } from '@mui/material';
import { useNavigate } from 'react-router';
import { useAtomValue } from 'jotai';
import * as maplibregl from 'maplibre-gl';
import { Button, CustomDivider, Typography } from '@components/index';
import { useBreakpoints } from '@hooks/index';
import { IconDrawShape, IconEditMap, IconImgAdd } from '@icons/index';
import { isDarkThemeState } from '@states/app';
import { Territory } from '@definition/territory';
import { MAP_PROVIDER } from '../map/constants';
import {
  boundaryBounds,
  cssVar,
  lineCollection,
  markerCollection,
  statusColor,
} from '../map/helpers';
import 'maplibre-gl/dist/maplibre-gl.css';

const BoundaryPreview = ({ territory }: { territory: Territory }) => {
  const isDark = useAtomValue(isDarkThemeState);

  const container = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map>(null);

  useEffect(() => {
    const boundary = territory.boundary;
    if (!container.current || !boundary?.length) return;

    const [west, south, east, north] = boundaryBounds(boundary);

    const instance = new maplibregl.Map({
      container: container.current,
      style: isDark ? MAP_PROVIDER.dark : MAP_PROVIDER.light,
      bounds: [west, south, east, north],
      fitBoundsOptions: { padding: 32 },
      interactive: false,
      attributionControl: { compact: true },
    });

    instance.on('style.load', () => {
      instance.addSource('boundary', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'Polygon', coordinates: [boundary] },
        },
      });

      const color = statusColor(territory);

      instance.addLayer({
        id: 'boundary-fill',
        type: 'fill',
        source: 'boundary',
        paint: { 'fill-color': color, 'fill-opacity': 0.25 },
      });

      instance.addLayer({
        id: 'boundary-line',
        type: 'line',
        source: 'boundary',
        paint: { 'line-color': color, 'line-width': 2.5 },
      });

      instance.addSource('boundary-lines', {
        type: 'geojson',
        data: lineCollection([territory]),
      });

      instance.addLayer({
        id: 'boundary-lines-solid',
        type: 'line',
        source: 'boundary-lines',
        filter: ['==', ['get', 'style'], 'solid'],
        paint: { 'line-color': cssVar('--accent-dark'), 'line-width': 3 },
      });

      instance.addLayer({
        id: 'boundary-lines-dashed',
        type: 'line',
        source: 'boundary-lines',
        filter: ['==', ['get', 'style'], 'dashed'],
        paint: {
          'line-color': cssVar('--accent-dark'),
          'line-width': 3,
          'line-dasharray': [2, 2],
        },
      });

      instance.addSource('boundary-markers', {
        type: 'geojson',
        data: markerCollection([territory]),
      });

      instance.addLayer({
        id: 'boundary-markers-pin',
        type: 'circle',
        source: 'boundary-markers',
        filter: ['==', ['get', 'kind'], 'pin'],
        paint: {
          'circle-radius': 5,
          'circle-color': cssVar('--red-main'),
          'circle-stroke-width': 2,
          'circle-stroke-color': cssVar('--white'),
        },
      });

      instance.addLayer({
        id: 'boundary-markers-text',
        type: 'symbol',
        source: 'boundary-markers',
        filter: ['==', ['get', 'kind'], 'text'],
        layout: {
          'text-field': ['get', 'text'],
          'text-size': 12,
          'text-allow-overlap': true,
        },
        paint: {
          'text-color': cssVar('--black'),
          'text-halo-color': cssVar('--white'),
          'text-halo-width': 1.5,
        },
      });
    });

    map.current = instance;

    return () => {
      instance.remove();
      map.current = null;
    };
  }, [territory, isDark]);

  return <Box ref={container} sx={{ height: '100%', width: '100%' }} />;
};

const TerritoryMap = ({ territory }: { territory: Territory }) => {
  const navigate = useNavigate();

  const { laptopUp } = useBreakpoints();

  const hasBoundary = !!territory.boundary?.length;

  const openMap = () => navigate(`/territories/map?territory=${territory.id}`);

  return (
    <Box
      sx={{
        position: 'relative',
        height: '320px',
        overflow: 'hidden',
        borderRadius: 'var(--radius-l)',
        border: hasBoundary
          ? '1px solid var(--accent-200)'
          : '1px dashed var(--accent-300)',
        backgroundColor: hasBoundary ? 'var(--white)' : 'var(--accent-150)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {hasBoundary ? (
        <BoundaryPreview territory={territory} />
      ) : (
        <Stack spacing="8px" sx={{ alignItems: 'center' }}>
          <Typography className="body-regular" color="var(--grey-400)">
            Territory {territory.number} has no borders yet
          </Typography>
          {laptopUp && (
            <Button
              variant="small"
              disableAutoStretch
              startIcon={<IconDrawShape color="var(--accent-main)" />}
              onClick={openMap as never}
              sx={{ minHeight: '28px', padding: '2px 8px', minWidth: 'unset' }}
            >
              Draw on the map
            </Button>
          )}
        </Stack>
      )}

      {/* one island for both actions, split by a divider */}
      <Stack
        direction="row"
        sx={{
          position: 'absolute',
          left: '12px',
          top: '12px',
          alignItems: 'center',
          gap: '4px',
          padding: '4px',
          borderRadius: 'var(--radius-l)',
          backgroundColor: 'var(--white)',
          border: '1px solid var(--accent-200)',
          boxShadow: '0px 2px 8px 0px rgba(28, 28, 28, 0.12)',
        }}
      >
        <Button
          variant="small"
          disableAutoStretch
          startIcon={<IconImgAdd color="var(--accent-main)" />}
          sx={{ minHeight: '28px', padding: '2px 8px', minWidth: 'unset' }}
        >
          Add image
        </Button>

        {laptopUp && (
          <>
            <CustomDivider
              orientation="vertical"
              flexItem
              color="var(--accent-200)"
              sx={{ margin: '4px 0' }}
            />

            <Button
              variant="small"
              disableAutoStretch
              startIcon={<IconEditMap color="var(--accent-main)" />}
              onClick={openMap as never}
              sx={{ minHeight: '28px', padding: '2px 8px', minWidth: 'unset' }}
            >
              Edit map
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default TerritoryMap;
