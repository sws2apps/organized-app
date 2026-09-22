import { ReactNode } from 'react';
import { Stack } from '@mui/material';
import IconButton from '@components/icon_button';
import { TooltipProps } from '@mui/material';
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
  onClick,
  children,
}: {
  title: string;
  placement?: TooltipProps['placement'];
  onClick: VoidFunction;
  children: ReactNode;
}) => (
  <Tooltip title={title} placement={placement}>
    <IconButton
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

export default MapIsland;
