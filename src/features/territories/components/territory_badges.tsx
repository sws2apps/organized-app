import { Box, Stack } from '@mui/material';
import Tooltip from '@components/tooltip';
import { Badge } from '@components/index';
import {
  IconAtHome,
  IconCall,
  IconRaiseHand,
  IconShoppingCart,
} from '@icons/index';
import { daysLabel } from '../helpers';
import { useAtomValue } from 'jotai';
import { territoryCategoriesState } from '@states/territories';
import {
  STATUS_COLOR,
  STATUS_LABEL,
  Territory,
  TerritoryStatus,
  TerritoryType,
  TYPE_LABEL,
} from '@definition/territory';

const TYPE_ICON: Record<TerritoryType, typeof IconAtHome> = {
  door_to_door: IconAtHome,
  business: IconShoppingCart,
  phone: IconCall,
};

export const StatusBadge = ({ status }: { status: TerritoryStatus }) => (
  <Badge
    size="small"
    color={STATUS_COLOR[status]}
    text={STATUS_LABEL[status]}
    filled={false}
  />
);

export const CoveredBadge = ({ days }: { days: number }) => {
  return (
    <Box sx={{ width: 'fit-content', flexShrink: 0 }}>
      <Badge
        size="small"
        filled={false}
        color={days > 365 ? 'red' : days > 182 ? 'orange' : 'grey'}
        text={daysLabel(days)}
      />
    </Box>
  );
};

export const RequestBadge = ({ territory }: { territory: Territory }) => {
  if (!territory.requestedBy) return null;

  return (
    <Box sx={{ width: 'fit-content', flexShrink: 0 }}>
      <Badge
        size="small"
        color="orange"
        filled={false}
        text="Requested"
        icon={<IconRaiseHand color="var(--orange-dark)" />}
      />
    </Box>
  );
};

export const CardLostBadge = ({ territory }: { territory: Territory }) => {
  if (!territory.cardLost) return null;

  return (
    <Box sx={{ width: 'fit-content', flexShrink: 0 }}>
      <Badge size="small" color="red" filled={false} text="Reprint" />
    </Box>
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
    <Stack
      direction="row"
      spacing="4px"
      sx={{ flexShrink: 0, '& > *': { width: 'fit-content' } }}
    >
      {shown.map((category) => (
        <Badge
          key={category.id}
          size="small"
          color={category.color}
          text={category.name}
          filled={false}
        />
      ))}
      {rest > 0 && (
        <Tooltip
          title={known
            .slice(max)
            .map((category) => category.name)
            .join(', ')}
        >
          <Box sx={{ width: 'fit-content' }}>
            <Badge size="small" color="grey" text={`+${rest}`} filled={false} />
          </Box>
        </Tooltip>
      )}
    </Stack>
  );
};

export const TypeIcon = ({ type }: { type: TerritoryType }) => {
  const Icon = TYPE_ICON[type];

  return (
    <Box
      aria-label={TYPE_LABEL[type]}
      sx={{ display: 'flex', flexShrink: 0, alignItems: 'center' }}
    >
      <Icon color="var(--grey-350)" width={16} height={16} />
    </Box>
  );
};
