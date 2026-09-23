import { useState } from 'react';
import { Box, MenuItem, Stack } from '@mui/material';
import { Button, Select, TextField, Typography } from '@components/index';
import DatePicker from '@components/date_picker';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import { useBreakpoints } from '@hooks/index';
import { DoNotCall } from '@definition/territory';
import { CURRENT_PUBLISHER, parseDate, toStoredDate } from '../helpers';
import EditorHeader from './editor_header';

const DoNotCallEditor = ({
  entry,
  numbers,
  onClose,
  onSave,
  onDelete,
}: {
  entry?: DoNotCall;
  // a phone territory marks one of its own numbers instead of an address
  numbers?: string[];
  onClose: VoidFunction;
  onSave: (next: DoNotCall) => void;
  onDelete?: VoidFunction;
}) => {
  const { tablet600Up } = useBreakpoints();

  const [address, setAddress] = useState(entry?.address ?? '');
  const [name, setName] = useState(entry?.name ?? '');
  const [date, setDate] = useState<Date | null>(
    parseDate(entry?.date) ?? new Date()
  );

  const handleSave = () => {
    onSave({
      id: entry?.id ?? `dnc-${Date.now()}`,
      address: address.trim(),
      name: name.trim() || undefined,
      date: toStoredDate(date ?? new Date()),
      addedBy: entry?.addedBy ?? CURRENT_PUBLISHER,
    });
    onClose();
  };

  return (
    <Dialog
      onClose={onClose}
      open
      header={
        <EditorHeader
          title={`${entry ? 'Edit' : 'Add'} do-not-call ${
            numbers ? 'number' : 'address'
          }`}
          description={
            numbers
              ? 'A number the publishers should not call, and since when.'
              : 'An address the publishers should skip, and since when.'
          }
          onDelete={
            entry && onDelete
              ? () => {
                  onDelete();
                  onClose();
                }
              : undefined
          }
        />
      }
    >
      {numbers ? (
        <Select
          label="Phone number"
          value={address}
          onChange={(event) => setAddress(event.target.value as string)}
        >
          {numbers.map((number) => (
            <MenuItem key={number} value={number}>
              <Typography className="body-regular">{number}</Typography>
            </MenuItem>
          ))}
        </Select>
      ) : (
        <TextField
          label="Address"
          autoFocus={!entry}
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
      )}

      <Stack
        direction={tablet600Up ? 'row' : 'column'}
        spacing="16px"
        sx={{ width: '100%' }}
      >
        {!numbers && (
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <TextField
              label="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Box>
        )}

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <DatePicker
            label="Date"
            value={date}
            onChange={(value) => setDate(value)}
          />
        </Box>
      </Stack>

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="main" disabled={!address.trim()} onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DoNotCallEditor;
