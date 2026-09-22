import { Button } from '@components/index';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';

type TerritoryDeleteProps = {
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
  <Dialog
    onClose={onClose}
    open={open}
    title={`Delete territory ${number}?`}
    description="The territory, its addresses and its assignment history will be removed. This cannot be undone."
  >
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
