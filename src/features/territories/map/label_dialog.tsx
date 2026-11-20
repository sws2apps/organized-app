import { useAppTranslation } from '@hooks/index';
import { useState } from 'react';
import { Button, TextField } from '@components/index';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';

const LabelDialog = ({
  initial = '',
  onSave,
  onClose,
}: {
  initial?: string;
  onSave: (text: string) => void;
  onClose: VoidFunction;
}) => {
  const { t } = useAppTranslation();

  const [text, setText] = useState(initial);

  return (
    <Dialog
      onClose={onClose}
      open
      title={initial ? t('tr_territoryEditText') : t('tr_territoryAddText')}
      description={t('tr_territoryTheNoteIsPrintedOnTheTerritoryCardTogether')}
    >
      <TextField
        label={t('tr_territoryText')}
        autoFocus
        value={text}
        onChange={(event) => setText(event.target.value)}
      />

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button
          variant="main"
          disabled={!text.trim()}
          onClick={() => onSave(text)}
        >
          {t('tr_save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LabelDialog;
