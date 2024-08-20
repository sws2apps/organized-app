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

const ReportCardSkeletonLoader = () => {
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
            <SkeletonLoaderCardText variant="rectangular" width={121} />
          </SkeletonLoaderCardGroup>
        </SkeletonLoaderCardItem>
        <Divider color="var(--accent-200)" />
        <SkeletonLoaderCardItem>
          <SkeletonLoaderCardGroup>
            <SkeletonLoaderCardCircle variant="circular" />
            <SkeletonLoaderCardText variant="rectangular" width={128} />
          </SkeletonLoaderCardGroup>
        </SkeletonLoaderCardItem>
        <Divider color="var(--accent-200)" />
        <SkeletonLoaderCardItem>
          <SkeletonLoaderCardGroup>
            <SkeletonLoaderCardCircle variant="circular" />
            <SkeletonLoaderCardText variant="rectangular" width={191} />
          </SkeletonLoaderCardGroup>
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
            <SkeletonLoaderCardText variant="rectangular" width={171} />
          </SkeletonLoaderCardGroup>
        </SkeletonLoaderCardItem>
      </SkeletonLoaderCardItems>
    </SkeletonLoaderCardContainer>
  );
};

export default ReportCardSkeletonLoader;
