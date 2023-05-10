import { useTranslation } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Persons } from '../../classes/Persons';

const CongregationPersonDelegates = ({ person, member, handleUpdatePocketMembers }) => {
  const { t } = useTranslation('ui');

  const pocketOptions = person ? Persons.list.filter((student) => student.person_uid !== person.pocket_local_id) : [];

  return (
    <Box sx={{ marginTop: '20px' }}>
      <Typography sx={{ fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px outset', paddingBottom: '5px' }}>
        {t('viewOnBehalf')}
      </Typography>
      <Box>
        <Autocomplete
          multiple
          id="tags-standard"
          value={member.pocket_members}
          onChange={(e, value) => handleUpdatePocketMembers(value)}
          options={pocketOptions}
          getOptionLabel={(option) => option.person_name}
          isOptionEqualToValue={(option, value) => option.person_uid === value.person_uid}
          renderInput={(params) => <TextField {...params} variant="standard" label={t('students')} />}
          noOptionsText={t('noMatchRecord')}
        />
      </Box>
    </Box>
  );
};

export default CongregationPersonDelegates;
