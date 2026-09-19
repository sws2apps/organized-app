import { Box, Skeleton } from '@mui/material';
import DashboardCardSkeleton from './card_skeleton';
import useSkeletonLoader from './useSkeletonLoader';

const lineSx = {
  background: 'var(--accent-200)',
  borderRadius: 'var(--radius-max)',
};

const DashboardSkeletonLoader = () => {
  const { cardRows } = useSkeletonLoader();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* the greeting and the assignments line, 52px tall like the real text */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Skeleton variant="rounded" width={220} height={24} sx={lineSx} />
        <Skeleton
          variant="rounded"
          height={18}
          sx={{ ...lineSx, maxWidth: '360px' }}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gridGap: '24px',
        }}
      >
        {cardRows.map((rows, index) => (
          <DashboardCardSkeleton key={index} rows={rows} />
        ))}
      </Box>
    </Box>
  );
};

export default DashboardSkeletonLoader;
