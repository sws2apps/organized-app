import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAtom, useAtomValue } from 'jotai';
import { Box, Collapse, Menu, Stack } from '@mui/material';
import {
  Badge,
  Button,
  CustomDivider,
  InfoNote,
  SearchBar,
  Typography,
} from '@components/index';
import Card from '@components/card';
import IconButton from '@components/icon_button';
import MenuItem from '@components/menuitem';
import Tooltip from '@components/tooltip';
import { dropdownPaper } from '@components/select/index.styles';
import {
  IconAdd,
  IconArrowLink,
  IconCollapse,
  IconEdit,
  IconExpand,
  IconSortDown,
  IconSortUp,
} from '@icons/index';
import { useBreakpoints } from '@hooks/index';
import { shortDateFormatState } from '@states/settings';
import { territoriesState } from '@states/territories';
import { DoNotCall, Territory } from '@definition/territory';
import {
  displayDate,
  parseDate,
  upsertById,
  emptyListMessage,
  NO_MATCHES,
} from '../helpers';
import { clickableRow, rowStates } from '../components/table_styles';
import RecordList from '../components/record_list';
import RowAction from '../components/row_action';
import TruncatedText from '../components/truncated_text';
import DoNotCallEditor from '../details/do_not_call_editor';

type SortKey = 'territory' | 'locality' | 'street' | 'date';

const SORTS: Record<SortKey, { label: string; directions: [string, string] }> =
  {
    territory: { label: 'Territory', directions: ['1 → 9', '9 → 1'] },
    locality: { label: 'Locality', directions: ['A → Z', 'Z → A'] },
    street: { label: 'Street', directions: ['A → Z', 'Z → A'] },
    date: { label: 'Date added', directions: ['Newest first', 'Oldest first'] },
  };

// past this many addresses the sections start closed, so the page stays scannable
const OPEN_LIMIT = 30;

type Entry = { territory: Territory; entry: DoNotCall };

type Group = {
  key: string;
  label: string;
  territory?: Territory;
  entries: Entry[];
};

const natural = (a: string, b: string) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

const time = (value: string) => parseDate(value)?.getTime() ?? 0;

// the address without house numbers, so "Main St 12" and "Main St 14" share a street
const streetOf = (address: string) =>
  address
    .split(',')[0]
    .replace(/\S*\d\S*/g, '')
    .replace(/\s+/g, ' ')
    .trim() || address;

const place = (territory: Territory) =>
  [territory.city, territory.name].filter(Boolean).join(' • ');

const groupBy = (
  entries: Entry[],
  sortBy: SortKey,
  reversed: boolean
): Group[] => {
  const groups = new Map<string, Group>();

  for (const item of entries) {
    const { territory, entry } = item;

    let key: string;
    let label: string;

    if (sortBy === 'territory') {
      key = territory.id;
      label = place(territory) || `Territory ${territory.number}`;
    } else if (sortBy === 'locality') {
      key = territory.city || '';
      label = territory.city || 'No locality';
    } else if (sortBy === 'street') {
      key = streetOf(entry.address).toLowerCase();
      label = streetOf(entry.address);
    } else {
      const year = parseDate(entry.date)?.getFullYear();
      key = String(year ?? '');
      label = year ? String(year) : 'No date';
    }

    const group = groups.get(key) ?? {
      key,
      label,
      territory: sortBy === 'territory' ? territory : undefined,
      entries: [],
    };

    group.entries.push(item);
    groups.set(key, group);
  }

  const byEntry =
    sortBy === 'date'
      ? (a: Entry, b: Entry) =>
          (time(b.entry.date) - time(a.entry.date)) * (reversed ? -1 : 1)
      : (a: Entry, b: Entry) =>
          natural(a.entry.address, b.entry.address) ||
          natural(a.territory.number, b.territory.number);

  const byGroup =
    sortBy === 'territory'
      ? (a: Group, b: Group) =>
          natural(a.territory!.number, b.territory!.number)
      : sortBy === 'date'
        ? (a: Group, b: Group) => Number(b.key) - Number(a.key)
        : (a: Group, b: Group) => natural(a.label, b.label);

  const list = [...groups.values()].sort(byGroup);

  for (const group of list) group.entries.sort(byEntry);

  return reversed ? list.reverse() : list;
};

const DoNotCalls = () => {
  const navigate = useNavigate();

  const { tablet688Up } = useBreakpoints();

  const [territories, setTerritories] = useAtom(territoriesState);
  const shortDateFormat = useAtomValue(shortDateFormatState);

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('territory');
  const [reversed, setReversed] = useState(false);
  const [sortMenu, setSortMenu] = useState<HTMLElement | null>(null);
  const [toggled, setToggled] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<{
    territoryId: string;
    entry?: DoNotCall;
  }>();

  const term = search.trim().toLowerCase();

  const entries: Entry[] = territories.flatMap((territory) =>
    territory.doNotCalls
      .filter(
        (entry) =>
          !term ||
          `${territory.number} ${territory.city} ${territory.name} ${entry.address} ${entry.name ?? ''}`
            .toLowerCase()
            .includes(term)
      )
      .map((entry) => ({ territory, entry }))
  );

  const groups = groupBy(entries, sortBy, reversed);

  const openByDefault = !!term || entries.length <= OPEN_LIMIT;

  const isOpen = (key: string) => toggled[key] ?? openByDefault;

  const allOpen = groups.every((group) => isOpen(group.key));

  const toggleAll = () =>
    setToggled(
      Object.fromEntries(groups.map((group) => [group.key, !allOpen]))
    );

  const pickSort = (key: SortKey) => {
    if (key === sortBy) {
      setReversed(!reversed);
    } else {
      setSortBy(key);
      setReversed(false);
      setToggled({});
    }

    setSortMenu(null);
  };

  const saveEntries = (territoryId: string, next: DoNotCall[]) =>
    setTerritories((prev) =>
      prev.map((item) =>
        item.id === territoryId ? { ...item, doNotCalls: next } : item
      )
    );

  const editingTerritory = territories.find(
    (item) => item.id === editing?.territoryId
  );

  const arrow = reversed ? (
    <IconSortUp color="var(--black)" width={20} height={20} />
  ) : (
    <IconSortDown color="var(--black)" width={20} height={20} />
  );

  const openTerritory = (territory: Territory) =>
    navigate(`/territories/${territory.id}`, {
      state: { parent: 'Do-not-call addresses' },
    });

  return (
    <Card>
      <SearchBar
        placeholder="Search addresses, names or territories"
        value={search}
        onSearch={setSearch}
      />

      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px 12px',
          paddingTop: '4px',
        }}
      >
        <Stack direction="row" sx={{ alignItems: 'center', gap: '4px' }}>
          <Typography className="h3">{`Addresses: ${entries.length}`}</Typography>

          <Tooltip
            title={`${SORTS[sortBy].label} · ${SORTS[sortBy].directions[reversed ? 1 : 0]}`}
          >
            <IconButton
              aria-label="Sort"
              onClick={(event) => setSortMenu(event.currentTarget)}
              sx={{
                padding: '6px',
                margin: 0,
                borderRadius: 'var(--radius-m)',
              }}
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
        </Stack>

        {groups.length > 1 && (
          <Button
            variant="small"
            disableAutoStretch
            startIcon={
              allOpen ? (
                <IconCollapse color="var(--accent-main)" />
              ) : (
                <IconExpand color="var(--accent-main)" />
              )
            }
            onClick={toggleAll}
            sx={{ minHeight: '32px', minWidth: 'unset' }}
          >
            {allOpen ? 'Collapse all' : 'Expand all'}
          </Button>
        )}
      </Stack>

      {groups.length === 0 && (
        <InfoNote message={term ? NO_MATCHES : emptyListMessage()} />
      )}

      <Stack
        divider={!tablet688Up && <CustomDivider color="var(--accent-200)" />}
        sx={{
          gap: tablet688Up ? '16px' : '4px',
          ...(tablet688Up && {
            display: 'grid',
            alignItems: 'start',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(min(100%, 380px), 1fr))',
          }),
        }}
      >
        {groups.map((group) => {
          const open = isOpen(group.key);

          return (
            <Box
              key={group.key}
              sx={{
                minWidth: 0,
                ...(tablet688Up && {
                  padding: '4px',
                  borderRadius: 'var(--radius-l)',
                  border: '1px solid var(--accent-200)',
                }),
              }}
            >
              <Stack
                direction="row"
                {...clickableRow(() =>
                  setToggled((prev) => ({ ...prev, [group.key]: !open }))
                )}
                aria-expanded={open}
                sx={{
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px',
                  borderRadius: 'var(--radius-m)',
                  ...rowStates(false),
                }}
              >
                <IconExpand
                  color="var(--grey-400)"
                  width={20}
                  height={20}
                  sx={{
                    flexShrink: 0,
                    transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />

                {group.territory && (
                  <Typography
                    className="body-small-semibold"
                    color="var(--black)"
                    sx={{ flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}
                  >
                    {group.territory.number}
                  </Typography>
                )}

                <TruncatedText
                  className="body-small-semibold"
                  color={group.territory ? 'var(--grey-400)' : 'var(--black)'}
                  text={group.label}
                />

                <Badge
                  size="small"
                  color="grey"
                  filled={false}
                  text={String(group.entries.length)}
                  sx={{ width: 'fit-content', flexShrink: 0 }}
                />

                {group.territory && (
                  <Stack
                    direction="row"
                    onClick={(event) => event.stopPropagation()}
                    sx={{ marginLeft: 'auto', flexShrink: 0, gap: '2px' }}
                  >
                    <RowAction
                      title="Add address"
                      onClick={() =>
                        setEditing({ territoryId: group.territory!.id })
                      }
                    >
                      <IconAdd
                        color="var(--accent-main)"
                        width={18}
                        height={18}
                      />
                    </RowAction>

                    <RowAction
                      title="Open territory"
                      onClick={() => openTerritory(group.territory!)}
                    >
                      <IconArrowLink
                        color="var(--accent-main)"
                        width={18}
                        height={18}
                      />
                    </RowAction>
                  </Stack>
                )}
              </Stack>

              <Collapse in={open} unmountOnExit>
                <RecordList
                  items={group.entries.map(({ territory, entry }) => ({
                    id: entry.id,
                    title: entry.address,
                    subtitle: [
                      !group.territory &&
                        `${territory.number} ${territory.city}`.trim(),
                      entry.name,
                      entry.addedBy,
                    ]
                      .filter(Boolean)
                      .join(' · '),
                    date: displayDate(entry.date, shortDateFormat),
                    onClick: () =>
                      setEditing({ territoryId: territory.id, entry }),
                    actions: (
                      <RowAction
                        title="Edit"
                        onClick={() =>
                          setEditing({ territoryId: territory.id, entry })
                        }
                      >
                        <IconEdit
                          color="var(--accent-main)"
                          width={18}
                          height={18}
                        />
                      </RowAction>
                    ),
                  }))}
                />
              </Collapse>
            </Box>
          );
        })}
      </Stack>

      {editing && editingTerritory && (
        <DoNotCallEditor
          entry={editing.entry}
          onClose={() => setEditing(undefined)}
          onSave={(next) =>
            saveEntries(
              editingTerritory.id,
              upsertById(editingTerritory.doNotCalls, next)
            )
          }
          onDelete={() =>
            saveEntries(
              editingTerritory.id,
              editingTerritory.doNotCalls.filter(
                (item) => item.id !== editing.entry?.id
              )
            )
          }
        />
      )}
    </Card>
  );
};

export default DoNotCalls;
