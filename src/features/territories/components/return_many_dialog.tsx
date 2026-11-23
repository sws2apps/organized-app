import { useAppTranslation } from '@hooks/index';
import { useState } from 'react';
import { Button } from '@components/index';
import DatePicker from '@components/date_picker';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import { Territory } from '@definition/territory';
import { territoryReturnDateError } from '@utils/territory_assignments';
import { PublisherPicker } from '@features/territories/components/holder_picker';

type ReturnManyDialogProps = {
  territories: Territory[];
  own?: boolean;
  onClose: VoidFunction;
  onReturn: (returnedOn: Date, publisher?: string) => void;
};

const ReturnManyDialog = ({
  territories,
  own = false,
  onClose,
  onReturn,
}: ReturnManyDialogProps) => {
  const { t } = useAppTranslation();

  const opens = territories.flatMap((territory) =>
    territory.assignments.filter((item) => !item.returnedOn)
  );

  // only one person to check when they all hold the same
  const heldBy = new Set(opens.map((item) => item.publisher));
  const sharedBy = heldBy.size === 1 ? [...heldBy][0] : '';

  const [returnedOn, setReturnedOn] = useState<Date | null>(new Date());
  const [returnedBy, setReturnedBy] = useState(sharedBy);

  const dateError = territoryReturnDateError(opens, returnedOn);

  const n = territories.length;

  return (
    <Dialog
      onClose={onClose}
      open
      title={
        n === 1
          ? t('tr_territoryReturnTerritory', { n })
          : t('tr_territoryReturnTerritories', { n })
      }
    >
      {sharedBy && !own && (
        <PublisherPicker
          label={t('tr_territoryReturnedBy')}
          value={returnedBy}
          onChange={setReturnedBy}
          current={sharedBy}
        />
      )}

      <DatePicker
        label={t('tr_territoryReturnedOn')}
        value={returnedOn}
        error={!!dateError}
        helperText={dateError ? t(dateError) : ''}
        onChange={(value) => setReturnedOn(value)}
      />

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button
          variant="main"
          disabled={!returnedOn || !!dateError || n === 0}
          onClick={() => {
            if (!returnedOn || !!dateError || n === 0) return;

            onReturn(
              returnedOn,
              !own && sharedBy && returnedBy && returnedBy !== sharedBy
                ? returnedBy
                : undefined
            );
          }}
        >
          {t('tr_return')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReturnManyDialog;
