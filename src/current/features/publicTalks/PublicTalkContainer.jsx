import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import { publicTalksState } from '../../states/sourceMaterial';
import PublicTalkEditor from './PublicTalkEditor';

const PublicTalkContainer = ({ currentPage, readOnly, setPublicTalk }) => {
  const publicTalks = useRecoilValue(publicTalksState);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {publicTalks.slice(currentPage * 10, currentPage * 10 + 10).map((talk) => (
        <PublicTalkEditor key={talk.talk_number} public_talk={talk} readOnly={readOnly} setPublicTalk={setPublicTalk} />
      ))}
    </Box>
  );
};

export default PublicTalkContainer;
