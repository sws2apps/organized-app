import { ReactNode } from 'react';
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

const TEXT_WIDTHS = [158, 149, 151, 171, 144];

type SkeletonLoaderCardProps = {
  items: number;
  badges?: number[];
  header?: ReactNode;
};

const SkeletonLoaderCard = ({
  items,
  badges = [],
  header,
}: SkeletonLoaderCardProps) => {
  return (
    <SkeletonLoaderCardContainer className="big-card-shadow">
      <SkeletonLoaderCardTitle>
        <SkeletonLoaderCardBlueArea>
          <SkeletonLoaderCardBlueAreaRect variant="rectangular" />
        </SkeletonLoaderCardBlueArea>
      </SkeletonLoaderCardTitle>
      <SkeletonLoaderCardItems>
        {header}
        {Array.from({ length: items }, (_, index) => (
          <Box key={index}>
            <Divider color="var(--accent-200)" />
            <SkeletonLoaderCardItem>
              <SkeletonLoaderCardGroup>
                <SkeletonLoaderCardCircle variant="circular" />
                <SkeletonLoaderCardText
                  variant="rectangular"
                  width={TEXT_WIDTHS[index % TEXT_WIDTHS.length]}
                />
              </SkeletonLoaderCardGroup>
              {badges.includes(index) && (
                <Box
                  sx={{
                    width: '48px',
                    height: '24px',
                    borderRadius: 'var(--radius-xxl)',
                    backgroundColor: 'var(--accent-150)',
                  }}
                />
              )}
            </SkeletonLoaderCardItem>
          </Box>
        ))}
      </SkeletonLoaderCardItems>
    </SkeletonLoaderCardContainer>
  );
};

export default SkeletonLoaderCard;
