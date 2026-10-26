import { Box, FormControlLabel, RadioGroup } from '@mui/material';
import { PreachingPartnerEditorProps } from '@features/ministry/preaching_partner/request_editor/index.types';
import { PreachingPartnerMinistryType } from '@definition/preaching_partner';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useRequestEditor from '@features/ministry/preaching_partner/request_editor/useRequestEditor';
import Button from '@components/button';
import DatePicker from '@components/date_picker';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import Divider from '@components/divider';
import IconLoading from '@components/icon_loading';
import MenuItem from '@components/menuitem';
import PreachingPartnerConfirmDialog from '@features/ministry/preaching_partner/confirm_dialog';
import Radio from '@components/radio';
import Select from '@components/select';
import TextField from '@components/textfield';
import TimePicker from '@components/time_picker';
import Typography from '@components/typography';

const PreachingPartnerEditor = (props: PreachingPartnerEditorProps) => {
  const { t } = useAppTranslation();

  const { tablet688Up } = useBreakpoints();

  const {
    value,
    isDiscardOpen,
    handleClose,
    handleCloseDiscard,
    handleDiscard,
    date,
    dateError,
    handleDateError,
    start,
    end,
    hour24,
    isValid,
    endBeforeStart,
    isProcessing,
    isDeleteOpen,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,
    typeOptions,
    handleDateChange,
    handleFlexibleChange,
    handleStartChange,
    handleEndChange,
    handleTypeChange,
    handleCommentChange,
    handleSave,
  } = useRequestEditor(props);

  return (
    <>
      <Dialog
        open={props.open}
        onClose={handleClose}
        title={
          props.request
            ? t('tr_editPartnerRequest')
            : t('tr_createPartnerRequest')
        }
        closable
      >
        <Box sx={{ width: '100%' }}>
          <DatePicker
            label={t('tr_date')}
            value={date}
            error={dateError}
            helperText={dateError ? t('tr_partnerDateRequired') : undefined}
            readOnly={isProcessing}
            disablePast
            onChange={handleDateChange}
            onError={handleDateError}
          />
        </Box>

        <Box sx={{ width: '100%' }}>
          <Typography id="partner-preferred-time" className="h4">
            {t('tr_preferredTime')}
          </Typography>

          <RadioGroup
            aria-labelledby="partner-preferred-time"
            sx={{ gap: '8px', marginTop: '8px' }}
            value={value.request_data.flexible ? 'flexible' : 'specific'}
            onChange={(e) =>
              handleFlexibleChange(e.target.value === 'flexible')
            }
          >
            <FormControlLabel
              value="flexible"
              control={<Radio />}
              label={<Typography>{t('tr_flexibleDuringTheDay')}</Typography>}
            />

            <FormControlLabel
              value="specific"
              control={<Radio />}
              label={<Typography>{t('tr_specificTime')}</Typography>}
            />
          </RadioGroup>

          {!value.request_data.flexible && (
            // side by side the end label no longer fits on a phone
            <Box
              sx={{
                display: 'flex',
                flexDirection: tablet688Up ? 'row' : 'column',
                gap: tablet688Up ? '16px' : '12px',
                marginTop: '8px',
              }}
            >
              <TimePicker
                label={t('tr_startTime')}
                readOnly={isProcessing}
                error={!start}
                helperText={!start ? t('tr_partnerStartRequired') : undefined}
                ampm={!hour24}
                value={start}
                onChange={handleStartChange}
                sx={{ flex: 1 }}
              />

              <TimePicker
                label={t('tr_endTimeOptional')}
                readOnly={isProcessing}
                ampm={!hour24}
                value={end}
                onChange={handleEndChange}
                error={endBeforeStart}
                helperText={endBeforeStart ? t('tr_endTimeBeforeStart') : ''}
                sx={{ flex: 1 }}
              />
            </Box>
          )}
        </Box>

        <Divider color="var(--accent-200)" sx={{ width: '100%' }} />

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <Typography className="h4">{t('tr_optionalDetails')}</Typography>

          <Select
            label={t('tr_ministryType')}
            value={value.request_data.type}
            onChange={(e) =>
              handleTypeChange(e.target.value as PreachingPartnerMinistryType)
            }
          >
            {typeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Typography>{option.label}</Typography>
              </MenuItem>
            ))}
          </Select>

          <TextField
            label={t('tr_comments')}
            value={value.request_data.comment}
            onChange={(e) => handleCommentChange(e.target.value)}
          />
        </Box>

        <DialogActions>
          <Button
            variant="secondary"
            color={props.request ? 'red' : undefined}
            disabled={isProcessing}
            onClick={props.request ? handleOpenDelete : handleClose}
          >
            {props.request ? t('tr_delete') : t('tr_cancel')}
          </Button>

          <Button
            variant="main"
            disabled={!isValid || isProcessing}
            endIcon={isProcessing ? <IconLoading /> : undefined}
            onClick={handleSave}
          >
            {props.request ? t('tr_save') : t('tr_create')}
          </Button>
        </DialogActions>
      </Dialog>

      {isDiscardOpen && (
        <PreachingPartnerConfirmDialog
          open
          onClose={handleCloseDiscard}
          onConfirm={handleDiscard}
          title={t('tr_unsavedChanges')}
          description={t('tr_unsavedChangesDesc')}
          confirmLabel={t('tr_discardChanges')}
        />
      )}

      {isDeleteOpen && (
        <PreachingPartnerConfirmDialog
          open={isDeleteOpen}
          onClose={handleCloseDelete}
          onConfirm={handleConfirmDelete}
          title={t('tr_deletePartnerRequest')}
          description={t('tr_deletePartnerRequestDesc')}
          confirmLabel={t('tr_delete')}
        />
      )}
    </>
  );
};

export default PreachingPartnerEditor;
