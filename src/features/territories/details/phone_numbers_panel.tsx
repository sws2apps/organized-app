import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import { Button } from '@components/index';
import { IconAdd, IconEdit } from '@icons/index';
import { Territory } from '@definition/territory';
import RecordList from '../components/record_list';
import RowAction from '../components/row_action';
import PhoneNumberEditor from './phone_number_editor';
import { emptyListMessage } from '../helpers';

// the S-12 phone card holds 32 numbers, so the list stops there
const MAX_PHONE_NUMBERS = 32;

const PhoneNumbersPanel = ({
  territory,
  onChange,
  readOnly = false,
}: {
  territory: Territory;
  onChange: (numbers: string[]) => void;
  readOnly?: boolean;
}) => {
  const [editing, setEditing] = useState<number | 'new'>();

  const numbers = territory.phoneNumbers ?? [];

  const handleSave = (value: string) =>
    onChange(
      editing === 'new'
        ? [...numbers, value]
        : numbers.map((item, index) => (index === editing ? value : item))
    );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <RecordList
        emptyMessage={emptyListMessage()}
        items={numbers.map((number, index) => ({
          id: `${index}-${number}`,
          onClick: readOnly ? undefined : () => setEditing(index),
          title: number,
          subtitle: `No. ${index + 1}`,
          actions: readOnly ? undefined : (
            <RowAction title="Edit" onClick={() => setEditing(index)}>
              <IconEdit color="var(--accent-main)" width={18} height={18} />
            </RowAction>
          ),
        }))}
      />

      {!readOnly && numbers.length < MAX_PHONE_NUMBERS && (
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

      {editing !== undefined && (
        <PhoneNumberEditor
          value={editing === 'new' ? undefined : numbers[editing]}
          onClose={() => setEditing(undefined)}
          onSave={handleSave}
          onDelete={() =>
            onChange(numbers.filter((_, index) => index !== editing))
          }
        />
      )}
    </Box>
  );
};

export default PhoneNumbersPanel;
