import { Box } from '@mui/material';
import { PersonSelectorType } from './index.types';
import usePersonSelector from './usePersonSelector';
import BrotherSelector from './brother_selector';
import CircuitOverseer from './circuit_overseer';
import OutgoingSpeaker from './outgoing_speaker';
import StreamSpeaker from './stream_speaker';
import StudentSelector from './student_selector';
import VisitingSpeaker from './visiting_speaker';

const PersonSelector = (props: PersonSelectorType) => {
  const flexPersonSelector = props.flex ?? true;

  const {
    isBrother,
    isStudent,
    isCircuitOverseer,
    isStreamSpeaker,
    isOutgoingSpeaker,
    isVisitingSpeaker,
  } = usePersonSelector(props);

  return (
    <Box sx={{ flex: flexPersonSelector ? 1 : null }}>
      {isBrother && <BrotherSelector {...props} />}
      {isStudent && <StudentSelector {...props} />}
      {isCircuitOverseer && <CircuitOverseer {...props} />}
      {isStreamSpeaker && <StreamSpeaker {...props} />}
      {isOutgoingSpeaker && <OutgoingSpeaker {...props} />}
      {isVisitingSpeaker && <VisitingSpeaker {...props} />}
    </Box>
  );
};

export default PersonSelector;
