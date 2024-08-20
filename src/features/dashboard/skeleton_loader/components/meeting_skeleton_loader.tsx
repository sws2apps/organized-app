import { Box } from '@mui/material';
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

const MeetingCardSkeletonLoader = () => {
  return (
    <SkeletonLoaderCardContainer className="big-card-shadow">
      <SkeletonLoaderCardTitle>
        <SkeletonLoaderCardBlueArea>
          <SkeletonLoaderCardBlueAreaRect variant="rectangular" />
        </SkeletonLoaderCardBlueArea>
      </SkeletonLoaderCardTitle>
      <SkeletonLoaderCardItems>
        <SkeletonLoaderCardItem>
          <SkeletonLoaderCardGroup>
            <SkeletonLoaderCardCircle variant="circular" />
            <SkeletonLoaderCardText variant="rectangular" width={158} />
          </SkeletonLoaderCardGroup>
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

export default MeetingCardSkeletonLoader;
