import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { ApplyMinistryType } from '@definition/sources';
import { Week } from '@definition/week_type';
import { AssignmentCode, AssignmentFieldType } from '@definition/assignment';
import {
  MIDWEEK_WITH_STUDENTS_LANGUAGE_GROUP,
  STUDENT_ASSIGNMENT,
} from '@constants/index';
import { sourcesState } from '@states/sources';
import { schedulesState } from '@states/schedules';
import {
  JWLangLocaleState,
  JWLangState,
  settingsState,
} from '@states/settings';
import { PartRowProps } from './index.types';
import { sourcesCheckAYFExplainBeliefsAssignment } from '@services/app/sources';

const usePartRow = ({ type, week, dataView }: PartRowProps) => {
  const sources = useAtomValue(sourcesState);
  const lang = useAtomValue(JWLangState);
  const schedules = useAtomValue(schedulesState);
  const settings = useAtomValue(settingsState);
  const sourceLocale = useAtomValue(JWLangLocaleState);

  const classCount = useMemo(() => {
    return (
      settings.cong_settings.midweek_meeting.find(
        (record) => record.type === dataView
      )?.class_count.value ?? 1
    );
  }, [settings, dataView]);

  const ayfSource = useMemo(() => {
    const source = sources.find((record) => record.weekOf === week);

    if (!source) return;

    const ayfField = type.toString();

    return source.midweek_meeting[ayfField] as ApplyMinistryType;
  }, [sources, week, type]);

  const ayfType = useMemo(() => {
    if (!ayfSource) return;

    return ayfSource.type[lang];
  }, [ayfSource, lang]);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const weekType = useMemo(() => {
    if (!schedule) return Week.NORMAL;

    return (
      schedule.midweek_meeting?.week_type.find(
        (record) => record.type === dataView
      )?.value ?? Week.NORMAL
    );
  }, [schedule, dataView]);

  const languageWeekType = useMemo(() => {
    if (!schedule) return Week.NORMAL;

    return (
      schedule.midweek_meeting?.week_type.find(
        (record) => record.type !== 'main'
      )?.value ?? Week.NORMAL
    );
  }, [schedule]);

  const showAuxClass = useMemo(() => {
    return (
      classCount === 2 &&
      weekType !== Week.CO_VISIT &&
      !MIDWEEK_WITH_STUDENTS_LANGUAGE_GROUP.includes(languageWeekType)
    );
  }, [classCount, weekType, languageWeekType]);

  const studentField = useMemo(() => {
    const baseName = type.toString().replace('ayf_part', 'MM_AYFPart');
    return {
      main_hall: {
        student: `${baseName}_Student_A` as AssignmentFieldType,
        assistant: `${baseName}_Assistant_A` as AssignmentFieldType,
      },
      aux_class: {
        student: `${baseName}_Student_B` as AssignmentFieldType,
        assistant: `${baseName}_Assistant_B` as AssignmentFieldType,
      },
    };
  }, [type]);

  const showAssistant = useMemo(() => {
    if (!ayfSource) return false;

    if (!STUDENT_ASSIGNMENT.includes(ayfType)) return false;

    if (ayfType === AssignmentCode.MM_ExplainingBeliefs) {
      const src = ayfSource.src[lang];
      const isTalk = sourcesCheckAYFExplainBeliefsAssignment(src, sourceLocale);

      if (isTalk) return false;
    }

    return true;
  }, [ayfSource, ayfType, lang, sourceLocale]);

  return { ayfType, showAuxClass, studentField, showAssistant };
};

export default usePartRow;
