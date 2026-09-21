import { Stack } from '@mui/material';
import { Button, Typography } from '@components/index';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';

export type TerritoryDeleteProps = {
  open: boolean;
  number: string;
  onClose: VoidFunction;
  onDelete: VoidFunction;
};

const TerritoryDelete = ({
  open,
  number,
  onClose,
  onDelete,
}: TerritoryDeleteProps) => (
  <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
    <Stack spacing="16px">
      <Typography className="h2">Delete territory {number}?</Typography>
      <Typography color="var(--grey-400)">
        The territory, its addresses and its assignment history will be removed.
        This cannot be undone.
      </Typography>
    </Stack>

    <DialogActions>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="main" color="red" onClick={onDelete}>
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

export default TerritoryDelete;
