import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { ApplyMinistryType, SourceAssignmentType } from '@definition/sources';
import { sourcesState } from '@states/sources';
import {
  JWLangLocaleState,
  JWLangState,
  midweekMeetingClassCountState,
  userDataViewState,
} from '@states/settings';
import { Week } from '@definition/week_type';
import { AssignmentCode, AssignmentFieldType } from '@definition/assignment';
import { MinistryPartProps } from './index.types';
import { schedulesState } from '@states/schedules';
import { sourcesCheckAYFExplainBeliefsAssignment } from '@services/app/sources';

const useMinistryPart = ({ part, selectedWeek }: MinistryPartProps) => {
  const sources = useRecoilValue(sourcesState);
  const lang = useRecoilValue(JWLangState);
  const classCount = useRecoilValue(midweekMeetingClassCountState);
  const schedules = useRecoilValue(schedulesState);
  const dataView = useRecoilValue(userDataViewState);
  const sourceLocale = useRecoilValue(JWLangLocaleState);

  const source = useMemo(() => {
    return sources.find((record) => record.weekOf === selectedWeek);
  }, [selectedWeek, sources]);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === selectedWeek);
  }, [selectedWeek, schedules]);

  const weekType = useMemo(() => {
    if (!schedule) return;

    const weekType = schedule.midweek_meeting.week_type.find(
      (record) => record.type === dataView
    );

    return weekType.value;
  }, [dataView, schedule]);

  const showDoublePerson = useMemo(() => {
    return classCount === 2 && weekType !== Week.CO_VISIT;
  }, [classCount, weekType]);

  const assignmentName = useMemo(() => {
    return {
      main_hall: {
        student: `MM_AYFPart${part}_Student_A` as AssignmentFieldType,
        assistant: `MM_AYFPart${part}_Assistant_A` as AssignmentFieldType,
      },
      aux_class_1: {
        student: `MM_AYFPart${part}_Student_B` as AssignmentFieldType,
        assistant: `MM_AYFPart${part}_Assistant_B` as AssignmentFieldType,
      },
    };
  }, [part]);

  const type = useMemo(() => {
    return `ayf_part${part}` as SourceAssignmentType;
  }, [part]);

  const ayfPart = useMemo(() => {
    return source.midweek_meeting[type] as ApplyMinistryType;
  }, [source, type]);

  const assignmentType = useMemo(() => {
    return ayfPart.type[lang];
  }, [ayfPart, lang]);

  const isTalk = useMemo(() => {
    if (ayfPart.type[lang] === AssignmentCode.MM_ExplainingBeliefs) {
      return sourcesCheckAYFExplainBeliefsAssignment(
        ayfPart.src[lang],
        sourceLocale
      );
    }

    return false;
  }, [ayfPart, lang, sourceLocale]);

  const doublePerson = useMemo(() => {
    return showDoublePerson && assignmentType !== AssignmentCode.MM_Discussion;
  }, [showDoublePerson, assignmentType]);

  const showAssistant = useMemo(() => {
    return (
      (assignmentType !== AssignmentCode.MM_ExplainingBeliefs &&
        assignmentType !== AssignmentCode.MM_Talk &&
        assignmentType !== AssignmentCode.MM_Discussion) ||
      (assignmentType === AssignmentCode.MM_ExplainingBeliefs && !isTalk)
    );
  }, [assignmentType, isTalk]);

  return { type, assignmentType, doublePerson, showAssistant, assignmentName };
};

export default useMinistryPart;
