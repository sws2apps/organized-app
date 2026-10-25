import { Box, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { DUTIES_MAX } from '@features/congregation/settings/meeting_duties/shared/constants';
import { SectionEditProps } from '@features/meetings/duties_schedule/mic_sections/index.types';
import { DUTY_NAME_MAX } from '@utils/duties_sections';
import DialogActions from '@components/dialog_actions';
import useSectionEdit from './useSectionEdit';
import Button from '@components/button';
import Checkbox from '@components/checkbox';
import Dialog from '@components/dialog';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import TextField from '@components/textfield';
import Typography from '@components/typography';

const SectionEdit = (props: SectionEditProps) => {
  const { t } = useAppTranslation();
  const { tablet500Down } = useBreakpoints();

  const {
    name,
    amount,
    parts,
    selectedParts,
    nameError,
    missingParts,
    unavailable,
    changed,
    isSaving,
    handleNameChange,
    handleAmountChange,
    handleTogglePart,
    handleSave,
  } = useSectionEdit(props);

  return (
    <Dialog
      onClose={() => {
        if (!isSaving) props.onClose();
      }}
      open={props.open}
      title={props.type === 'add' ? t('tr_sectionAdd') : t('tr_sectionEdit')}
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
            disabled={
              isSaving || unavailable || !!changed || missingParts.length > 0
            }
            onClick={handleSave}
          >
            {t('tr_done')}
          </Button>
        </DialogActions>
      }
    >
      <Stack spacing="var(--dialog-gap)" sx={{ width: '100%' }}>
        {changed && (
          <Typography color="var(--orange-dark)">
            {t('tr_sectionChanged')}
          </Typography>
        )}
        {unavailable && (
          <Typography color="var(--red-main)">
            {t('tr_sectionUnavailable')}
          </Typography>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: tablet500Down
              ? 'minmax(0, 1fr)'
              : 'minmax(0, 2fr) minmax(0, 1fr)',
            gap: 'var(--dialog-gap-mobile)',
            alignItems: 'start',
          }}
        >
          <TextField
            label={t('tr_sectionName')}
            value={name}
            onChange={handleNameChange}
            disabled={isSaving || unavailable}
            error={!!nameError}
            helperText={nameError ? t(nameError) : undefined}
            slotProps={{ htmlInput: { maxLength: DUTY_NAME_MAX } }}
          />

          <Select
            label={t('tr_dutyPeopleNeeded')}
            value={amount}
            onChange={handleAmountChange}
            disabled={isSaving || unavailable}
          >
            {DUTIES_MAX.map((num) => (
              <MenuItem key={num} value={num}>
                <Typography>{num}</Typography>
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Stack spacing="4px">
          <Typography
            className="body-small-semibold"
            sx={{ color: 'var(--grey-400)' }}
          >
            {t('tr_sectionParts')}
          </Typography>

          <Typography
            className="label-small-regular"
            sx={{ color: 'var(--grey-350)' }}
          >
            {t(
              props.recurring
                ? 'tr_sectionRecurringPartsDesc'
                : 'tr_sectionPartsDesc'
            )}
          </Typography>

          {parts.length === 0 && (
            <Typography
              className="label-small-regular"
              sx={{ color: 'var(--grey-350)' }}
            >
              {t('tr_sectionPartsNone')}
            </Typography>
          )}

          {missingParts.length > 0 && (
            <Typography color="var(--orange-dark)">
              {t('tr_sectionPartsChanged')}
            </Typography>
          )}
          {missingParts.map((key, index) => (
            <Checkbox
              key={key}
              label={t('tr_sectionUnavailablePart', { index: index + 1 })}
              checked
              disabled={isSaving}
              onChange={() => handleTogglePart(key)}
            />
          ))}
          {parts.map((part) => (
            <Checkbox
              key={part.key}
              label={part.label}
              checked={selectedParts.includes(part.key)}
              disabled={isSaving || unavailable}
              onChange={() => handleTogglePart(part.key)}
            />
          ))}
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default SectionEdit;
