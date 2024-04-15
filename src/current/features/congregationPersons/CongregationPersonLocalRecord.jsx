import { useTranslation } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Persons } from '../../classes/Persons';

const CongregationPersonLocalRecord = ({ member, handleUpdatePocketLocalId }) => {
  const { t } = useTranslation('ui');

  const value = Persons.get(member.user_local_uid) || null;

  return (
    <Box sx={{ marginTop: '20px' }}>
      <Typography sx={{ fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px outset', paddingBottom: '5px' }}>
        {t('localRecord')}
      </Typography>
      <Box maxWidth={'280px'}>
        <Autocomplete
          id="tags-standard"
          value={value}
          onChange={(e, value) => handleUpdatePocketLocalId(value)}
          options={Persons.list}
          getOptionLabel={(option) => option.person_name}
          isOptionEqualToValue={(option, value) => option.person_uid === value.person_uid}
          renderInput={(params) => <TextField {...params} variant="standard" label={t('record')} />}
          noOptionsText={t('noMatchRecord')}
        />
      </Box>
    </Box>
  );
};

export default CongregationPersonLocalRecord;
