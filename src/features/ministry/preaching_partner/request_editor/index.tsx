import { Box, FormControlLabel, RadioGroup } from '@mui/material';
import { PreachingPartnerEditorProps } from './index.types';
import { PreachingPartnerMinistryType } from '@definition/preaching_partner';
import { useAppTranslation } from '@hooks/index';
import useRequestEditor from './useRequestEditor';
import Button from '@components/button';
import DatePicker from '@components/date_picker';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import Divider from '@components/divider';
import IconLoading from '@components/icon_loading';
import MenuItem from '@components/menuitem';
import Radio from '@components/radio';
import Select from '@components/select';
import TextField from '@components/textfield';
import TimePicker from '@components/time_picker';
import Typography from '@components/typography';

const PreachingPartnerEditor = (props: PreachingPartnerEditorProps) => {
  const { t } = useAppTranslation();

  const {
    value,
    date,
    start,
    end,
    hour24,
    isValid,
    isProcessing,
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
    <Dialog
      open={props.open}
      onClose={props.onClose}
      title={
        props.request
          ? t('tr_editPartnerRequest')
          : t('tr_createPartnerRequest')
      }
    >
      <Box sx={{ width: '100%' }}>
        <DatePicker
          label={t('tr_date')}
          value={date}
          disablePast
          onChange={handleDateChange}
        />
      </Box>

      <Box sx={{ width: '100%' }}>
        <Typography className="h4">{t('tr_preferredTime')}</Typography>

        <RadioGroup
          sx={{ gap: '8px', marginTop: '8px' }}
          value={value.request_data.flexible ? 'flexible' : 'specific'}
          onChange={(e) => handleFlexibleChange(e.target.value === 'flexible')}
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
          <Box sx={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <TimePicker
              label={t('tr_startTime')}
              ampm={!hour24}
              value={start}
              onChange={handleStartChange}
              sx={{ flex: 1 }}
            />

            <TimePicker
              label={t('tr_endTimeOptional')}
              ampm={!hour24}
              value={end}
              onChange={handleEndChange}
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
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_cancel')}
        </Button>

        <Button
          variant="main"
          disabled={!isValid || isProcessing}
          endIcon={isProcessing && <IconLoading />}
          onClick={handleSave}
        >
          {props.request ? t('tr_save') : t('tr_create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreachingPartnerEditor;
