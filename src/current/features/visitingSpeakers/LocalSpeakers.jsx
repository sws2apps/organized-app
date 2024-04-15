import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import LocalSpeakerAdd from './LocalSpeakerAdd';
import LocalSpeakersAccess from './LocalSpeakersAccess';
import OutgoingSpeaker from './OutgoingSpeaker';
import { refreshScreenState } from '../../states/main';
import { VisitingSpeakers } from '../../classes/VisitingSpeakers';
import { Setting } from '../../classes/Setting';

const LocalSpeakers = ({ speakersAccessOpen }) => {
  const screenRefresh = useRecoilValue(refreshScreenState);

  const [speakers, setSpeakers] = useState([]);

  const isEditor = Setting.cong_role.includes('public_talk_coordinator');

  useEffect(() => {
    const localSpeakers = VisitingSpeakers.getSelf();
    setSpeakers(localSpeakers);
  }, [screenRefresh]);

  return (
    <Box>
      {/* Access List */}
      <LocalSpeakersAccess speakersAccessOpen={speakersAccessOpen} />

      {/* Local Speakers List */}
      {speakers.map((speaker) => (
        <OutgoingSpeaker key={speaker.person_uid} speaker={speaker} />
      ))}

      {/* Speaker Selector  */}
      {isEditor && <LocalSpeakerAdd />}
    </Box>
  );
};

export default LocalSpeakers;
