import { useAppTranslation } from '@hooks/index';
import { Button } from '@components/index';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';

type TerritoryDeleteProps = {
  open: boolean;
  number: string;
  // whoever has it out now
  holder?: string;
  onClose: VoidFunction;
  onDelete: VoidFunction;
};

const TerritoryDelete = ({
  open,
  number,
  holder,
  onClose,
  onDelete,
}: TerritoryDeleteProps) => {
  const { t } = useAppTranslation();
  return (
    <Dialog
      onClose={onClose}
      open={open}
      title={t('tr_territoryDeleteTerritory', { number })}
      description={
        holder
          ? t('tr_territoryHasThisTerritoryNowTheOpenAssignmentTheAssignment', {
              name: holder,
            })
          : t('tr_territoryTheTerritoryItsAddressesAndItsAssignmentHistoryWill')
      }
    >
      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button variant="main" color="red" onClick={onDelete}>
          {t('tr_delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TerritoryDelete;
