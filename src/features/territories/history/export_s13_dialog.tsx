import { useState } from 'react';
import { MenuItem } from '@mui/material';
import { Button, Select, Typography } from '@components/index';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import { serviceYear } from '../helpers';

const label = (year: number) => `${year - 1}/${year}`;

const ExportS13Dialog = ({
  isProcessing,
  onClose,
  onExport,
}: {
  isProcessing: boolean;
  onClose: VoidFunction;
  onExport: (year: number) => void;
}) => {
  const current = serviceYear();
  const years = [current, current - 1, current - 2];

  const [year, setYear] = useState(current);

  return (
    <Dialog
      onClose={onClose}
      open
      title="Export S-13"
      description="The territory assignment record of one service year, September to August."
    >
      <Select
        label="Service year"
        value={year}
        onChange={(event) => setYear(Number(event.target.value))}
      >
        {years.map((item) => (
          <MenuItem key={item} value={item}>
            <Typography className="body-regular">{label(item)}</Typography>
          </MenuItem>
        ))}
      </Select>

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="main"
          disabled={isProcessing}
          onClick={() => onExport(year)}
        >
          Export
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportS13Dialog;
