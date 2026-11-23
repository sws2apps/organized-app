import { useAppTranslation } from '@hooks/index';
import { ReactNode, useEffect, useId, useState } from 'react';
import { Box, Stack, TooltipProps } from '@mui/material';
import * as maplibregl from 'maplibre-gl';
import IconButton from '@components/icon_button';
import Tooltip from '@components/tooltip';

type Corner =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'left'
  | 'static';

const PLACE: Record<Corner, object> = {
  'top-left': { top: '12px', left: '12px' },
  'top-right': { top: '12px', right: '12px' },
  'bottom-left': { bottom: '12px', left: '12px' },
  'bottom-right': { bottom: '12px', right: '12px' },
  left: { top: '50%', left: '12px', transform: 'translateY(-50%)' },
  static: { position: 'relative' },
};

const MapIsland = ({
  corner,
  vertical = false,
  children,
}: {
  corner: Corner;
  vertical?: boolean;
  children: ReactNode;
}) => (
  <Stack
    direction={vertical ? 'column' : 'row'}
    sx={{
      position: 'absolute',
      zIndex: 2,
      alignItems: 'center',
      gap: '4px',
      padding: '4px',
      borderRadius: 'var(--radius-l)',
      backgroundColor: 'var(--white)',
      border: '1px solid var(--accent-200)',
      boxShadow: 'var(--hover-shadow)',
      ...PLACE[corner],
    }}
  >
    {children}
  </Stack>
);

export const MapAction = ({
  title,
  placement,
  delaySpeed,
  onClick,
  children,
}: {
  title: string;
  placement?: TooltipProps['placement'];
  delaySpeed?: 'fast' | 'slow';
  onClick: VoidFunction;
  children: ReactNode;
}) => (
  <Tooltip title={title} placement={placement} delaySpeed={delaySpeed}>
    <IconButton
      aria-label={title}
      onClick={onClick}
      sx={{
        padding: '6px',
        margin: 0,
        borderRadius: 'var(--radius-m)',
        backgroundColor: 'transparent',
        '&:hover': { backgroundColor: 'var(--accent-150)' },
      }}
    >
      {children}
    </IconButton>
  </Tooltip>
);

const SOUTH = 'M12 22 8 12h8Z';

// always there, like a compass: the needle points north as the map turns
export const NorthAction = ({
  map,
  placement,
}: {
  map?: maplibregl.Map | null;
  placement?: TooltipProps['placement'];
}) => {
  const { t } = useAppTranslation();

  const [bearing, setBearing] = useState(0);
  // useId holds colons, which url(#…) does not accept
  const clip = `north${useId().replace(/\W/g, '')}`;

  useEffect(() => {
    if (!map) return;

    const update = () => setBearing(map.getBearing());

    update();
    map.on('rotate', update);

    return () => {
      map.off('rotate', update);
    };
  }, [map]);

  return (
    <MapAction
      title={t('tr_territoryTurnToNorth')}
      placement={placement}
      onClick={() => map?.easeTo({ bearing: 0, pitch: 0 })}
    >
      {/* filled half points north; the south line is clipped to sit inside */}
      <Box
        component="svg"
        viewBox="0 0 24 24"
        sx={{ width: 24, height: 24, transform: `rotate(${-bearing}deg)` }}
      >
        <clipPath id={clip}>
          <path d={SOUTH} />
        </clipPath>
        <path d="M12 2 16 12H8Z" fill="var(--accent-main)" />
        <path
          d={SOUTH}
          fill="none"
          stroke="var(--accent-main)"
          strokeWidth={3}
          clipPath={`url(#${clip})`}
        />
      </Box>
    </MapAction>
  );
};

export default MapIsland;
