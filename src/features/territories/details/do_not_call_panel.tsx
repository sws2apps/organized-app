import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { shortDateFormatState } from '@states/settings';
import { Box, Stack } from '@mui/material';
import { Button } from '@components/index';
import { IconAdd, IconEdit, IconLocation } from '@icons/index';
import { DoNotCall, Territory } from '@definition/territory';
import RecordList from '../components/record_list';
import RowAction from '../components/row_action';
import {
  displayDate,
  parseDate,
  upsertById,
  emptyListMessage,
  isDoNotCallNumber,
  CURRENT_PUBLISHER,
  openInMaps,
} from '../helpers';
import DoNotCallEditor from './do_not_call_editor';

const newestFirst = (a: DoNotCall, b: DoNotCall) =>
  (parseDate(b.date)?.getTime() ?? 0) - (parseDate(a.date)?.getTime() ?? 0);

// elders keep the whole list; the publisher working the territory adds what they meet and fixes their own
export type DoNotCallAccess = 'all' | 'own' | 'none';

const DoNotCallPanel = ({
  territory,
  onChange,
  access = 'all',
}: {
  territory: Territory;
  onChange: (entries: DoNotCall[]) => void;
  access?: DoNotCallAccess;
}) => {
  const format = useAtomValue(shortDateFormatState);

  const [editing, setEditing] = useState<DoNotCall | 'new'>();

  const entries = territory.doNotCalls;

  const isPhone = territory.type === 'phone';

  const canEdit = (entry: DoNotCall) =>
    access === 'all' ||
    (access === 'own' && entry.addedBy === CURRENT_PUBLISHER);

  const showOnMap = (entry: DoNotCall) =>
    openInMaps([entry.address, territory.city].filter(Boolean).join(', '));

  // a read-only address opens in the maps app; a number never gets a call from here
  const openEntry = (entry: DoNotCall) => {
    if (canEdit(entry)) return () => setEditing(entry);
    if (!isPhone) return () => showOnMap(entry);
    return undefined;
  };

  // a number already marked is not offered again, except the one being edited
  const numbers = isPhone
    ? (territory.phoneNumbers ?? []).filter(
        (number) =>
          (editing !== 'new' && editing?.address === number) ||
          !isDoNotCallNumber(territory, number)
      )
    : undefined;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <RecordList
        emptyMessage={emptyListMessage()}
        items={[...entries].sort(newestFirst).map((entry) => ({
          id: entry.id,
          onClick: openEntry(entry),
          title: entry.address,
          subtitle: isPhone ? undefined : entry.name,
          date: displayDate(entry.date, format),
          actions: (
            <>
              {!isPhone && (
                <RowAction
                  title="Open in maps"
                  onClick={() => showOnMap(entry)}
                >
                  <IconLocation
                    color="var(--accent-main)"
                    width={18}
                    height={18}
                  />
                </RowAction>
              )}
              {canEdit(entry) && (
                <RowAction title="Edit" onClick={() => setEditing(entry)}>
                  <IconEdit color="var(--accent-main)" width={18} height={18} />
                </RowAction>
              )}
            </>
          ),
        }))}
      />

      {access !== 'none' && (
        <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
          <Button
            variant="small"
            disableAutoStretch
            startIcon={<IconAdd color="var(--accent-main)" />}
            onClick={() => setEditing('new')}
            sx={{ minHeight: '32px', minWidth: 'unset' }}
          >
            Add
          </Button>
        </Stack>
      )}

      {editing && (
        <DoNotCallEditor
          entry={editing === 'new' ? undefined : editing}
          numbers={numbers}
          onClose={() => setEditing(undefined)}
          onSave={(next) => onChange(upsertById(entries, next))}
          onDelete={() =>
            editing !== 'new' &&
            onChange(entries.filter((item) => item.id !== editing.id))
          }
        />
      )}
    </Box>
  );
};

export default DoNotCallPanel;
