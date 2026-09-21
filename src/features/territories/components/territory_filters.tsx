import { ReactNode } from 'react';
import { Box, Stack } from '@mui/material';
import { Badge, FilterChip, Typography } from '@components/index';
import { useAtomValue } from 'jotai';
import { territoryCategoriesState } from '@states/territories';
import {
  STATUS_LABEL,
  TerritoryFilters as Filters,
  TerritoryStatus,
  TerritoryType,
  TYPE_LABEL,
} from '@definition/territory';
import { COVERAGE_PERIODS, EMPTY_FILTERS } from '../helpers';

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
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
}) => {
  const categories = useAtomValue(territoryCategoriesState);

  const periods = COVERAGE_PERIODS();

  const toggleCoverage = (covered: boolean, period: string) => {
    const same =
      filters.coverage?.covered === covered &&
      filters.coverage?.period === period;

    onChange({ ...filters, coverage: same ? undefined : { covered, period } });
  };

  const applied =
    filters.status.length +
    filters.type.length +
    filters.categories.length +
    (filters.coverage ? 1 : 0) +
    (filters.cardLostOnly ? 1 : 0);

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
      <Stack direction="row" spacing="12px" sx={{ alignItems: 'center' }}>
        <Typography className="body-small-semibold" color="var(--black)">
          Filters
        </Typography>
        {applied > 0 && (
          <>
            <Box sx={{ width: 'fit-content' }}>
              <Badge
                size="small"
                filled={false}
                color="accent"
                text={`Applied: ${applied}`}
              />
            </Box>
            <Box
              onClick={() =>
                onChange({ ...EMPTY_FILTERS, search: filters.search })
              }
              sx={{ cursor: 'pointer' }}
            >
              <Typography
                className="label-small-medium"
                color="var(--accent-main)"
              >
                Clear all
              </Typography>
            </Box>
          </>
        )}
      </Stack>

      <Group label="Assignment">
        {(Object.keys(STATUS_LABEL) as TerritoryStatus[]).map((status) => (
          <FilterChip
            key={status}
            label={STATUS_LABEL[status]}
            selected={filters.status.includes(status)}
            onClick={() => toggle('status', status)}
          />
        ))}
      </Group>

      <Group label="Type">
        {(Object.keys(TYPE_LABEL) as TerritoryType[]).map((type) => (
          <FilterChip
            key={type}
            label={TYPE_LABEL[type]}
            selected={filters.type.includes(type)}
            onClick={() => toggle('type', type)}
          />
        ))}
      </Group>

      <Group label="Categories">
        {categories.map((category) => (
          <FilterChip
            key={category.id}
            label={category.name}
            selected={filters.categories.includes(category.id)}
            onClick={() => toggle('categories', category.id)}
          />
        ))}
      </Group>

      <Group label="Card">
        <FilterChip
          label="Lost"
          selected={filters.cardLostOnly}
          onClick={() =>
            onChange({ ...filters, cardLostOnly: !filters.cardLostOnly })
          }
        />
      </Group>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Typography className="body-small-semibold" color="var(--black)">
          Work status
        </Typography>

        {[true, false].map((covered) => (
          <Group
            key={String(covered)}
            label={covered ? 'Covered' : 'Not covered'}
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
      </Box>
    </Box>
  );
};

export default TerritoryFilters;
