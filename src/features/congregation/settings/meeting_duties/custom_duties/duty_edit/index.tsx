import DutyIconSelector from '@features/congregation/settings/meeting_duties/custom_duties/icon_selector';
import DialogActions from '@components/dialog_actions';
import { DUTY_NAME_MAX } from '@utils/duties_sections';
import { Box, Stack } from '@mui/material';
import { IconDelete } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { DUTIES_MAX } from '@features/congregation/settings/meeting_duties/shared/constants';
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
  const { tablet500Down } = useBreakpoints();

  const {
    icon,
    handleIconChange,
    name,
    amount,
    nameError,
    isSaving,
    unavailable,
    handleNameChange,
    handleAmountChange,
    handleSave,
  } = useDutyEdit(props);

  return (
    <Dialog
      onClose={() => {
        if (!isSaving) props.onClose();
      }}
      open={props.open}
      title={t(props.type === 'add' ? 'tr_dutyAdd' : 'tr_dutyEdit')}
      headerAction={
        props.type === 'edit' && (
          <Button
            variant="small"
            color="red"
            startIcon={<IconDelete />}
            onClick={props.onDelete}
            disabled={isSaving || unavailable}
            disableAutoStretch
            sx={{ flexShrink: 0 }}
          >
            {t('tr_delete')}
          </Button>
        )
      }
      actions={
        <DialogActions>
          <Button
            variant="secondary"
            disabled={isSaving}
            onClick={props.onClose}
          >
            {t('tr_cancel')}
          </Button>
          <Button
            variant="main"
            disabled={isSaving || unavailable}
            onClick={handleSave}
          >
            {t(props.type === 'add' ? 'tr_add' : 'tr_done')}
          </Button>
        </DialogActions>
      }
    >
      <Stack spacing="var(--dialog-gap)" sx={{ width: '100%' }}>
        {unavailable && (
          <Typography color="var(--red-main)" role="alert">
            {t('tr_dutyUnavailable')}
          </Typography>
        )}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: tablet500Down
              ? 'auto minmax(0, 1fr)'
              : 'minmax(0, 2fr) auto minmax(0, 1fr)',
            gap: 'var(--dialog-gap-mobile)',
            alignItems: 'start',
          }}
        >
          <TextField
            sx={{ gridColumn: tablet500Down ? '1 / -1' : undefined }}
            autoFocus
            label={t('tr_dutyName')}
            value={name}
            onChange={handleNameChange}
            disabled={isSaving || unavailable}
            error={!!nameError}
            helperText={nameError ? t(nameError) : undefined}
            slotProps={{ htmlInput: { maxLength: DUTY_NAME_MAX } }}
          />

          <DutyIconSelector
            value={icon}
            onChange={handleIconChange}
            disabled={isSaving || unavailable}
          />
          <Select
            label={t('tr_dutyPeopleNeeded')}
            value={amount}
            onChange={handleAmountChange}
            disabled={isSaving || unavailable}
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
        </Box>
      </Stack>
    </Dialog>
  );
};

export default DutyEdit;
