import { useAppTranslation } from '@hooks/index';
import { ReactNode } from 'react';
import { Box, Stack } from '@mui/material';
import { Badge, Button, FilterChip, Typography } from '@components/index';
import { useAtomValue } from 'jotai';
import { territoryCategoriesState } from '@states/territories';
import {
  AssignmentCard,
  CARD_LABEL,
  STATUS_LABEL,
  TerritoryFilters as Filters,
  TerritoryStatus,
  TerritoryType,
  TYPE_LABEL,
} from '@definition/territory';
import {
  appliedFilters,
  clearedFilters,
  COVERAGE_PERIODS,
} from '@features/territories/helpers';
import CampaignChips from '@features/territories/components/campaign_chips';

const Group = ({ label, children }: { label: string; children: ReactNode }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
    <Typography className="body-small-regular" color="var(--grey-400)">
      {label}
    </Typography>
    <Stack direction="row" sx={{ flexWrap: 'wrap', gap: '8px' }}>
      {children}
    </Stack>
  </Box>
);

const TerritoryFilters = ({
  filters,
  onChange,
  showTitle = true,
  showClear = true,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  showTitle?: boolean;
  // off where the page puts its own clear button next to its main action
  showClear?: boolean;
}) => {
  const { t } = useAppTranslation();

  const categories = useAtomValue(territoryCategoriesState);

  const periods = COVERAGE_PERIODS();

  const toggleCoverage = (covered: boolean, period: string) => {
    const same =
      filters.coverage?.covered === covered &&
      filters.coverage?.period === period;

    onChange({ ...filters, coverage: same ? undefined : { covered, period } });
  };

  const applied = appliedFilters(filters);

  const toggle = <T extends string>(key: keyof Filters, value: T) => {
    const current = filters[key] as T[];

    onChange({
      ...filters,
      [key]: current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* always shown, starting at 0, so picking a filter doesn't shift the list */}
      <Stack direction="row" spacing="12px" sx={{ alignItems: 'center' }}>
        {showTitle && (
          <Typography className="body-small-semibold" color="var(--black)">
            {t('tr_filters')}
          </Typography>
        )}
        <Badge
          size="small"
          filled={false}
          color={applied > 0 ? 'accent' : 'grey'}
          text={t('tr_territoryApplied', { n: applied })}
          sx={{ width: 'fit-content' }}
        />
      </Stack>

      <Group label={t('tr_assignment')}>
        {(Object.keys(STATUS_LABEL) as TerritoryStatus[]).map((status) => (
          <FilterChip
            key={status}
            label={t(STATUS_LABEL[status])}
            selected={filters.status.includes(status)}
            onClick={() => toggle('status', status)}
          />
        ))}
        {(Object.keys(CARD_LABEL) as AssignmentCard[]).map((card) => (
          <FilterChip
            key={card}
            label={t(CARD_LABEL[card])}
            selected={filters.card.includes(card)}
            onClick={() => toggle('card', card)}
          />
        ))}
        <FilterChip
          label={t('tr_territoryOutForGroups')}
          selected={!!filters.forGroups}
          onClick={() =>
            onChange({ ...filters, forGroups: !filters.forGroups || undefined })
          }
        />
      </Group>

      <Group label={t('tr_type')}>
        {(Object.keys(TYPE_LABEL) as TerritoryType[]).map((type) => (
          <FilterChip
            key={type}
            label={t(TYPE_LABEL[type])}
            selected={filters.type.includes(type)}
            onClick={() => toggle('type', type)}
          />
        ))}
      </Group>

      <Group label={t('tr_categories')}>
        {categories.map((category) => (
          <FilterChip
            key={category.id}
            label={category.name}
            selected={filters.categories.includes(category.id)}
            onClick={() => toggle('categories', category.id)}
          />
        ))}
      </Group>

      <Group label={t('tr_territoryCard')}>
        <FilterChip
          label={t('tr_territoryLost')}
          selected={filters.cardLostOnly}
          onClick={() =>
            onChange({ ...filters, cardLostOnly: !filters.cardLostOnly })
          }
        />
      </Group>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Typography className="body-small-semibold" color="var(--black)">
          {t('tr_territoryWorkStatus')}
        </Typography>

        {[true, false].map((covered) => (
          <Group
            key={String(covered)}
            label={
              covered ? t('tr_territoryCovered') : t('tr_territoryNotCovered')
            }
          >
            {periods.map((period) => (
              <FilterChip
                key={period.id}
                label={period.label}
                selected={
                  filters.coverage?.covered === covered &&
                  filters.coverage?.period === period.id
                }
                onClick={() => toggleCoverage(covered, period.id)}
              />
            ))}
          </Group>
        ))}

        <CampaignChips filters={filters} onChange={onChange} />
      </Box>

      {showClear && (
        <Button
          variant="secondary"
          disabled={applied === 0}
          onClick={() => onChange(clearedFilters(filters))}
        >
          {t('tr_clearAll')}
        </Button>
      )}
    </Box>
  );
};

export default TerritoryFilters;
