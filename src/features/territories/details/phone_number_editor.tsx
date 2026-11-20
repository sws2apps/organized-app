import { useAppTranslation } from '@hooks/index';
import { useState } from 'react';
import { Button, TextField } from '@components/index';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import { IconCall } from '@icons/index';
import EditorHeader from '@features/territories/components/editor_header';

const PhoneNumberEditor = ({
  value,
  onClose,
  onSave,
  onDelete,
  onCall,
}: {
  value?: string;
  onClose: VoidFunction;
  onSave: (next: string) => void;
  onDelete?: VoidFunction;
  // dials the number as typed
  onCall?: (number: string) => void;
}) => {
  const { t } = useAppTranslation();

  const [number, setNumber] = useState(value ?? '');

  return (
    <Dialog
      onClose={onClose}
      open
      header={
        <EditorHeader
          title={
            value === undefined
              ? t('tr_territoryAddPhoneNumber')
              : t('tr_territoryEditPhoneNumber')
          }
          description={t(
            'tr_territoryANumberThePublishersCallWhenTheyWorkThis'
          )}
          onDelete={
            value !== undefined && onDelete
              ? () => {
                  onDelete();
                  onClose();
                }
              : undefined
          }
        />
      }
    >
      <TextField
        label={t('tr_phoneNumber')}
        type="tel"
        autoFocus
        value={number}
        onChange={(event) => setNumber(event.target.value)}
      />

      {onCall && (
        <Button
          variant="small"
          disableAutoStretch
          disabled={!number.trim()}
          startIcon={<IconCall color="var(--accent-main)" />}
          onClick={() => onCall(number.trim())}
          sx={{ minHeight: '32px', minWidth: 'unset', marginTop: '-8px' }}
        >
          {t('tr_territoryTypeCall', { context: 'action' })}
        </Button>
      )}

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button
          variant="main"
          disabled={!number.trim()}
          onClick={() => {
            onSave(number.trim());
            onClose();
          }}
        >
          {t('tr_save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PhoneNumberEditor;
