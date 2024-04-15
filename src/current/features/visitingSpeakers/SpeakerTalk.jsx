import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { S34s } from '../../classes/S34s';
import { VisitingSpeakers } from '../../classes/VisitingSpeakers';
import { refreshScreenState } from '../../states/main';
import { Setting } from '../../classes/Setting';

const SpeakerTalk = ({ speaker, readOnly }) => {
  const { t } = useTranslation('ui');

  const refreshScreen = useRecoilValue(refreshScreenState);

  const [talksList, setTalksList] = useState([]);
  const [selectedTalks, setSelectedTalks] = useState([]);

  const isEditor = Setting.cong_role.includes('public_talk_coordinator');

  const handleTalksUpdate = async (value) => {
    value = value.sort((a, b) => {
      return a.talk_number > b.talk_number ? 1 : -1;
    });

    await VisitingSpeakers.updateSpeakerTalks({
      talks: value,
      person_uid: speaker.person_uid,
      cong_number: speaker.cong_number,
    });
    setSelectedTalks(value);
  };

  useEffect(() => {
    const options = S34s.getLocal();
    setTalksList(options);

    const selected = speaker.talks.map((talk) => {
      const found = options.find((record) => record.talk_number === talk);
      return found;
    });

    setSelectedTalks(selected);
  }, [speaker, refreshScreen]);

  return (
    <>
      {talksList.length === 0 && (
        <Typography sx={{ fontSize: '14px', fontStyle: 'italic' }} color="orange">
          {t('talksListEmpty')}
        </Typography>
      )}
      {talksList.length > 0 && (
        <Autocomplete
          multiple
          size="small"
          fullWidth
          sx={{ maxWidth: '450px' }}
          options={talksList}
          value={selectedTalks}
          isOptionEqualToValue={(option, value) => option.talk_number === value.talk_number}
          readOnly={readOnly || !isEditor}
          freeSolo={readOnly}
          onChange={(_, value) => handleTalksUpdate(value)}
          getOptionLabel={(option) => option.talk_number.toString()}
          renderOption={(props, option) => <li {...props}>{`(${option.talk_number}) ${option.talk_title}`}</li>}
          renderInput={(params) => <TextField {...params} variant="outlined" label={t('talks')} />}
          noOptionsText={t('talksListEmpty')}
        />
      )}
    </>
  );
};

export default SpeakerTalk;
