import { Box } from '@mui/material';
import { GroupBadgeProps } from './index.types';
import useGroupBadge from './useGroupBadge';
import Typography from '@components/typography';

const GroupBadge = ({
  label,
  color = 'accent-main',
  variant = 'solid',
}: GroupBadgeProps) => {
  const { style } = useGroupBadge({ color, variant });

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 8px',
        borderRadius: 'var(--radius-s)',
        ...style,
      }}
    >
      {/* <IconVisitors color="var(--always-white)" width={16} height={16} /> */}
      <Typography className="body-small-semibold" color="inherit">
        {label}
      </Typography>
    </Box>
  );
};

export default GroupBadge;
