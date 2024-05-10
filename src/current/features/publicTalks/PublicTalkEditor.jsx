import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { Schedules } from '../../classes/Schedules';
import PublicTalkHistory from './PublicTalkHistory';
import PublicTalkNumber from './PublicTalkNumber';

const PublicTalkEditor = ({ public_talk }) => {
  const [title, setTitle] = useState('');

  const history = Schedules.talkHistory.find((record) => record.talk_number === public_talk.talk_number);

  useEffect(() => {
    let title = public_talk.talk_title;
    if (history.last_delivered_formatted !== '') title += ` (${history.last_delivered_formatted})`;
    setTitle(title);
  }, [public_talk, history]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
        <PublicTalkNumber talk_number={public_talk.talk_number} />
        <Box sx={{ width: '100%' }}>
          <TextField variant="outlined" size="small" fullWidth InputProps={{ readOnly: true }} value={title} />

          <PublicTalkHistory talk_number={public_talk.talk_number} />
        </Box>
      </Box>
    </Box>
  );
};

export default PublicTalkEditor;
