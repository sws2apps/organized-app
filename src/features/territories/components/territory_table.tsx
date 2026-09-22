import { ReactNode, useMemo, useState } from 'react';
import { Box, Menu, Stack } from '@mui/material';
import MenuItem from '@components/menuitem';
import { dropdownPaper } from '@components/select/index.styles';
import IconButton from '@components/icon_button';
import {
  Checkbox,
  CustomDivider,
  InfoNote,
  Typography,
} from '@components/index';
import {
  IconTripOrigin,
  IconClock,
  IconHome,
  IconPerson,
  IconSortDown,
  IconSortUp,
} from '@icons/index';
import { useAtomValue } from 'jotai';
import Tooltip from '@components/tooltip';
import { useBreakpoints } from '@hooks/index';
import { shortDateFormatState } from '@states/settings';
import { displayDate, parseDate, emptyListMessage } from '../helpers';
import { Territory, TerritoryStatus } from '@definition/territory';
import AssignButton from './assign_button';
import { clickableRow, rowStates } from './table_styles';
import TruncatedText from './truncated_text';
import {
  CardLostBadge,
  CategoryBadges,
  RequestBadge,
} from './territory_badges';

type TerritoryTableProps = {
  territories: Territory[];
  checked: Set<string>;
  onCheck: (id: string) => void;
  onCheckMany: (ids: string[]) => void;
  onOpen: (id: string) => void;
  onOpenAssign: (id: string) => void;
  onAssign: (id: string, publisher: string) => void;
  onDecline: (id: string) => void;
  onReturn: (id: string) => void;
  showHouseholds?: boolean;
  // off on lists made only of requests, where the badge would repeat itself
  showRequested?: boolean;
  // off for publishers: no selection, no assigning; a row only opens
  actions?: boolean;
  emptyMessage?: string;
  title?: string;
  selectionBar?: ReactNode;
  layoutSwitch?: ReactNode;
};

type SortKey =
  | 'number'
  | 'locality'
  | 'person'
  | 'households'
  | 'status'
  | 'date';

const SORTS: Record<SortKey, { label: string; directions: [string, string] }> =
  {
    number: { label: 'Number', directions: ['1 → 9', '9 → 1'] },
    locality: { label: 'Locality', directions: ['A → Z', 'Z → A'] },
    person: { label: 'Person', directions: ['A → Z', 'Z → A'] },
    households: {
      label: 'Households',
      directions: ['Most first', 'Fewest first'],
    },
    status: {
      label: 'Status',
      directions: ['Overdue first', 'Available first'],
    },
    date: {
      label: 'Time out',
      directions: ['Longest first', 'Shortest first'],
    },
  };

const STATUS_WEIGHT: Record<TerritoryStatus, number> = {
  overdue: 0,
  in_work: 1,
  available: 2,
};

const time = (value?: string) => parseDate(value)?.getTime() ?? 0;

const openAssignment = (territory: Territory) =>
  territory.assignments
    .filter((assignment) => !assignment.returnedOn)
    .sort((a, b) => time(b.assignedOn) - time(a.assignedOn))
    .at(0);

const lastReturn = (territory: Territory) =>
  territory.assignments
    .map((assignment) => assignment.returnedOn)
    .filter((value): value is string => !!value)
    .sort((a, b) => time(b) - time(a))
    .at(0);

const compare =
  (key: SortKey, reversed: boolean) => (a: Territory, b: Territory) => {
    const byNumber = a.number.localeCompare(b.number, undefined, {
      numeric: true,
    });

    if (key === 'locality') {
      return a.city.localeCompare(b.city) || byNumber;
    }

    // grouped by who holds them; the free ones always come last, whichever way
    if (key === 'person') {
      if (!a.holder || !b.holder) {
        return Number(!a.holder) - Number(!b.holder) || byNumber;
      }

      const byHolder = a.holder.localeCompare(b.holder);

      return (reversed ? -byHolder : byHolder) || byNumber;
    }

    if (key === 'households') {
      return b.households - a.households || byNumber;
    }

    if (key === 'status') {
      return STATUS_WEIGHT[a.status] - STATUS_WEIGHT[b.status] || byNumber;
    }

    if (key === 'date') {
      return (b.daysOut ?? -1) - (a.daysOut ?? -1) || byNumber;
    }

    return byNumber;
  };

const StatusLine = ({ territory }: { territory: Territory }) => {
  const shortDateFormat = useAtomValue(shortDateFormatState);

  const date = (value?: string) => displayDate(value, shortDateFormat);

  if (territory.status === 'available') {
    const returned = lastReturn(territory);

    return (
      <Stack direction="row" spacing="4px" sx={{ alignItems: 'center' }}>
        <IconTripOrigin color="var(--green-main)" width={16} height={16} />
        <Typography
          className="label-small-regular"
          color="var(--grey-400)"
          noWrap
        >
          {returned ? date(returned) : 'No records'}
        </Typography>
      </Stack>
    );
  }

  const overdue = territory.status === 'overdue';
  const assigned = openAssignment(territory)?.assignedOn;

  return (
    <Stack
      direction="row"
      spacing="4px"
      sx={{ alignItems: 'center', minWidth: 0 }}
    >
      {overdue ? (
        <IconClock color="var(--red-main)" width={16} height={16} />
      ) : (
        <IconPerson color="var(--grey-400)" width={16} height={16} />
      )}
      <TruncatedText
        className="label-small-regular"
        color={overdue ? 'var(--red-main)' : 'var(--grey-400)'}
        text={[territory.holder, assigned && date(assigned)]
          .filter(Boolean)
          .join(' · ')}
      />
    </Stack>
  );
};

const badges = (territory: Territory, showRequested: boolean) => (
  <>
    {showRequested && <RequestBadge territory={territory} />}
    <CardLostBadge territory={territory} />
    <CategoryBadges territory={territory} />
  </>
);

export const Households = ({
  count,
  // --grey-350 passes on white; tinted cards pass their own colour
  color = 'var(--grey-350)',
}: {
  count: number;
  color?: string;
}) => (
  <Stack
    direction="row"
    spacing="2px"
    // the house glyph is inset 3px in its box; a transform pulls it level
    // with the number, because the column's spacing resets margins
    sx={{ alignItems: 'center', transform: 'translateX(-3px)' }}
  >
    <IconHome color={color} width={16} height={16} />
    <Typography
      className="label-small-medium"
      color={color}
      // the house is heavier at the bottom, so the digits sit 1px lower to look centred
      sx={{
        fontVariantNumeric: 'tabular-nums',
        position: 'relative',
        top: '1px',
      }}
    >
      {count}
    </Typography>
  </Stack>
);

const TerritoryTable = ({
  territories,
  checked,
  onCheck,
  onCheckMany,
  onOpen,
  onOpenAssign,
  onAssign,
  onDecline,
  onReturn,
  showHouseholds = true,
  showRequested = true,
  actions = true,
  emptyMessage = emptyListMessage(),
  title,
  selectionBar,
  layoutSwitch,
}: TerritoryTableProps) => {
  const { tablet688Up, laptopUp } = useBreakpoints();

  const [sortBy, setSortBy] = useState<SortKey>('number');
  const [reversed, setReversed] = useState(false);

  const sorted = useMemo(() => {
    const list = [...territories].sort(compare(sortBy, reversed));

    // the person sort flips only the names, so free territories stay last
    return reversed && sortBy !== 'person' ? list.reverse() : list;
  }, [territories, sortBy, reversed]);

  const [sortMenu, setSortMenu] = useState<HTMLElement | null>(null);

  const arrow = reversed ? (
    <IconSortUp color="var(--black)" width={20} height={20} />
  ) : (
    <IconSortDown color="var(--black)" width={20} height={20} />
  );

  const pickSort = (key: SortKey) => {
    if (key === sortBy) {
      setReversed(!reversed);
    } else {
      setSortBy(key);
      setReversed(false);
    }

    setSortMenu(null);
  };

  const sortButton = (
    <>
      <Tooltip
        title={`${SORTS[sortBy].label} · ${SORTS[sortBy].directions[reversed ? 1 : 0]}`}
      >
        <IconButton
          aria-label="Sort"
          onClick={(event) => setSortMenu(event.currentTarget)}
          sx={{ padding: '6px', margin: 0, borderRadius: 'var(--radius-m)' }}
        >
          {arrow}
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={sortMenu}
        open={!!sortMenu}
        onClose={() => setSortMenu(null)}
        disableScrollLock
        slotProps={{
          paper: { sx: dropdownPaper, className: 'small-card-shadow' },
        }}
      >
        {(Object.keys(SORTS) as SortKey[]).map((key) => (
          <MenuItem
            key={key}
            selected={key === sortBy}
            onClick={() => pickSort(key)}
            sx={{
              '&.Mui-selected svg path': { fill: 'var(--accent-main)' },
              '&:hover svg path': { fill: 'var(--accent-dark)' },
            }}
          >
            <Stack
              direction="row"
              sx={{ alignItems: 'center', gap: '12px', width: '100%' }}
            >
              <Typography className="body-regular" sx={{ flexGrow: 1 }}>
                {SORTS[key].label}
              </Typography>
              {key === sortBy && arrow}
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </>
  );

  const allChecked =
    sorted.length > 0 && sorted.every((territory) => checked.has(territory.id));

  const someChecked = sorted.some((territory) => checked.has(territory.id));

  const heading = title && (
    <Typography className="h3" noWrap>
      {title}
    </Typography>
  );

  if (territories.length === 0) {
    return (
      <Stack spacing="16px" sx={{ paddingTop: '16px' }}>
        {heading}
        <InfoNote message={emptyMessage} />
      </Stack>
    );
  }

  return (
    <Stack spacing="4px">
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '12px 8px 8px',
        }}
      >
        {actions && (
          <Checkbox
            sx={{ padding: 0, margin: 0 }}
            checked={allChecked}
            indeterminate={someChecked && !allChecked}
            onChange={() => onCheckMany(sorted.map((t) => t.id))}
          />
        )}

        <Stack
          direction="row"
          sx={{ alignItems: 'center', gap: '4px', flexGrow: 1, minWidth: 0 }}
        >
          {heading}
          {sortButton}
        </Stack>

        {actions && someChecked && selectionBar}

        {layoutSwitch}
      </Stack>

      <Stack
        spacing="2px"
        divider={<CustomDivider color="var(--accent-200)" />}
      >
        {sorted.map((territory) => (
          <Stack
            key={territory.id}
            direction="row"
            spacing="12px"
            {...clickableRow(() => onOpen(territory.id))}
            sx={{
              alignItems: 'center',
              padding: '8px',
              borderRadius: 'var(--radius-m)',
              ...rowStates(checked.has(territory.id)),
            }}
          >
            {actions && (
              <Checkbox
                stopPropagation
                sx={{ padding: 0, margin: 0 }}
                checked={checked.has(territory.id)}
                onChange={() => onCheck(territory.id)}
              />
            )}

            {tablet688Up && (
              // same line gap as the name column, so both lines sit level with it
              <Stack spacing="4px" sx={{ width: '48px', flexShrink: 0 }}>
                <Typography
                  className="body-small-semibold"
                  color="var(--black)"
                  sx={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {territory.number}
                </Typography>
                {showHouseholds && <Households count={territory.households} />}
              </Stack>
            )}

            <Stack spacing="4px" sx={{ flexGrow: 1, minWidth: 0 }}>
              <TruncatedText
                className="body-small-semibold"
                text={[
                  !tablet688Up && territory.number,
                  [territory.city, territory.name].filter(Boolean).join(' • '),
                ]
                  .filter(Boolean)
                  .join('  ')}
              />

              <Stack
                direction="row"
                sx={{
                  alignItems: 'center',
                  gap: '4px 12px',
                  flexWrap: 'wrap',
                  minWidth: 0,
                }}
              >
                <StatusLine territory={territory} />

                {showHouseholds && !tablet688Up && (
                  <Households count={territory.households} />
                )}

                {!laptopUp && badges(territory, showRequested)}
              </Stack>
            </Stack>

            {laptopUp && (
              <Stack
                direction="row"
                sx={{
                  width: '220px',
                  flexShrink: 0,
                  alignItems: 'center',
                  gap: '4px',
                  overflow: 'hidden',
                }}
              >
                {badges(territory, showRequested)}
              </Stack>
            )}

            {actions && (
              <Box sx={{ flexShrink: 0 }}>
                <AssignButton
                  territory={territory}
                  onOpenAssign={onOpenAssign}
                  onAssign={onAssign}
                  onDecline={onDecline}
                  onReturn={onReturn}
                  compact={!tablet688Up}
                />
              </Box>
            )}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default TerritoryTable;
