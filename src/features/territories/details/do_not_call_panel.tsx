import { useAppTranslation } from '@hooks/index';
import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { shortDateFormatState } from '@states/settings';
import { Box, Stack } from '@mui/material';
import { Button } from '@components/index';
import { IconAdd, IconEdit } from '@icons/index';
import { DoNotCall, Territory } from '@definition/territory';
import RecordList from '@features/territories/components/record_list';
import RowAction from '@features/territories/components/row_action';
import {
  displayDate,
  parseDate,
  upsertById,
  emptyListMessage,
  isDoNotCallNumber,
} from '@features/territories/helpers';
import useTerritoryAccess from '@features/territories/useTerritoryAccess';
import DoNotCallEditor from '@features/territories/details/do_not_call_editor';
import { offerUndo } from '@features/territories/undo';
import { restoreDoNotCall } from '@features/territories/restore';

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
  const { t } = useAppTranslation();

  const format = useAtomValue(shortDateFormatState);
  const { publisher: me, publisherId } = useTerritoryAccess();

  const [editing, setEditing] = useState<DoNotCall | 'new'>();

  const entries = territory.doNotCalls;

  const isPhone = territory.type === 'phone';

  const canEdit = (entry: DoNotCall) =>
    access === 'all' ||
    (access === 'own' &&
      (entry.addedById
        ? entry.addedById === publisherId
        : entry.addedBy === me));

  const openEntry = (entry: DoNotCall) =>
    canEdit(entry) ? () => setEditing(entry) : undefined;

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
          actions: canEdit(entry) && (
            <RowAction title={t('tr_edit')} onClick={() => setEditing(entry)}>
              <IconEdit color="var(--accent-main)" width={18} height={18} />
            </RowAction>
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
            {t('tr_add')}
          </Button>
        </Stack>
      )}

      {editing && (
        <DoNotCallEditor
          entry={editing === 'new' ? undefined : editing}
          numbers={numbers}
          onClose={() => setEditing(undefined)}
          onSave={(next) => onChange(upsertById(entries, next))}
          onDelete={() => {
            if (editing === 'new') return;
            const index = entries.findIndex((item) => item.id === editing.id);
            onChange(entries.filter((item) => item.id !== editing.id));
            offerUndo({
              text: isPhone
                ? t('tr_territoryNumberDeleted')
                : t('tr_territoryAddressDeleted'),
              revert: () => restoreDoNotCall(territory.id, editing, index),
            });
          }}
        />
      )}
    </Box>
  );
};

export default DoNotCallPanel;
