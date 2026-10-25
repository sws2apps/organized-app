import {
  ReactNode,
  memo,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import usePhoneSelection from '@features/territories/components/usePhoneSelection';
import { Box, Menu, Stack } from '@mui/material';
import MenuItem from '@components/menuitem';
import { dropdownPaper } from '@components/select/index.styles';
import IconButton from '@components/icon_button';
import { Button, Checkbox, InfoNote, Typography } from '@components/index';
import {
  IconClock,
  IconHome,
  IconPerson,
  IconCheck,
  IconSortDown,
  IconSortUp,
} from '@icons/index';
import { useAtomValue } from 'jotai';
import Tooltip from '@components/tooltip';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { shortDateFormatState } from '@states/settings';
import {
  displayDate,
  parseDate,
  emptyListMessage,
} from '@features/territories/helpers';
import useTerritoryAccess from '@features/territories/useTerritoryAccess';
import { isCoverage } from '@features/territories/coverage_rate';
import { territoryCampaignsState } from '@features/territories/campaigns';
import { campaignEnded } from '@features/territories/campaign_filter';
import {
  STATUS_LABEL,
  Territory,
  TerritoryStatus,
} from '@definition/territory';
import AssignButton from '@features/territories/components/assign_button';
import {
  clickableRow,
  rowStates,
} from '@features/territories/components/table_styles';
import TruncatedText from '@features/territories/components/truncated_text';
import {
  AssignedTwiceBadge,
  CardLostBadge,
  CategoryBadges,
  ListDoNotCallBadge as DoNotCallBadge,
  NewNoteBadge,
  RequestBadge,
} from '@features/territories/components/territory_badges';
import { territoryHolderText } from '@features/territories/group_holder';

type TerritoryTableProps = {
  territories: Territory[];
  checked: Set<string>;
  onCheck: (id: string) => void;
  onCheckMany: (ids: string[]) => void;
  onOpen: (id: string) => void;
  onOpenAssign: (id: string) => void;
  onDecline: (id: string) => void;
  onReturn: (id: string) => void;
  showHouseholds?: boolean;
  // off on lists made only of requests, where the badge would repeat itself
  showRequested?: boolean;
  // off for publishers: no selection, no assigning; a row only opens
  actions?: boolean;
  // publishers see whether a territory is free, not who is working it
  showHolder?: boolean;
  // like the details page: elders see every count, a publisher only on their own
  showDoNotCalls?: boolean;
  emptyMessage?: string;
  title?: string;
  // first thing in its card: titled like the other cards, not like a list under tabs
  titleOnTop?: boolean;
  selectionBar?: ReactNode;
  layoutSwitch?: ReactNode;
  selecting?: boolean;
  onSelectingChange?: (value: boolean) => void;
  // every territory the list can show across its tabs and filters; they stay
  // built and only the ones in `territories` are shown
  pool?: Territory[];
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
    number: {
      label: 'tr_number',
      directions: ['tr_territory19', 'tr_territory91'],
    },
    locality: {
      label: 'tr_territoryLocality',
      directions: ['tr_territoryAZ', 'tr_territoryZA'],
    },
    person: {
      label: 'tr_person',
      directions: ['tr_territoryAZ', 'tr_territoryZA'],
    },
    households: {
      label: 'tr_territoryHouseholds',
      directions: ['tr_territoryMostFirst', 'tr_territoryFewestFirst'],
    },
    status: {
      label: 'tr_territoryStatus',
      directions: ['tr_territoryOverdueFirst', 'tr_territoryAvailableFirst'],
    },
    date: {
      label: 'tr_territoryTimeOut',
      directions: ['tr_territoryLongestFirst', 'tr_territoryShortestFirst'],
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
    .filter(isCoverage)
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
      const [holderA, holderB] = [a, b].map(territoryHolderText);
      if (!holderA || !holderB) {
        return Number(!holderA) - Number(!holderB) || byNumber;
      }

      const byHolder = holderA.localeCompare(holderB);

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

const StatusLine = ({
  territory,
  showHolder = true,
}: {
  territory: Territory;
  showHolder?: boolean;
}) => {
  const { t } = useAppTranslation();

  const shortDateFormat = useAtomValue(shortDateFormatState);
  const campaigns = useAtomValue(territoryCampaignsState);

  const date = (value?: string) => displayDate(value, shortDateFormat);

  if (territory.status === 'available') {
    const returned = lastReturn(territory);

    return (
      <Stack direction="row" spacing="4px" sx={{ alignItems: 'center' }}>
        <IconCheck color="var(--green-main)" width={16} height={16} />
        <Typography
          className="label-small-regular"
          color="var(--green-main)"
          noWrap
        >
          {returned ? date(returned) : t('tr_territoryNeverCovered')}
        </Typography>
      </Stack>
    );
  }

  const overdue = territory.status === 'overdue';
  const open = openAssignment(territory);
  const assigned = open?.assignedOn;

  // the holder's own row asks for the territory back once its campaign is over
  const status =
    open && campaignEnded(open, campaigns)
      ? t('tr_territoryCampaignOverPleaseReturn')
      : t(STATUS_LABEL[territory.status]);

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
        text={[
          showHolder ? territoryHolderText(territory) : status,
          assigned && date(assigned),
        ]
          .filter(Boolean)
          .join(' · ')}
      />
    </Stack>
  );
};

// they wrap onto another line rather than cut their names short
const badges = (
  territory: Territory,
  showRequested: boolean,
  showDoNotCalls: boolean,
  me: string,
  withDoNotCalls = true
) => (
  <>
    {withDoNotCalls && (showDoNotCalls || territory.holder === me) && (
      <DoNotCallBadge territory={territory} />
    )}
    {showRequested && <RequestBadge territory={territory} />}
    {showDoNotCalls && <NewNoteBadge territory={territory} />}
    <AssignedTwiceBadge territory={territory} />
    <CardLostBadge territory={territory} />
    <CategoryBadges territory={territory} wrap />
  </>
);

const BADGE_ROW = {
  alignItems: 'center',
  gap: '4px',
  flexWrap: 'wrap',
  minWidth: 0,
} as const;

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

type RowView = {
  phone: boolean;
  tablet688Up: boolean;
  laptopUp: boolean;
  actions: boolean;
  showCheckboxes: boolean;
  showHouseholds: boolean;
  showHolder: boolean;
  showRequested: boolean;
  showDoNotCalls: boolean;
  pressable: boolean;
  me: string;
};

type RowApi = {
  click: (id: string) => void;
  check: (id: string) => void;
  openAssign: (id: string) => void;
  decline: (id: string) => void;
  return: (id: string) => void;
  press: (id: string) => Record<string, (event: never) => void>;
};

const PRESS_EVENTS = [
  'onPointerDown',
  'onPointerMove',
  'onPointerUp',
  'onPointerCancel',
  'onPointerLeave',
  'onContextMenu',
];

// a row renders again only when its own territory, check or the layout changes
const Row = memo(function Row({
  territory,
  checked,
  view,
  api,
}: {
  territory: Territory;
  checked: boolean;
  view: RowView;
  api: RowApi;
}) {
  const {
    phone,
    tablet688Up,
    laptopUp,
    actions,
    showCheckboxes,
    showHouseholds,
    showHolder,
    showRequested,
    showDoNotCalls,
    pressable,
    me,
  } = view;
  const selectionGap = tablet688Up ? '12px' : '8px';
  const selectionSlot = {
    display: 'grid',
    gridTemplateColumns: showCheckboxes ? '1fr' : '0fr',
    opacity: showCheckboxes ? 1 : 0,
    marginRight: showCheckboxes ? selectionGap : 0,
    transition:
      'grid-template-columns 150ms ease, opacity 150ms ease, margin-right 150ms ease',
    '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
  };

  return (
    <Stack
      direction="row"
      // tighter on a phone, where every pixel goes to the name
      spacing={tablet688Up ? '12px' : '8px'}
      {...clickableRow(() => api.click(territory.id))}
      {...(pressable && api.press(territory.id))}
      sx={{
        alignItems: 'center',
        padding: '8px',
        borderRadius: 'var(--radius-m)',
        ...rowStates(checked),
        ...(phone &&
          actions && { userSelect: 'none', WebkitTouchCallout: 'none' }),
      }}
    >
      {actions && (
        <Box
          sx={{
            ...selectionSlot,
            '&&': { marginLeft: 0 },
            flexShrink: 0,
          }}
          aria-hidden={!showCheckboxes}
        >
          <Box sx={{ overflow: 'hidden', minWidth: 0 }}>
            <Checkbox
              stopPropagation
              disabled={!showCheckboxes}
              sx={{ padding: 0, margin: 0 }}
              checked={checked}
              onChange={() => api.check(territory.id)}
            />
          </Box>
        </Box>
      )}

      {/* Compact personal lists share the history layout on phones. */}
      {(tablet688Up || actions) && (
        <Stack
          spacing="4px"
          sx={{
            width: tablet688Up ? '48px' : '40px',
            flexShrink: 0,
            ...(actions && { '&&': { marginLeft: 0 } }),
          }}
        >
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
            !tablet688Up && !actions && territory.number,
            [territory.city, territory.name].filter(Boolean).join(' • '),
          ]
            .filter(Boolean)
            .join(' ')}
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
          {!tablet688Up && !actions && showHouseholds && (
            <Households count={territory.households} />
          )}
          <StatusLine territory={territory} showHolder={showHolder} />

          {!laptopUp && (
            <Stack direction="row" sx={BADGE_ROW}>
              {badges(territory, showRequested, showDoNotCalls, me)}
            </Stack>
          )}
        </Stack>
      </Stack>

      {laptopUp && (
        <Stack
          direction="row"
          sx={{ ...BADGE_ROW, flexShrink: 0, maxWidth: '45%' }}
        >
          {badges(territory, showRequested, showDoNotCalls, me, false)}
        </Stack>
      )}

      {/* on a wide screen the do-not-calls keep a column of their own,
            and the action sits at the far end of a fixed one, so both line up row by row */}
      {laptopUp && (
        <Box
          sx={{
            flexShrink: 0,
            width: '56px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          {(showDoNotCalls || territory.holder === me) && (
            <DoNotCallBadge territory={territory} />
          )}
        </Box>
      )}

      {actions && (
        <Box
          sx={{
            flexShrink: 0,
            ...(laptopUp && {
              minWidth: '176px',
              display: 'flex',
              justifyContent: 'flex-end',
            }),
          }}
        >
          <AssignButton
            territory={territory}
            onOpenAssign={api.openAssign}
            onDecline={api.decline}
            onReturn={api.return}
            compact={!tablet688Up}
          />
        </Box>
      )}
    </Stack>
  );
});

const PhoneSelectionControls = ({
  actions,
  phone,
  selectionMode,
  count,
  onChange,
}: {
  actions: boolean;
  phone: boolean;
  selectionMode: boolean;
  count: number;
  onChange?: (selecting: boolean) => void;
}) => {
  const { t } = useAppTranslation();
  return (
    <>
      {' '}
      {actions && phone && !selectionMode && (
        <Button
          variant="small"
          disableAutoStretch
          onClick={() => onChange?.(true)}
          ariaLabel={t('tr_territorySelectTerritories')}
        >
          {t('tr_territorySelect')}
        </Button>
      )}
      {actions && phone && selectionMode && count === 0 && (
        <Button
          variant="small"
          disableAutoStretch
          onClick={() => onChange?.(false)}
        >
          {t('tr_cancel')}
        </Button>
      )}
    </>
  );
};

const TableHeading = ({
  title,
  actions,
  subHeading,
  phone,
  count,
}: {
  title?: string;
  actions: boolean;
  subHeading: boolean;
  phone: boolean;
  count: number;
}) => {
  const { t } = useAppTranslation();
  if (!title) return null;
  return (
    <Typography
      component={actions ? 'div' : 'h2'}
      className={subHeading ? 'h3' : 'h2'}
      noWrap={actions}
    >
      {phone && count > 0 ? t('tr_territorySelected', { n: count }) : title}
    </Typography>
  );
};

const TerritoryTable = ({
  territories,
  checked,
  onCheck,
  onCheckMany,
  onOpen,
  onOpenAssign,
  onDecline,
  onReturn,
  showHouseholds = true,
  showRequested = true,
  actions = true,
  showHolder = true,
  showDoNotCalls = false,
  emptyMessage = emptyListMessage(),
  title,
  titleOnTop = false,
  selectionBar,
  layoutSwitch,
  selecting = false,
  onSelectingChange,
  pool,
}: TerritoryTableProps) => {
  const { t } = useAppTranslation();

  const { tablet688Up, tablet600Up, laptopUp } = useBreakpoints();
  const phone = !tablet600Up;
  const selectionMode = selecting || checked.size > 0;
  const showCheckboxes = !phone || selectionMode;
  const pressable = phone && actions;
  const longPress = usePhoneSelection(pressable, (id) => {
    if (!latest.current.checked.has(id)) latest.current.onCheck(id);
  });

  const { publisher: me } = useTerritoryAccess();

  // the rows get stable callbacks that reach the newest props, so a parent
  // render alone does not render all of them again
  const latest = useRef({
    checked,
    onCheck,
    onOpen,
    onOpenAssign,
    onDecline,
    onReturn,
    longPress,
    pressable,
    selectionMode,
  });
  useLayoutEffect(() => {
    latest.current = {
      checked,
      onCheck,
      onOpen,
      onOpenAssign,
      onDecline,
      onReturn,
      longPress,
      pressable,
      selectionMode,
    };
  });

  const api = useMemo<RowApi>(
    () => ({
      click: (id) => {
        const now = latest.current;
        if (now.longPress.consumeClick(id)) return;
        if (now.pressable && now.selectionMode) now.onCheck(id);
        else now.onOpen(id);
      },
      check: (id) => latest.current.onCheck(id),
      openAssign: (id) => latest.current.onOpenAssign(id),
      decline: (id) => latest.current.onDecline(id),
      return: (id) => latest.current.onReturn(id),
      press: (id) =>
        Object.fromEntries(
          PRESS_EVENTS.map((name) => [
            name,
            (event: never) =>
              (
                latest.current.longPress.handlers(id) as Record<
                  string,
                  ((event: never) => void) | undefined
                >
              )[name]?.(event),
          ])
        ),
    }),
    []
  );

  const view = useMemo<RowView>(
    () => ({
      phone,
      tablet688Up,
      laptopUp,
      actions,
      showCheckboxes,
      showHouseholds,
      showHolder,
      showRequested,
      showDoNotCalls,
      pressable,
      me,
    }),
    [
      phone,
      tablet688Up,
      laptopUp,
      actions,
      showCheckboxes,
      showHouseholds,
      showHolder,
      showRequested,
      showDoNotCalls,
      pressable,
      me,
    ]
  );

  const [sortBy, setSortBy] = useState<SortKey>('number');
  const [reversed, setReversed] = useState(false);

  const sortedRows = useMemo(() => {
    const list = [...(pool ?? territories)].sort(compare(sortBy, reversed));

    // the person sort flips only the names, so free territories stay last
    return reversed && sortBy !== 'person' ? list.reverse() : list;
  }, [pool, territories, sortBy, reversed]);

  const visibleIds = useMemo(
    () => new Set(territories.map((territory) => territory.id)),
    [territories]
  );

  const sorted = useMemo(
    () => sortedRows.filter((territory) => visibleIds.has(territory.id)),
    [sortedRows, visibleIds]
  );

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
        title={`${t(SORTS[sortBy].label)} · ${t(SORTS[sortBy].directions[reversed ? 1 : 0])}`}
      >
        <IconButton
          aria-label={t('tr_territorySort')}
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
                {t(SORTS[key].label)}
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

  const subHeading = actions && !titleOnTop;

  const heading = (
    <TableHeading
      title={title}
      actions={actions}
      subHeading={subHeading}
      phone={phone}
      count={checked.size}
    />
  );

  if (territories.length === 0 && !pool) {
    return (
      <Stack spacing="12px" sx={{ paddingTop: subHeading ? '16px' : 0 }}>
        {heading}
        {actions && selectionBar}
        <InfoNote message={emptyMessage} />
      </Stack>
    );
  }

  return (
    <Stack spacing={subHeading ? '4px' : '12px'}>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: subHeading ? '12px 8px 8px' : 0,
          // as tall as the title; the buttons overhang instead of pushing it down
          ...(titleOnTop && { height: '24px', alignContent: 'center' }),
        }}
      >
        {actions && showCheckboxes && sorted.length > 0 && (
          <Checkbox
            sx={{ padding: 0, margin: 0 }}
            checked={allChecked}
            indeterminate={someChecked && !allChecked}
            onChange={() => onCheckMany(sorted.map((t) => t.id))}
          />
        )}

        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            gap: '4px',
            flexGrow: 1,
            minWidth: 0,
            minHeight: subHeading ? '40px' : undefined,
          }}
        >
          {heading}
          {sortButton}
        </Stack>

        <PhoneSelectionControls
          actions={actions}
          phone={phone}
          selectionMode={selectionMode}
          count={checked.size}
          onChange={onSelectingChange}
        />
        {actions && selectionBar}

        {layoutSwitch}
      </Stack>

      {sorted.length === 0 && <InfoNote message={emptyMessage} />}

      {/* rows of every tab stay built and only hide, so a tab switch or a
          filter shows and hides them instead of building them anew */}
      <Box
        sx={{
          // every row carries the line above it; the first one's is cut off
          // here, as a sibling rule would restyle all rows on each change
          marginTop: '-5px',
          clipPath: 'inset(5px -24px -24px -24px)',
          '& > div': {
            marginTop: '2px',
            paddingTop: '2px',
            borderTop: '1px solid var(--accent-200)',
          },
        }}
      >
        {sortedRows.map((territory) => (
          <div key={territory.id} hidden={!visibleIds.has(territory.id)}>
            <Row
              territory={territory}
              checked={checked.has(territory.id)}
              view={view}
              api={api}
            />
          </div>
        ))}
      </Box>
    </Stack>
  );
};

export default TerritoryTable;
