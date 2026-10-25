import { territoryNumberKey } from '@utils/territory';
import { useAppTranslation } from '@hooks/index';
import { KeyboardEvent, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { Button, TextField, Typography } from '@components/index';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';

export type TerritoryFields = { number: string; city: string; name: string };

// number, locality and name for the part split off, or for the merged territory
const TerritoryFieldsDialog = ({
  title,
  description,
  initial,
  taken,
  choices = [],
  confirm,
  low = false,
  onConfirm,
  onClose,
}: {
  title: string;
  description: string;
  initial: TerritoryFields;
  // numbers other territories keep
  taken: string[];
  // territories whose number, locality and name can be taken over
  choices?: TerritoryFields[];
  confirm: string;
  // at the bottom of the screen, leaving the map above it in view
  low?: boolean;
  onConfirm: (fields: TerritoryFields) => void;
  onClose: VoidFunction;
}) => {
  const { t } = useAppTranslation();

  const [fields, setFields] = useState(initial);
  const [tried, setTried] = useState(false);

  const number = fields.number.trim();
  const isDuplicate =
    !!number &&
    taken.some(
      (item) => territoryNumberKey(item) === territoryNumberKey(number)
    );
  const usable = !!number && !isDuplicate;

  let numberHelp = '';
  if (isDuplicate) numberHelp = t('tr_territoryThisNumberIsAlreadyUsed');
  else if (tried && !usable) numberHelp = t('tr_territoryEnterANumber');

  const submit = () => {
    setTried(true);
    if (!usable) return;
    onConfirm({
      number,
      city: fields.city.trim(),
      name: fields.name.trim(),
    });
  };

  const onEnter = (event: KeyboardEvent) => event.key === 'Enter' && submit();

  return (
    <Dialog
      onClose={onClose}
      open
      title={title}
      description={description}
      PaperProps={
        low
          ? {
              className: 'pop-up-shadow',
              style: {
                maxWidth: '560px',
                borderRadius: 'var(--radius-xl)',
                backgroundColor: 'var(--white)',
                alignSelf: 'flex-end',
              },
            }
          : undefined
      }
    >
      {choices.length > 1 && (
        <Stack spacing="8px" sx={{ width: '100%' }}>
          <Typography className="body-small-regular" color="var(--grey-400)">
            {t('tr_territoryTakeNumberLocalityAndNameFrom')}
          </Typography>
          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: '8px' }}>
            {choices.map((choice) => (
              <Button
                key={choice.number}
                variant={choice.number === fields.number ? 'main' : 'secondary'}
                disableAutoStretch
                onClick={() => setFields(choice)}
                sx={{ minHeight: '32px', padding: '4px 12px' }}
              >
                {choice.number}
              </Button>
            ))}
          </Stack>
        </Stack>
      )}

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
          value={fields.number}
          error={isDuplicate || (tried && !usable)}
          helperText={numberHelp}
          onChange={(event) =>
            setFields({ ...fields, number: event.target.value })
          }
          onKeyDown={onEnter}
        />

        <TextField
          label={t('tr_territoryLocality')}
          value={fields.city}
          onChange={(event) =>
            setFields({ ...fields, city: event.target.value })
          }
          onKeyDown={onEnter}
        />

        <Box sx={{ gridColumn: '1 / -1' }}>
          <TextField
            label={t('tr_name')}
            value={fields.name}
            onChange={(event) =>
              setFields({ ...fields, name: event.target.value })
            }
            onKeyDown={onEnter}
          />
        </Box>
      </Box>

      <DialogActions>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button variant="main" onClick={submit}>
          {confirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TerritoryFieldsDialog;
