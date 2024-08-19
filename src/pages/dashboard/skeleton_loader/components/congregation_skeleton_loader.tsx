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

const CongregationCardSkeletonLoader = () => {
  return (
    <SkeletonLoaderCardContainer className="big-card-shadow">
      <SkeletonLoaderCardTitle>
        <SkeletonLoaderCardBlueArea>
          <SkeletonLoaderCardBlueAreaRect variant="rectangular" />
        </SkeletonLoaderCardBlueArea>
      </SkeletonLoaderCardTitle>
      <SkeletonLoaderCardItems>
        <CustomDivider color="var(--accent-200)" />
        <SkeletonLoaderCardItem>
          <SkeletonLoaderCardCircle variant="circular" />
          <SkeletonLoaderCardText variant="rectangular" width={158} />
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

export default CongregationCardSkeletonLoader;
