import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { ApplyMinistryType } from '@definition/sources';
import { sourcesState } from '@states/sources';
import { PartRowProps } from './index.types';
import { schedulesState } from '@states/schedules';
import {
  JWLangLocaleState,
  JWLangState,
  midweekMeetingClassCountState,
  userDataViewState,
} from '@states/settings';
import { Week } from '@definition/week_type';
import { AssignmentCode, AssignmentFieldType } from '@definition/assignment';
import { STUDENT_ASSIGNMENT } from '@constants/index';
import { sourcesCheckAYFExplainBeliefsAssignment } from '@services/app/sources';

const usePartRow = ({ type, week }: PartRowProps) => {
  const sources = useRecoilValue(sourcesState);
  const lang = useRecoilValue(JWLangState);
  const schedules = useRecoilValue(schedulesState);
  const classCount = useRecoilValue(midweekMeetingClassCountState);
  const dataView = useRecoilValue(userDataViewState);
  const sourceLocale = useRecoilValue(JWLangLocaleState);

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

    const type = schedule.midweek_meeting.week_type.find(
      (record) => record.type === dataView
    );

    return type?.value || Week.NORMAL;
  }, [schedule, dataView]);

  const showAuxClass = useMemo(() => {
    if (weekType === Week.CO_VISIT) {
      return false;
    }

    if (classCount === 1) {
      return false;
    }

    return true;
  }, [classCount, weekType]);

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
