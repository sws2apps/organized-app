import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const S1Field = ({ field, value }) => {
  const { t } = useTranslation('ui');

  const fldName =
    field === 'activePublishers'
      ? t('activePublishers')
      : field === 'weekendMeetingAttendanceAvg'
      ? t('weekendMeetingAttendanceAvg')
      : field === 'numberReports'
      ? t('numberReports')
      : field === 'placements'
      ? t('placements')
      : field === 'videos'
      ? t('videos')
      : field === 'hours'
      ? t('hours')
      : field === 'returnVisits'
      ? t('returnVisits')
      : field === 'bibleStudies'
      ? t('bibleStudies')
      : '';

  return (
    <Box>
      <Typography>{fldName}</Typography>
      <TextField
        variant="outlined"
        size="small"
        autoComplete="off"
        type="number"
        sx={{ marginTop: '2px', width: '100px', '.MuiOutlinedInput-input': { textAlign: 'center' } }}
        value={value}
      />
    </Box>
  );
};

export default S1Field;
