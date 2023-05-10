import { useTranslation } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Persons } from '../../classes/Persons';

const CongregationPersonDelegates = ({ person, member, handleUpdateUserDelegate }) => {
  const { t } = useTranslation('ui');

  const pocketOptions = person ? Persons.list.filter((record) => record.person_uid !== person.user_local_uid) : [];

  return (
    <Box sx={{ marginTop: '20px' }}>
      <Box sx={{ marginBottom: '10px', borderBottom: '1px outset', paddingBottom: '5px' }}>
        <Typography sx={{ fontWeight: 'bold' }}>{t('delegatePersons')}</Typography>
        <Typography sx={{ fontSize: '14px' }}>{t('delegatePersonsDesc')}</Typography>
      </Box>

      <Box>
        <Autocomplete
          multiple
          id="tags-standard"
          value={member.user_members_delegate}
          onChange={(e, value) => handleUpdateUserDelegate(value)}
          options={pocketOptions}
          getOptionLabel={(option) => option.person_name}
          isOptionEqualToValue={(option, value) => option.person_uid === value.person_uid}
          renderInput={(params) => <TextField {...params} variant="standard" label={t('persons')} />}
          noOptionsText={t('noMatchRecord')}
        />
      </Box>
    </Box>
  );
};

export default CongregationPersonDelegates;
