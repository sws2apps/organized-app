import { Box } from '@mui/material';
import { GroupBadgeProps } from './index.types';
import useGroupBadge from './useGroupBadge';
import Typography from '@components/typography';

const GroupBadge = ({
  label,
  color = 'accent-main',
  variant = 'solid',
  size = 'normal',
  fullWidth = false,
  align = 'left',
}: GroupBadgeProps) => {
  const { style } = useGroupBadge({ color, variant });

  const isSmall = size === 'small';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        gap: '8px',
        padding: isSmall ? '3px 6px' : '4px 8px',
        borderRadius: 'var(--radius-s)',
        ...(fullWidth ? { width: '100%', minWidth: 0, overflow: 'hidden' } : {}),
        ...style,
      }}
    >
      {/* <IconVisitors color="var(--always-white)" width={16} height={16} /> */}
      <Typography
        className={isSmall ? 'label-small-medium' : 'body-small-semibold'}
        color="inherit"
        noWrap={fullWidth}
        sx={align === 'center' ? { textAlign: 'center' } : undefined}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default GroupBadge;
