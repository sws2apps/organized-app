import { Box, Skeleton, styled } from '@mui/material';

export const SkeletonLoaderCardContainer = styled(Box)({
  width: '100%',
  borderRadius: 'var(--radius-xl)',
  border: '1px solid var(--accent-200)',
  backgroundColor: 'var(--white)',
});

export const SkeletonLoaderCardTitle = styled(Box)({
  padding: '8px 8px 0px 8px',
});

export const SkeletonLoaderCardBlueArea = styled(Box)({
  background: 'var(--accent-200)',
  borderRadius: 'var(--radius-m)',
  display: 'flex',
  justifyContent: 'center',
  padding: '16px 0px 16px 0px',
});

export const SkeletonLoaderCardBlueAreaRect = styled(Skeleton)({
  borderRadius: 'var(--radius-m)',
  background: 'var(--accent-300)',
  width: '128px',
  height: '24px',
});

export const SkeletonLoaderCardItems = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '0px 0px 8px 8px',
  padding: '8px',
  gap: '2px',
});

export const SkeletonLoaderCardItem = styled(Box)({
  borderRadius: 'var(--radius-s)',
  justifyContent: 'space-between',
  padding: '10px 8px 10px 16px',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  gap: '16px',
  backgroundColor: 'var(--white)',
});

export const SkeletonLoaderCardCircle = styled(Skeleton)({
  background: 'var(--accent-200)',
  width: '20px',
  height: '20px',
});

export const SkeletonLoaderCardText = styled(Skeleton)({
  background: 'var(--accent-200)',
  borderRadius: 'var(--radius-max)',
  height: '20px',
});

export const SkeletonLoaderCardGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  gap: '10px',
});
