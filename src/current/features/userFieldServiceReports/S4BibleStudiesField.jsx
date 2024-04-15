import { useEffect, useState } from 'react';
import dateFormat from 'dateformat';
import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { BibleStudies } from '../../classes/BibleStudies';
import { refreshReportState } from '../../states/report';
import { UserS4Records } from '../../classes/UserS4Records';

const S4BibleStudiesField = ({ month, currentDate, value, setValue }) => {
  const { t } = useTranslation('ui');

  const setRefreshScreen = useSetRecoilState(refreshReportState);

  const options = BibleStudies.list.map((record) => {
    return { person_uid: record.uid, person_name: record.person_name };
  });

  const [bibleStudies, setBibleStudies] = useState([]);

  const handleUpdateBibleStudies = async (value) => {
    const values = value.map((record) => {
      return record.person_uid;
    });

    const tmpDate = dateFormat(new Date(currentDate), 'yyyy/mm/dd');

    const currentReport = await UserS4Records.get(tmpDate);
    currentReport.bibleStudies = values;
    currentReport.changes = currentReport.changes.filter((record) => record.field !== 'bibleStudies');
    currentReport.changes.push({ date: new Date(), field: 'bibleStudies', values });

    await currentReport.save();

    setValue(values);
    setRefreshScreen((prev) => !prev);
  };

  useEffect(() => {
    const tmpOptions = value.map((record) => {
      const bs = BibleStudies.get(record);
      return { person_uid: record, person_name: bs.person_name };
    });

    setBibleStudies(tmpOptions);
  }, [value]);

  return (
    <Box sx={{ margin: '10px 0', display: 'flex', flexDirection: 'column', maxWidth: '540px' }}>
      <Typography sx={{ lineHeight: 1.2, textAlign: 'center', fontSize: '13px', width: '280px', marginBottom: '5px' }}>
        {t('bibleStudies')}
      </Typography>

      <Autocomplete
        id="tags-standard"
        disablePortal
        multiple
        options={options}
        value={bibleStudies}
        onChange={(e, value) => handleUpdateBibleStudies(value)}
        getOptionLabel={(option) => option.person_name}
        isOptionEqualToValue={(option, value) => option.person_uid === value.person_uid}
        renderInput={(params) => <TextField {...params} variant="standard" />}
        noOptionsText={t('noMatchRecord')}
        fullWidth={true}
        sx={{ flexGrow: 1 }}
      />
    </Box>
  );
};

export default S4BibleStudiesField;
