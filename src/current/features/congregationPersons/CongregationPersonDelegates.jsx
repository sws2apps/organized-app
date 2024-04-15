import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const CongregationPersonDelegates = ({ person, member, handleUpdateUserDelegate }) => {
  const queryClient = useQueryClient();
  const options = queryClient.getQueryData(['congPersons']) || [];

  const { t } = useTranslation('ui');

  let pocketOptions = person ? options.filter((record) => record.user_local_uid !== person.user_local_uid) : [];
  pocketOptions = pocketOptions.map((record) => {
    return { user_local_uid: record.user_local_uid, username: record.username };
  });

  const value = member.user_members_delegate.map((selected) => {
    return { ...pocketOptions.find((record) => selected.person_uid === record.user_local_uid) };
  });

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
          value={value}
          onChange={(e, value) => handleUpdateUserDelegate(value)}
          options={pocketOptions}
          getOptionLabel={(option) => option.username}
          isOptionEqualToValue={(option, value) => option.user_local_uid === value.user_local_uid}
          renderInput={(params) => <TextField {...params} variant="standard" label={t('persons')} />}
          noOptionsText={t('noMatchRecord')}
        />
      </Box>
    </Box>
  );
};

export default CongregationPersonDelegates;
