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
  IconCircle,
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
import { displayDate, parseDate } from '../helpers';
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
  emptyMessage?: string;
  title?: string;
  selectionBar?: ReactNode;
  layoutSwitch?: ReactNode;
};

type SortKey = 'number' | 'locality' | 'status' | 'date';

const SORTS: Record<SortKey, { label: string; directions: [string, string] }> =
  {
    number: { label: 'Number', directions: ['1 → 9', '9 → 1'] },
    locality: { label: 'Locality', directions: ['A → Z', 'Z → A'] },
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

const compare = (key: SortKey) => (a: Territory, b: Territory) => {
  const byNumber = a.number.localeCompare(b.number, undefined, {
    numeric: true,
  });

  if (key === 'locality') {
    return a.city.localeCompare(b.city) || byNumber;
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
        <IconCircle
          color="var(--green-main)"
          width={16}
          height={16}
          sx={{ '& path': { stroke: 'var(--green-main)', strokeWidth: 1.2 } }}
        />
        <Typography
          className="label-small-regular"
          color="var(--grey-400)"
          noWrap
        >
          {returned ? date(returned) : 'Never covered'}
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

const badges = (territory: Territory) => (
  <>
    <RequestBadge territory={territory} />
    <CardLostBadge territory={territory} />
    <CategoryBadges territory={territory} max={1} />
  </>
);

const Households = ({ count }: { count: number }) => (
  <Stack
    direction="row"
    spacing="2px"
    // a transform, because the column's spacing resets margins
    sx={{ alignItems: 'center', transform: 'translateX(-3px)' }}
  >
    <IconHome color="var(--grey-350)" width={16} height={16} />
    <Typography
      className="label-small-regular"
      color="var(--grey-350)"
      sx={{ fontVariantNumeric: 'tabular-nums' }}
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
  emptyMessage = 'No territories match the filters.',
  title,
  selectionBar,
  layoutSwitch,
}: TerritoryTableProps) => {
  const { tablet688Up, laptopUp } = useBreakpoints();

  const [sortBy, setSortBy] = useState<SortKey>('number');
  const [reversed, setReversed] = useState(false);

  const sorted = useMemo(() => {
    const list = [...territories].sort(compare(sortBy));
    return reversed ? list.reverse() : list;
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
        <Checkbox
          sx={{ padding: 0, margin: 0 }}
          checked={allChecked}
          indeterminate={someChecked && !allChecked}
          onChange={() => onCheckMany(sorted.map((t) => t.id))}
        />

        <Stack
          direction="row"
          sx={{ alignItems: 'center', gap: '4px', flexGrow: 1, minWidth: 0 }}
        >
          {heading}
          {sortButton}
        </Stack>

        {someChecked && selectionBar}

        {layoutSwitch}
      </Stack>

      <Stack
        spacing="4px"
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
              padding: '10px 8px',
              borderRadius: 'var(--radius-m)',
              ...rowStates(checked.has(territory.id)),
            }}
          >
            <Checkbox
              stopPropagation
              sx={{ padding: 0, margin: 0 }}
              checked={checked.has(territory.id)}
              onChange={() => onCheck(territory.id)}
            />

            {tablet688Up && (
              <Stack spacing="2px" sx={{ width: '48px', flexShrink: 0 }}>
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

                {!laptopUp && badges(territory)}
              </Stack>
            </Stack>

            {laptopUp && (
              <Stack
                direction="row"
                sx={{
                  width: '220px',
                  flexShrink: 0,
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {badges(territory)}
              </Stack>
            )}

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
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default TerritoryTable;
