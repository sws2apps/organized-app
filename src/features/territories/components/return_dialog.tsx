import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import { Button, TextField, Typography } from '@components/index';
import DatePicker from '@components/date_picker';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import { useBreakpoints } from '@hooks/index';
import { Territory } from '@definition/territory';

export type ReturnDialogProps = {
  territory?: Territory;
  onClose: VoidFunction;
  onReturn: (id: string, households: number, returnedOn: Date) => void;
};

const ReturnDialog = ({ territory, onClose, onReturn }: ReturnDialogProps) => {
  const { tablet600Up } = useBreakpoints();

  const [households, setHouseholds] = useState(
    territory ? String(territory.households) : ''
  );
  const [returnedOn, setReturnedOn] = useState<Date | null>(new Date());

  if (!territory) return null;

  return (
    <Dialog onClose={onClose} open sx={{ padding: '24px' }}>
      <Stack spacing="4px" sx={{ width: '100%' }}>
        <Typography className="h3">Return {territory.number}</Typography>
        <Typography className="body-small-regular" color="var(--grey-400)">
          Confirm when the territory came back and the households count the
          publisher reported.
        </Typography>
      </Stack>

      <Stack
        direction={tablet600Up ? 'row' : 'column'}
        spacing="16px"
        sx={{ width: '100%' }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <DatePicker
            label="Returned on"
            value={returnedOn}
            onChange={(value) => setReturnedOn(value)}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <TextField
            label="Households"
            type="number"
            value={households}
            onChange={(event) => setHouseholds(event.target.value)}
          />
        </Box>
      </Stack>

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="main"
          onClick={() => {
            onReturn(
              territory.id,
              Number(households) || territory.households,
              returnedOn ?? new Date()
            );
            onClose();
          }}
        >
          Return
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReturnDialog;
