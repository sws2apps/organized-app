import { useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { dbUpdateAppSettings } from '../../indexedDb/dbAppSettings';
import { allStudentsState } from '../../states/persons';
import { userLocalUidState } from '../../states/main';

const MyAssignmentsSetup = ({ overrideEdit, setOverrideEdit }) => {
  const { t } = useTranslation('ui');

  const setLocalUid = useSetRecoilState(userLocalUidState);

  const dbPersons = useRecoilValue(allStudentsState);

  const [isSelect, setIsSelect] = useState(false);
  const [value, setValue] = useState(null);

  const handleSetLocalUid = async () => {
    await dbUpdateAppSettings({ local_uid: value.person_uid });
    setLocalUid(value.person_uid);
    setOverrideEdit(false);
  };

  return (
    <Box>
      {!isSelect && (
        <>
          <Typography>{t('setup')}</Typography>
          <Box sx={{ marginTop: '5px', display: 'flex', gap: '5px' }}>
            <Button variant="contained" onClick={() => setIsSelect(true)}>
              {t('btnSetup')}
            </Button>
            {overrideEdit && (
              <Button color="error" variant="contained" onClick={() => setOverrideEdit(false)}>
                {t('cancel')}
              </Button>
            )}
          </Box>
        </>
      )}
      {isSelect && (
        <>
          <Typography sx={{ marginBottom: '5px' }}>{t('selectRecord')}</Typography>
          <Autocomplete
            id="tags-standard"
            value={value}
            onChange={(e, value) => setValue(value)}
            options={dbPersons}
            getOptionLabel={(option) => option.person_name || ''}
            renderInput={(params) => <TextField {...params} variant="standard" label={t('record')} />}
            noOptionsText={t('noMatchRecord')}
          />
          <Button variant="contained" sx={{ marginTop: '20px' }} disabled={value === null} onClick={handleSetLocalUid}>
            {t('save')}
          </Button>
        </>
      )}
    </Box>
  );
};

export default MyAssignmentsSetup;
