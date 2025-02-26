import { useMemo } from 'react';
import { BROTHER_ASSIGNMENT, STUDENT_ASSIGNMENT } from '@constants/index';
import { AssignmentCode } from '@definition/assignment';
import { PersonSelectorType } from './index.types';

const usePersonSelector = ({
  type,
  visitingSpeaker,
  jwStreamRecording,
  circuitOverseer,
  assignment,
}: PersonSelectorType) => {
  const isBrother = useMemo(() => {
    return (
      !visitingSpeaker &&
      !jwStreamRecording &&
      (BROTHER_ASSIGNMENT.includes(type) ||
        type === AssignmentCode.MM_Discussion)
    );
  }, [visitingSpeaker, jwStreamRecording, type]);

  const isStudent = useMemo(() => {
    return (
      STUDENT_ASSIGNMENT.includes(type) ||
      type === AssignmentCode.MM_BibleReading ||
      type === AssignmentCode.MM_Talk
    );
  }, [type]);

  const isCircuitOverseer = useMemo(() => circuitOverseer, [circuitOverseer]);

  const isStreamSpeaker = useMemo(() => jwStreamRecording, [jwStreamRecording]);

  const isOutgoingSpeaker = useMemo(
    () => assignment === 'WM_Speaker_Outgoing',
    [assignment]
  );

  const isVisitingSpeaker = useMemo(() => visitingSpeaker, [visitingSpeaker]);

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
