import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { shortDateFormatState } from '@states/settings';
import { Box, Stack } from '@mui/material';
import { Button } from '@components/index';
import { IconAdd, IconEdit } from '@icons/index';
import { DoNotCall, Territory } from '@definition/territory';
import RecordList from '../components/record_list';
import RowAction from '../components/row_action';
import { displayDate, parseDate, upsertById } from '../helpers';
import DoNotCallEditor from './do_not_call_editor';

const newestFirst = (a: DoNotCall, b: DoNotCall) =>
  (parseDate(b.date)?.getTime() ?? 0) - (parseDate(a.date)?.getTime() ?? 0);

const DoNotCallPanel = ({
  territory,
  onChange,
}: {
  territory: Territory;
  onChange: (entries: DoNotCall[]) => void;
}) => {
  const format = useAtomValue(shortDateFormatState);

  const [editing, setEditing] = useState<DoNotCall | 'new'>();

  const entries = territory.doNotCalls;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <RecordList
        emptyMessage="No do-not-call addresses in this territory yet."
        items={[...entries].sort(newestFirst).map((entry) => ({
          id: entry.id,
          onClick: () => setEditing(entry),
          title: entry.address,
          subtitle: [entry.name, displayDate(entry.date, format)]
            .filter(Boolean)
            .join(' · '),
          actions: (
            <RowAction title="Edit" onClick={() => setEditing(entry)}>
              <IconEdit color="var(--accent-main)" width={18} height={18} />
            </RowAction>
          ),
        }))}
      />

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

      {editing && (
        <DoNotCallEditor
          entry={editing === 'new' ? undefined : editing}
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
