import { Box, Skeleton } from '@mui/material';
import {
  SkeletonLoaderCardBlueArea,
  SkeletonLoaderCardBlueAreaRect,
  SkeletonLoaderCardCircle,
  SkeletonLoaderCardContainer,
  SkeletonLoaderCardItem,
  SkeletonLoaderCardItems,
  SkeletonLoaderCardText,
  SkeletonLoaderCardTitle,
} from './index.styled';
import { CustomDivider } from '@components/index';

const MinistryCardSkeletonLoader = () => {
  return (
    <SkeletonLoaderCardContainer className="big-card-shadow">
      <SkeletonLoaderCardTitle>
        <SkeletonLoaderCardBlueArea>
          <SkeletonLoaderCardBlueAreaRect variant="rectangular" />
        </SkeletonLoaderCardBlueArea>
      </SkeletonLoaderCardTitle>
      <SkeletonLoaderCardItems>
        <Box
          sx={{
            display: 'flex',
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
        <CustomDivider color="var(--accent-200)" />
        <SkeletonLoaderCardItem>
          <SkeletonLoaderCardCircle variant="circular" />
          <SkeletonLoaderCardText variant="rectangular" width={92} />
          <Box width={77} height={20} />
          <Box
            sx={{
              width: '48px',
              height: '24px',
              borderRadius: 'var(--radius-xxl)',
              backgroundColor: 'var(--accent-150)',
            }}
          />
        </SkeletonLoaderCardItem>
        <CustomDivider color="var(--accent-200)" />
        <SkeletonLoaderCardItem>
          <SkeletonLoaderCardCircle variant="circular" />
          <SkeletonLoaderCardText variant="rectangular" width={145} />
        </SkeletonLoaderCardItem>
        <CustomDivider color="var(--accent-200)" />
        <SkeletonLoaderCardItem>
          <SkeletonLoaderCardCircle variant="circular" />
          <SkeletonLoaderCardText variant="rectangular" width={138} />
        </SkeletonLoaderCardItem>
      </SkeletonLoaderCardItems>
    </SkeletonLoaderCardContainer>
  );
};

export default MinistryCardSkeletonLoader;
