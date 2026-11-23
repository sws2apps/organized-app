import { Box, Skeleton } from '@mui/material';

const MinistryTimerSkeletonLoader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '4px 8px 12px 8px',
        gap: '12px',
      }}
    >
      <Box
        sx={{
          borderRadius: 'var(--radius-l)',
          padding: '12px 8px 12px 8px',
          backgroundColor: 'var(--accent-150)',
          width: '103px',
          height: '44px',
        }}
      />
      <Skeleton
        variant="rectangular"
        sx={{
          borderRadius: 'var(--radius-m)',
          background: 'var(--accent-200)',
          width: '64px',
          height: '20px',
        }}
      />
      <Box
        sx={{
          borderRadius: 'var(--radius-l)',
          padding: '12px 8px 12px 8px',
          backgroundColor: 'var(--accent-150)',
          width: '103px',
          height: '44px',
        }}
      />
    </Box>
  );
};

export default MinistryTimerSkeletonLoader;
