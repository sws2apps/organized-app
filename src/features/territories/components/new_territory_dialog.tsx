import { useAppTranslation } from '@hooks/index';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Box } from '@mui/material';
import { useAtom } from 'jotai';
import { Button, TextField } from '@components/index';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import { territoriesState } from '@states/territories';
import {
  blankTerritory,
  usableNumber,
} from '@features/territories/details/useTerritoryDetails';

// a territory started from the map: number and locality first, then
// straight to drawing its border
const NewTerritoryDialog = ({ onClose }: { onClose: VoidFunction }) => {
  const { t } = useAppTranslation();

  const navigate = useNavigate();
  const [territories, setTerritories] = useAtom(territoriesState);
  const [draft, setDraft] = useState(blankTerritory);
  const [tried, setTried] = useState(false);

  const usable = usableNumber(draft, territories);
  const isDuplicate = !!draft.number.trim() && !usable;

  let numberHelp = '';
  if (isDuplicate) numberHelp = t('tr_territoryThisNumberIsAlreadyUsed');
  else if (tried && !usable) numberHelp = t('tr_territoryEnterANumber');

  const start = () => {
    setTried(true);
    if (!usable) return;

    const territory = {
      ...draft,
      number: draft.number.trim(),
      city: draft.city.trim(),
    };
    setTerritories((prev) => [territory, ...prev]);
    navigate(`/territories/map?territory=${territory.id}&edit=1`);
    // on the map page itself the dialog stays mounted, so it closes here
    onClose();
  };

  return (
    <Dialog
      onClose={onClose}
      open
      title={t('tr_territoryNewMap')}
      description={t('tr_territoryGiveItANumberAndALocalityThenDraw')}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '3fr 7fr',
          gap: '16px',
          width: '100%',
          alignItems: 'start',
        }}
      >
        <TextField
          label={t('tr_number')}
          autoFocus
          value={draft.number}
          error={isDuplicate || (tried && !usable)}
          helperText={numberHelp}
          onChange={(event) =>
            setDraft({ ...draft, number: event.target.value })
          }
          onKeyDown={(event) => event.key === 'Enter' && start()}
        />

        <TextField
          label={t('tr_territoryLocality')}
          value={draft.city}
          onChange={(event) => setDraft({ ...draft, city: event.target.value })}
          onKeyDown={(event) => event.key === 'Enter' && start()}
        />
      </Box>

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button variant="main" onClick={start}>
          {t('tr_territoryDrawBorder')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewTerritoryDialog;
