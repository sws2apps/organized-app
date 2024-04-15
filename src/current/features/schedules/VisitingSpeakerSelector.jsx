import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import IconButton from '@mui/material/IconButton';
import VisitingTalkSpeakers from './VisitingTalkSpeakers';
import { VisitingSpeakers } from '../../classes/VisitingSpeakers';
import { refreshScreenState } from '../../states/main';

const VisitingSpeakerSelector = ({ open, public_talk, close, weekOf, speaker }) => {
  const refreshScreen = useRecoilValue(refreshScreenState);

  const [talks, setTalks] = useState([]);

  const handleClose = () => {
    close();
  };

  useEffect(() => {
    if (open) {
      const data = VisitingSpeakers.incomingSpeakersTalks(public_talk);
      setTalks(data);
    }
  }, [open, public_talk, refreshScreen]);

  return (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Box
        sx={{
          marginTop: '15px',
          border: '1px outset',
          borderRadius: '5px',
          padding: '10px',
          maxWidth: '800px',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={handleClose}>
            <ExpandLessIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', marginTop: '15px' }}>
          {talks.map((talk) => (
            <VisitingTalkSpeakers
              key={`incoming-speaker-selector-${talk.talk_number}`}
              talk={talk}
              weekOf={weekOf}
              handleClose={handleClose}
              speaker={speaker}
            />
          ))}
        </Box>
      </Box>
    </Collapse>
  );
};

export default VisitingSpeakerSelector;
