import { Box } from '@mui/material';
import { IconAssignment } from '@components/icons';
import { AssignmentBadgeProps } from './index.types';
import Typography from '@components/typography';

const AssignmentBadge = ({ count }: AssignmentBadgeProps) => {
  return (
    <Box
      sx={{
        width: 'fit-content',
        borderRadius: 'var(--radius-xxl)',
        backgroundColor: 'var(--accent-150)',
        padding: '4px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      <IconAssignment color="var(--accent-dark)" height={16} width={16} />
      <Typography color="var(--accent-dark)" className="body-small-semibold">
        {count.toString()}
      </Typography>
    </Box>
  );
};

export default AssignmentBadge;
