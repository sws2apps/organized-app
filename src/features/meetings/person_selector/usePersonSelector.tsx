import { BROTHER_ASSIGNMENT, STUDENT_ASSIGNMENT } from '@constants/index';
import { PersonSelectorType } from './index.types';
import { AssignmentCode } from '@definition/assignment';

const usePersonSelector = ({
  type,
  visitingSpeaker,
  jwStreamRecording,
  circuitOverseer,
  assignment,
}: PersonSelectorType) => {
  const isBrother =
    !visitingSpeaker &&
    !jwStreamRecording &&
    (BROTHER_ASSIGNMENT.includes(type) ||
      type === AssignmentCode.MM_Discussion ||
      type === AssignmentCode.MM_Talk);

  const isStudent =
    STUDENT_ASSIGNMENT.includes(type) ||
    type === AssignmentCode.MM_BibleReading;

  const isCircuitOverseer = circuitOverseer;

  const isStreamSpeaker = jwStreamRecording;

  const isOutgoingSpeaker = assignment === 'WM_Speaker_Outgoing';

  const isVisitingSpeaker = visitingSpeaker;

  return {
    isBrother,
    isStudent,
    isCircuitOverseer,
    isStreamSpeaker,
    isOutgoingSpeaker,
    isVisitingSpeaker,
  };
};

export default usePersonSelector;
