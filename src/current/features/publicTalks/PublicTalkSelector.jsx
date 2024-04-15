import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { S34s } from '../../classes/S34s';
import { refreshScreenState } from '../../states/main';
import { Setting } from '../../classes/Setting';

const PublicTalkSelector = ({
  PublicTalk,
  setPublicTalk,
  noWMeeting,
  readOnly,
  closeVisitingSpeaker,
  isVisitingSpeaker,
  removeSpeaker,
}) => {
  const { t } = useTranslation('ui');

  const setRefreshScreen = useSetRecoilState(refreshScreenState);

  const [talksList, setTalksList] = useState([]);
  const [selectedTalk, setSelectedTalk] = useState(null);

  const isEditor = Setting.cong_role.includes('public_talk_coordinator');

  const handleChangeTalk = (value) => {
    closeVisitingSpeaker();
    if (isVisitingSpeaker) {
      removeSpeaker();
    }
    setSelectedTalk(value);
    setPublicTalk(value === null ? '' : value.talk_number);
    setRefreshScreen((prev) => !prev);
  };

  useEffect(() => {
    setTalksList(S34s.getLocal());
  }, []);

  useEffect(() => {
    if (PublicTalk === '') {
      setSelectedTalk(null);
      return;
    }

    const find = talksList.find((record) => record.talk_number === PublicTalk);
    setSelectedTalk(find);
  }, [PublicTalk, talksList]);

  return (
    <Autocomplete
      id="public_talk_selector"
      size="small"
      fullWidth
      readOnly={noWMeeting || readOnly || !isEditor}
      value={talksList.length === 0 ? null : selectedTalk}
      onChange={(e, value) => handleChangeTalk(value)}
      options={talksList}
      getOptionLabel={(option) => `(${option.talk_number}) ${option.talk_title}`}
      renderInput={(params) => <TextField {...params} variant="outlined" label={t('publicTalk')} />}
      noOptionsText={t('talksListEmpty')}
    />
  );
};

export default PublicTalkSelector;
