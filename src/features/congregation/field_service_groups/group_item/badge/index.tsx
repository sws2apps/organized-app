import { Box } from '@mui/material';
import { IconVisitors } from '@components/icons';
import { GroupBadgeProps } from './index.types';
import useBadge from './useBadge';
import Typography from '@components/typography';

const GroupBadge = (props: GroupBadgeProps) => {
  const { bg_color, members_count } = useBadge(props);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '4px',
        padding: '2px 8px 2px 8px',
        borderRadius: 'var(--radius-s)',
        alignItems: 'center',
        backgroundColor: bg_color,
      }}
    >
      <IconVisitors color="var(--always-white)" width={16} height={16} />
      <Typography className="body-small-semibold" color={'var(--always-white)'}>
        {members_count}
      </Typography>
    </Box>
  );
};

export default GroupBadge;
