import { useState } from 'react';
import { Box, MenuItem, Stack } from '@mui/material';
import { Button, Select, TextField, Typography } from '@components/index';
import DatePicker from '@components/date_picker';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { IconLocation } from '@icons/index';
import { DoNotCall } from '@definition/territory';
import { parseDate, toStoredDate } from '@features/territories/helpers';
import useTerritoryAccess from '@features/territories/useTerritoryAccess';
import EditorHeader from '@features/territories/components/editor_header';

const DoNotCallEditor = ({
  entry,
  numbers,
  onClose,
  onSave,
  onDelete,
  onOpenInMaps,
}: {
  entry?: DoNotCall;
  // a phone territory marks one of its own numbers instead of an address
  numbers?: string[];
  onClose: VoidFunction;
  onSave: (next: DoNotCall) => void;
  onDelete?: VoidFunction;
  // the address as typed, in the maps app
  onOpenInMaps?: (address: string) => void;
}) => {
  const { t } = useAppTranslation();

  const { tablet600Up } = useBreakpoints();

  const { publisher: me } = useTerritoryAccess();

  const [address, setAddress] = useState(entry?.address ?? '');
  const [name, setName] = useState(entry?.name ?? '');
  const [date, setDate] = useState<Date | null>(
    parseDate(entry?.date) ?? new Date()
  );

  let titleKey = entry
    ? 'tr_territoryEditDoNotCallAddress'
    : 'tr_territoryAddDoNotCallAddress';
  if (numbers)
    titleKey = entry
      ? 'tr_territoryEditDoNotCallNumber'
      : 'tr_territoryAddDoNotCallNumber';

  const handleSave = () => {
    onSave({
      id: entry?.id ?? `dnc-${Date.now()}`,
      address: address.trim(),
      name: name.trim() || undefined,
      date: toStoredDate(date ?? new Date()),
      addedBy: entry?.addedBy ?? me,
    });
    onClose();
  };

  return (
    <Dialog
      onClose={onClose}
      open
      header={
        <EditorHeader
          title={t(titleKey)}
          description={
            numbers
              ? t('tr_territoryANumberThePublishersShouldNotCallAndSince')
              : t('tr_territoryAnAddressThePublishersShouldSkipAndSinceWhen')
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
          label={t('tr_phoneNumber')}
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
          label={t('tr_address')}
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
              label={t('tr_name')}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Box>
        )}

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <DatePicker
            label={t('tr_date')}
            value={date}
            onChange={(value) => setDate(value)}
          />
        </Box>
      </Stack>

      {onOpenInMaps && !numbers && (
        <Button
          variant="small"
          disableAutoStretch
          disabled={!address.trim()}
          startIcon={<IconLocation color="var(--accent-main)" />}
          onClick={() => onOpenInMaps(address.trim())}
          sx={{ minHeight: '32px', minWidth: 'unset', marginTop: '-8px' }}
        >
          {t('tr_territoryOpenInMaps')}
        </Button>
      )}

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button variant="main" disabled={!address.trim()} onClick={handleSave}>
          {t('tr_save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DoNotCallEditor;
