import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const UserPendingS4Field = ({ field, errorField, value }) => {
  const { t } = useTranslation('ui');

  const fldName = () => {
    let value = '';

    if (field === 'placements') value = t('S4Placements');
    if (field === 'videos') value = t('S4Video');
    if (field === 'hours') value = t('S4Hours');
    if (field === 'returnVisits') value = t('S4ReturnVisits');
    if (field === 'bibleStudies') value = t('S4BibleStudies');
    if (field === 'comments') value = t('comments');

    return value;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
      }}
    >
      {field !== 'comments' && <Typography sx={{ width: '280px' }}>{fldName()}</Typography>}
      {field !== 'comments' && (
        <TextField
          variant="outlined"
          size="small"
          autoComplete="off"
          type={field === 'hours' ? 'text' : 'number'}
          sx={{ width: '100px', '.MuiOutlinedInput-input': { textAlign: 'center' } }}
          error={errorField ? errorField : null}
          value={value}
          InputProps={{ readOnly: true }}
        />
      )}
      {field === 'comments' && (
        <TextField
          label={fldName()}
          multiline
          rows={2}
          variant="outlined"
          size="small"
          autoComplete="off"
          sx={{ flexGrow: 1, marginTop: '15px', maxWidth: '390px' }}
          InputProps={{ readOnly: true }}
          value={value}
        />
      )}
    </Box>
  );
};

export default UserPendingS4Field;
