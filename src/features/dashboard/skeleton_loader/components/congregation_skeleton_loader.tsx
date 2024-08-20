import {
  SkeletonLoaderCardBlueArea,
  SkeletonLoaderCardBlueAreaRect,
  SkeletonLoaderCardCircle,
  SkeletonLoaderCardContainer,
  SkeletonLoaderCardGroup,
  SkeletonLoaderCardItem,
  SkeletonLoaderCardItems,
  SkeletonLoaderCardText,
  SkeletonLoaderCardTitle,
} from './index.styled';
import Divider from '@components/divider';

const CongregationCardSkeletonLoader = () => {
  return (
    <SkeletonLoaderCardContainer className="big-card-shadow">
      <SkeletonLoaderCardTitle>
        <SkeletonLoaderCardBlueArea>
          <SkeletonLoaderCardBlueAreaRect variant="rectangular" />
        </SkeletonLoaderCardBlueArea>
      </SkeletonLoaderCardTitle>
      <SkeletonLoaderCardItems>
        <Divider color="var(--accent-200)" />
        <SkeletonLoaderCardItem>
          <SkeletonLoaderCardGroup>
            <SkeletonLoaderCardCircle variant="circular" />
            <SkeletonLoaderCardText variant="rectangular" width={158} />
          </SkeletonLoaderCardGroup>
        </SkeletonLoaderCardItem>
        <Divider color="var(--accent-200)" />
        <SkeletonLoaderCardItem>
          <SkeletonLoaderCardGroup>
            <SkeletonLoaderCardCircle variant="circular" />
            <SkeletonLoaderCardText variant="rectangular" width={149} />
          </SkeletonLoaderCardGroup>
        </SkeletonLoaderCardItem>
        <Divider color="var(--accent-200)" />
        <SkeletonLoaderCardItem>
          <SkeletonLoaderCardGroup>
            <SkeletonLoaderCardCircle variant="circular" />
            <SkeletonLoaderCardText variant="rectangular" width={151} />
          </SkeletonLoaderCardGroup>
        </SkeletonLoaderCardItem>
        <Divider color="var(--accent-200)" />
        <SkeletonLoaderCardItem>
          <SkeletonLoaderCardGroup>
            <SkeletonLoaderCardCircle variant="circular" />
            <SkeletonLoaderCardText variant="rectangular" width={171} />
          </SkeletonLoaderCardGroup>
        </SkeletonLoaderCardItem>
        <Divider color="var(--accent-200)" />
        <SkeletonLoaderCardItem>
          <SkeletonLoaderCardGroup>
            <SkeletonLoaderCardCircle variant="circular" />
            <SkeletonLoaderCardText variant="rectangular" width={144} />
          </SkeletonLoaderCardGroup>
        </SkeletonLoaderCardItem>
      </SkeletonLoaderCardItems>
    </SkeletonLoaderCardContainer>
  );
};

export default CongregationCardSkeletonLoader;
