import { Box, Skeleton } from '@mui/material';
import useDashboardSkeleton from './useDashboardSkeleton';
import MinistryTimerSkeletonLoader from './components/ministry_header';
import SkeletonLoaderCard from './components/skeleton_card';

const DashboardSkeletonLoader = () => {
  const { cards } = useDashboardSkeleton();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxWidth: '392px',
          height: '52px',
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{
            background: 'var(--accent-200)',
            borderRadius: '30px',
            width: '160px',
            height: '20px',
          }}
        />
        <Skeleton
          variant="rectangular"
          sx={{
            background: 'var(--accent-200)',
            borderRadius: '22.5px',
            height: '16px',
          }}
        />
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gridGap: '24px',
        }}
      >
        {cards.map((card) => (
          <SkeletonLoaderCard
            key={card.key}
            items={card.items}
            badges={card.badges}
            header={card.key === 'ministry' && <MinistryTimerSkeletonLoader />}
          />
        ))}
      </Box>
    </Box>
  );
};

export default DashboardSkeletonLoader;
