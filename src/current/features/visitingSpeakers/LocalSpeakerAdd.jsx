import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { Persons } from '../../classes/Persons';
import { VisitingSpeakers } from '../../classes/VisitingSpeakers';
import { refreshScreenState } from '../../states/main';

const LocalSpeakerAdd = () => {
  const { t } = useTranslation('ui');

  const [refresh, setRefresh] = useRecoilState(refreshScreenState);

  const [options, setOptions] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const handleAddVisitingSpeaker = async () => {
    await VisitingSpeakers.add({ is_self: true, person_uid: selectedPerson.person_uid });
    setSelectedPerson(null);
    setRefresh((prev) => !prev);
  };

  useEffect(() => {
    const persons = Persons.filter({ assTypes: [120] });
    const tmpOptions = [];
    const localSpeakers = VisitingSpeakers.getSelf();

    for (const speaker of persons) {
      const isVisitingSpeaker = localSpeakers.find((record) => record.person_uid === speaker.person_uid);
      if (!isVisitingSpeaker) {
        tmpOptions.push(speaker);
      }
    }
    setOptions(tmpOptions);
  }, [refresh]);

  return (
    <Box sx={{ maxWidth: '320px', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '20px' }}>
      <Autocomplete
        id="select-visiting-speaker"
        size="small"
        fullWidth
        value={selectedPerson}
        onChange={(e, value) => setSelectedPerson(value)}
        options={options}
        getOptionLabel={(option) => option.person_name}
        isOptionEqualToValue={(option, value) => option.person_uid === value.person_uid}
        renderInput={(params) => <TextField {...params} variant="outlined" label={t('record')} />}
        noOptionsText={t('noMatchRecord')}
      />
      <IconButton aria-label="add" color="success" disabled={!selectedPerson} onClick={handleAddVisitingSpeaker}>
        <AddCircleIcon />
      </IconButton>
    </Box>
  );
};

export default LocalSpeakerAdd;
