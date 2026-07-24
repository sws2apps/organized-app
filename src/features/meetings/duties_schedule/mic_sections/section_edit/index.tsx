import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { DUTIES_MAX } from '@features/congregation/settings/meeting_duties/shared/constants';
import { SectionEditProps } from '../index.types';
import useSectionEdit from './useSectionEdit';
import Button from '@components/button';
import Dialog from '@components/dialog';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import TextField from '@components/textfield';
import Typography from '@components/typography';

const SectionEdit = (props: SectionEditProps) => {
  const { t } = useAppTranslation();

  const {
    name,
    amount,
    nameError,
    handleNameChange,
    handleAmountChange,
    handleSave,
  } = useSectionEdit(props);

  return (
    <Dialog onClose={props.onClose} open={props.open}>
      <Stack spacing="24px" width="100%">
        <Typography className="h2">
          {props.type === 'add' ? t('tr_sectionAdd') : t('tr_sectionEdit')}
        </Typography>

        <TextField
          label={t('tr_title')}
          value={name}
          onChange={handleNameChange}
          error={nameError}
          helperText={nameError ? t('tr_fillRequiredField') : undefined}
        />

        <Select
          label={t('tr_amountLabel')}
          value={amount}
          onChange={handleAmountChange}
        >
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

export default SectionEdit;
