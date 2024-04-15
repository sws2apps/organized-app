import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const S1Field = ({ field, value }) => {
  const { t } = useTranslation('ui');

  const fldName = () => {
    let value = '';

    if (field === 'activePublishers') value = t('activePublishers');
    if (field === 'weekendMeetingAttendanceAvg') value = t('weekendMeetingAttendanceAvg');
    if (field === 'numberReports') value = t('numberReports');
    if (field === 'placements') value = t('placements');
    if (field === 'videos') value = t('videos');
    if (field === 'hours') value = t('hours');
    if (field === 'returnVisits') value = t('returnVisits');
    if (field === 'bibleStudies') value = t('bibleStudies');

    return value;
  };

  return (
    <Box>
      <Typography>{fldName()}</Typography>
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
