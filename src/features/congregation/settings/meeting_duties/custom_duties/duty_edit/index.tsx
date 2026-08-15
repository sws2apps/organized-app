import { Stack } from '@mui/material';
import { IconDelete } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { DUTIES_MAX } from '../../shared/constants';
import { DutyEditProps } from './index.types';
import useDutyEdit from './useDutyEdit';
import Button from '@components/button';
import Dialog from '@components/dialog';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import TextField from '@components/textfield';
import Typography from '@components/typography';

const DutyEdit = (props: DutyEditProps) => {
  const { t } = useAppTranslation();

  const { name, amount, handleNameChange, handleAmountChange, handleSave } =
    useDutyEdit(props);

  return (
    <Dialog onClose={props.onClose} open={props.open}>
      <Stack spacing="24px" width="100%">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography className="h2">{t('tr_dutiesCustom')}</Typography>

          {props.type === 'edit' && (
            <Button
              variant="small"
              color="red"
              startIcon={<IconDelete />}
              onClick={props.onDelete}
              disableAutoStretch
              sx={{ minHeight: '32px', height: '32px' }}
            >
              {t('tr_delete')}
            </Button>
          )}
        </Stack>

        <TextField
          label={t('tr_name')}
          value={name}
          onChange={handleNameChange}
        />

        <Select
          label={t('tr_amountLabel')}
          value={amount}
          onChange={handleAmountChange}
        >
          <MenuItem value={0}>
            <Typography>{t('tr_disabledLabel')}</Typography>
          </MenuItem>

          {DUTIES_MAX.map((num) => (
            <MenuItem key={num} value={num}>
              <Typography>{num}</Typography>
            </MenuItem>
          ))}
        </Select>

        <Stack spacing="8px">
          <Button variant="main" onClick={handleSave}>
            {t('tr_done')}
          </Button>
          <Button variant="secondary" onClick={props.onClose}>
            {t('tr_cancel')}
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default DutyEdit;
