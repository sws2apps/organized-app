import { Box } from '@mui/material';
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

const MeetingMaterialsCardSkeletonLoader = () => {
  return (
    <SkeletonLoaderCardContainer className="big-card-shadow">
      <SkeletonLoaderCardTitle>
        <SkeletonLoaderCardBlueArea>
          <SkeletonLoaderCardBlueAreaRect variant="rectangular" />
        </SkeletonLoaderCardBlueArea>
      </SkeletonLoaderCardTitle>
      <SkeletonLoaderCardItems>
        <SkeletonLoaderCardItem>
          <SkeletonLoaderCardCircle variant="circular" />
          <SkeletonLoaderCardText variant="rectangular" width={158} />
          <Box width={11} height={20} />
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
          <SkeletonLoaderCardText variant="rectangular" width={149} />
        </SkeletonLoaderCardItem>
        <CustomDivider color="var(--accent-200)" />
        <SkeletonLoaderCardItem>
          <SkeletonLoaderCardCircle variant="circular" />
          <SkeletonLoaderCardText variant="rectangular" width={151} />
        </SkeletonLoaderCardItem>
        <CustomDivider color="var(--accent-200)" />
        <SkeletonLoaderCardItem>
          <SkeletonLoaderCardCircle variant="circular" />
          <SkeletonLoaderCardText variant="rectangular" width={171} />
        </SkeletonLoaderCardItem>
        <CustomDivider color="var(--accent-200)" />
        <SkeletonLoaderCardItem>
          <SkeletonLoaderCardCircle variant="circular" />
          <SkeletonLoaderCardText variant="rectangular" width={144} />
        </SkeletonLoaderCardItem>
      </SkeletonLoaderCardItems>
    </SkeletonLoaderCardContainer>
  );
};

export default MeetingMaterialsCardSkeletonLoader;
