import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import { Badge, Button, InfoNote } from '@components/index';
import { IconAdd, IconEdit } from '@icons/index';
import { Territory } from '@definition/territory';
import RecordList from '../components/record_list';
import RowAction from '../components/row_action';
import PhoneNumberEditor from './phone_number_editor';
import { useBreakpoints } from '@hooks/index';
import { emptyListMessage, isDoNotCallNumber } from '../helpers';

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
  const { tablet688Up } = useBreakpoints();

  const [editing, setEditing] = useState<number | 'new'>();

  const numbers = territory.phoneNumbers ?? [];

  const indexed = numbers.map((number, index) => ({ number, index }));
  const half = tablet688Up ? Math.ceil(indexed.length / 2) : indexed.length;
  const columns = [indexed.slice(0, half), indexed.slice(half)].filter(
    (column) => column.length > 0
  );

  const handleSave = (value: string) =>
    onChange(
      editing === 'new'
        ? [...numbers, value]
        : numbers.map((item, index) => (index === editing ? value : item))
    );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {numbers.length === 0 && <InfoNote message={emptyListMessage()} />}

      {/* two columns where there is room, read top to bottom like the card */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: tablet688Up
            ? 'repeat(2, minmax(0, 1fr))'
            : 'minmax(0, 1fr)',
          gap: '0 16px',
          alignItems: 'start',
        }}
      >
        {columns.map((column, position) => (
          <RecordList
            key={position}
            items={column.map(({ number, index }) => {
              const blocked = isDoNotCallNumber(territory, number);

              return {
                id: `${index}-${number}`,
                onClick: readOnly ? undefined : () => setEditing(index),
                title: number,
                titleColor: blocked ? 'var(--red-main)' : undefined,
                badge: blocked && (
                  <Badge
                    size="small"
                    color="red"
                    filled={false}
                    text="Do not call"
                    sx={{ width: 'fit-content', flexShrink: 0 }}
                  />
                ),
                actions: readOnly ? undefined : (
                  <RowAction title="Edit" onClick={() => setEditing(index)}>
                    <IconEdit
                      color="var(--accent-main)"
                      width={18}
                      height={18}
                    />
                  </RowAction>
                ),
              };
            })}
          />
        ))}
      </Box>

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
