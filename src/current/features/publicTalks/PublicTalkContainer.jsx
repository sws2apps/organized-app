import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import { publicTalksState } from '../../states/sourceMaterial';
import PublicTalkEditor from './PublicTalkEditor';

const PublicTalkContainer = ({ currentPage }) => {
  const publicTalks = useRecoilValue(publicTalksState);

  const talksSlice = useMemo(
    () => publicTalks.slice(currentPage * 10, currentPage * 10 + 10),
    [publicTalks, currentPage]
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {talksSlice.map((talk) => (
        <PublicTalkEditor key={talk.talk_number} public_talk={talk} />
      ))}
    </Box>
  );
};

export default PublicTalkContainer;
