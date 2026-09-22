import { Box, Stack } from '@mui/material';
import Tooltip from '@components/tooltip';
import { Badge } from '@components/index';
import { IconRaiseHand } from '@icons/index';
import { daysLabel } from '../helpers';
import { useAtomValue } from 'jotai';
import { territoryCategoriesState } from '@states/territories';
import {
  STATUS_COLOR,
  STATUS_LABEL,
  Territory,
  TerritoryStatus,
} from '@definition/territory';

export const StatusBadge = ({ status }: { status: TerritoryStatus }) => (
  <Badge
    size="small"
    color={STATUS_COLOR[status]}
    text={STATUS_LABEL[status]}
    filled={false}
    sx={{ width: 'fit-content', flexShrink: 0 }}
  />
);

export const CoveredBadge = ({ days }: { days: number }) => {
  return (
    <Badge
      size="small"
      filled={false}
      color={days > 365 ? 'red' : days > 182 ? 'orange' : 'grey'}
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
      sx={{ width: 'fit-content', flexShrink: 0 }}
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
      sx={{ width: 'fit-content', flexShrink: 0 }}
    />
  );
};

export const CategoryBadges = ({
  territory,
  max = 2,
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
    <Stack direction="row" spacing="4px" sx={{ flexShrink: 0 }}>
      {shown.map((category) => (
        <Badge
          key={category.id}
          size="small"
          color={category.color}
          text={category.name}
          filled={false}
          sx={{ width: 'fit-content' }}
        />
      ))}
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
