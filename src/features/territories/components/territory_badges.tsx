import { Box, Stack } from '@mui/material';
import Tooltip from '@components/tooltip';
import { Badge } from '@components/index';
import { IconRaiseHand } from '@icons/index';
import { daysLabel } from '../helpers';
import { categoryBadge } from '../category_colors';
import { useAtomValue } from 'jotai';
import { territoryCategoriesState } from '@states/territories';
import {
  STATUS_COLOR,
  STATUS_LABEL,
  Territory,
  TerritoryStatus,
} from '@definition/territory';

// in a tight row a badge shortens its text instead of dropping out of view;
// long names give up their space first, so short ones stay readable
const shrink = (text: string) => ({
  flexShrink: text.length > 8 ? text.length : 0.1,
  minWidth: '28px',
  overflow: 'hidden',
  '& > div': { minWidth: 0 },
  '& p': {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

export const StatusBadge = ({ status }: { status: TerritoryStatus }) => (
  <Badge
    size="small"
    color={STATUS_COLOR[status]}
    text={STATUS_LABEL[status]}
    filled={false}
    sx={{ width: 'fit-content', flexShrink: 0 }}
  />
);

const coveredColor = (days: number) => {
  if (days > 365) return 'red';
  if (days > 182) return 'orange';
  return 'grey';
};

export const CoveredBadge = ({ days }: { days: number }) => {
  return (
    <Badge
      size="small"
      filled={false}
      color={coveredColor(days)}
      text={daysLabel(days)}
      sx={{ width: 'fit-content', flexShrink: 0 }}
    />
  );
};

export const RequestBadge = ({ territory }: { territory: Territory }) => {
  if (!territory.requestedBy) return null;

  return (
    <Badge
      size="small"
      color="orange"
      filled={false}
      text="Requested"
      icon={<IconRaiseHand color="var(--orange-dark)" />}
      sx={{ width: 'fit-content', ...shrink('Requested') }}
    />
  );
};

export const CardLostBadge = ({ territory }: { territory: Territory }) => {
  if (!territory.cardLost) return null;

  return (
    <Badge
      size="small"
      color="red"
      filled={false}
      text="Reprint"
      sx={{ width: 'fit-content', ...shrink('Reprint') }}
    />
  );
};

export const CategoryBadges = ({
  territory,
  max = Infinity,
}: {
  territory: Territory;
  max?: number;
}) => {
  const categories = useAtomValue(territoryCategoriesState);

  const known = categories.filter((category) =>
    territory.categories.includes(category.id)
  );

  if (known.length === 0) return null;

  const shown = known.slice(0, max);
  const rest = known.length - shown.length;

  return (
    <Stack
      direction="row"
      spacing="4px"
      sx={{ flexShrink: 1, minWidth: 0, overflow: 'hidden' }}
    >
      {shown.map((category) => {
        const badge = categoryBadge(category.color);

        return (
          <Badge
            key={category.id}
            size="small"
            color={badge.color}
            text={category.name}
            filled={false}
            sx={{
              width: 'fit-content',
              ...shrink(category.name),
              ...badge.sx,
            }}
          />
        );
      })}
      {rest > 0 && (
        <Tooltip
          title={known
            .slice(max)
            .map((category) => category.name)
            .join(', ')}
        >
          {/* the tooltip needs a DOM child to anchor to */}
          <Box sx={{ width: 'fit-content' }}>
            <Badge size="small" color="grey" text={`+${rest}`} filled={false} />
          </Box>
        </Tooltip>
      )}
    </Stack>
  );
};
