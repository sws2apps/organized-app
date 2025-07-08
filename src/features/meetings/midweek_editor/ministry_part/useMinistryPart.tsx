import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { ApplyMinistryType, SourceAssignmentType } from '@definition/sources';
import { MIDWEEK_WITH_STUDENTS_LANGUAGE_GROUP } from '@constants/index';
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
  const sources = useAtomValue(sourcesState);
  const lang = useAtomValue(JWLangState);
  const classCount = useAtomValue(midweekMeetingClassCountState);
  const schedules = useAtomValue(schedulesState);
  const dataView = useAtomValue(userDataViewState);
  const sourceLocale = useAtomValue(JWLangLocaleState);

  const source = useMemo(() => {
    return sources.find((record) => record.weekOf === selectedWeek);
  }, [selectedWeek, sources]);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === selectedWeek);
  }, [selectedWeek, schedules]);

  const weekType = useMemo(() => {
    if (!schedule) return;

    const weekType =
      schedule.midweek_meeting.week_type.find(
        (record) => record.type === dataView
      )?.value ?? Week.NORMAL;

    return weekType;
  }, [dataView, schedule]);

  const languageWeekType = useMemo(() => {
    if (!schedule) return Week.NORMAL;

    return (
      schedule.midweek_meeting.week_type.find(
        (record) => record.type !== 'main'
      )?.value ?? Week.NORMAL
    );
  }, [schedule]);

  const showDoublePerson = useMemo(() => {
    return (
      classCount === 2 &&
      weekType !== Week.CO_VISIT &&
      !MIDWEEK_WITH_STUDENTS_LANGUAGE_GROUP.includes(languageWeekType)
    );
  }, [classCount, weekType, languageWeekType]);

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

  return {
    type,
    assignmentType,
    doublePerson,
    showAssistant,
    assignmentName,
    dataView,
  };
};

export default useMinistryPart;
