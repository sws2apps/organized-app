import { ReactNode } from 'react';
import IconButton from '@components/icon_button';
import Tooltip from '@components/tooltip';

const RowAction = ({
  title,
  color,
  onClick,
  children,
}: {
  title: string;
  color?: 'error';
  onClick: VoidFunction;
  children: ReactNode;
}) => (
  <Tooltip title={title}>
    <IconButton
      aria-label={title}
      color={color}
      onClick={onClick}
      sx={{
        padding: '6px',
        margin: 0,
        borderRadius: 'var(--radius-max)',
        // 30px to see, 44px to tap
        '&::after': { content: '""', position: 'absolute', inset: '-7px' },
      }}
    >
      {children}
    </IconButton>
  </Tooltip>
);

export default RowAction;
