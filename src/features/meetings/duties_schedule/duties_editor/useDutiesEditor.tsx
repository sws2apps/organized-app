import { useEffect, useMemo, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  AssignmentCode,
  AssignmentFieldType,
  DutiesMeetingPrefixType,
} from '@definition/assignment';
import { schedulesState, selectedWeekState } from '@states/schedules';
import { meetingDutiesState } from '@states/settings';
import { schedulesDutiesMeetingInfo } from '@services/app/schedules';
import { formatMediumDateWithFullMonth } from '@utils/date';
import { useAppTranslation } from '@hooks/index';
import { DutyFieldType } from '../duty_row/index.types';

export type DutiesMeetingValue = 'midweek' | 'weekend';

const MEETING_PREFIX: Record<DutiesMeetingValue, DutiesMeetingPrefixType> = {
  midweek: 'MM',
  weekend: 'WM',
};

const buildDutyFields = (
  meeting: DutiesMeetingValue,
  duty: 'Microphone' | 'Stage' | 'EntranceAttendant' | 'Hospitality',
  code: AssignmentCode,
  amount: number,
  label: string
): DutyFieldType[] => {
  return Array.from({ length: Math.min(amount, 4) }, (_, index) => ({
    assignment:
      `${MEETING_PREFIX[meeting]}_DUTIES_${duty}_${index + 1}` as AssignmentFieldType,
    type: code,
    label,
  }));
};

const useDutiesEditor = () => {
  const { t } = useAppTranslation();

  const [selectedWeek, setSelectedWeek] = useAtom(selectedWeekState);

  const schedules = useAtomValue(schedulesState);
  const dutiesConfig = useAtomValue(meetingDutiesState);

  const [activeMeeting, setActiveMeeting] =
    useState<DutiesMeetingValue>('midweek');

  const [showWeekNav, setShowWeekNav] = useState({
    back: false,
    next: false,
  });

  const allWeeks = useMemo(() => {
    return schedules.map((schedule) => schedule.weekOf);
  }, [schedules]);

  const weekDateLocale = useMemo(() => {
    if (selectedWeek.length === 0) return '';

    return formatMediumDateWithFullMonth(selectedWeek);
  }, [selectedWeek]);

  const meetingsInfo = useMemo(() => {
    if (selectedWeek.length === 0) {
      return {
        midweek: { assigned: 0, total: 0 },
        weekend: { assigned: 0, total: 0 },
      };
    }

    return {
      midweek: schedulesDutiesMeetingInfo(selectedWeek, 'midweek'),
      weekend: schedulesDutiesMeetingInfo(selectedWeek, 'weekend'),
    };
    // schedules and dutiesConfig drive the recount after saving an assignment
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWeek, schedules, dutiesConfig]);

  const dutyRows = useMemo(() => {
    const prefix = MEETING_PREFIX[activeMeeting];
    const responsible = t('tr_responsible');

    const avAmount = dutiesConfig?.av_amount.value ?? 2;

    const audioVideo: DutyFieldType[] = [];

    if (avAmount >= 1) {
      audioVideo.push({
        assignment: `${prefix}_DUTIES_Audio`,
        type: AssignmentCode.DUTIES_Audio,
        label: responsible,
      });
    }

    if (avAmount >= 2) {
      audioVideo.push({
        assignment: `${prefix}_DUTIES_Video`,
        type: AssignmentCode.DUTIES_Video,
        label: responsible,
      });
    }

    return {
      audioVideo,
      microphones: buildDutyFields(
        activeMeeting,
        'Microphone',
        AssignmentCode.DUTIES_Microphone,
        dutiesConfig?.mic_amount.value ?? 0,
        responsible
      ),
      stage: buildDutyFields(
        activeMeeting,
        'Stage',
        AssignmentCode.DUTIES_Stage,
        dutiesConfig?.stage_amount.value ?? 0,
        responsible
      ),
      entranceAttendant: buildDutyFields(
        activeMeeting,
        'EntranceAttendant',
        AssignmentCode.DUTIES_EntranceAttendant,
        dutiesConfig?.entrance_attendant_amount.value ?? 0,
        t('tr_attendant')
      ),
      auditoriumAttendant: [
        {
          assignment: `${prefix}_DUTIES_AuditoriumAttendant`,
          type: AssignmentCode.DUTIES_AuditoriumAttendant,
          label: t('tr_attendant'),
        },
      ] as DutyFieldType[],
      hospitality: buildDutyFields(
        activeMeeting,
        'Hospitality',
        AssignmentCode.DUTIES_Hospitality,
        dutiesConfig?.hospitality_amount.value ?? 0,
        t('tr_hospitality')
      ),
    };
  }, [activeMeeting, dutiesConfig, t]);

  const handleChangeMeeting = (tab: number) => {
    setActiveMeeting(tab === 0 ? 'midweek' : 'weekend');
  };

  const handleChangeWeekBack = () => {
    const selectedWeekIndex = allWeeks.indexOf(selectedWeek);

    if (selectedWeekIndex > 0) {
      setSelectedWeek(allWeeks[selectedWeekIndex - 1]);
    }
  };

  const handleChangeWeekNext = () => {
    const selectedWeekIndex = allWeeks.indexOf(selectedWeek);

    if (selectedWeekIndex < allWeeks.length - 1) {
      setSelectedWeek(allWeeks[selectedWeekIndex + 1]);
    }
  };

  useEffect(() => {
    const selectedWeekIndex = allWeeks.indexOf(selectedWeek);

    if (selectedWeekIndex !== -1) {
      setShowWeekNav({
        back: selectedWeekIndex !== 0,
        next: selectedWeekIndex + 1 !== allWeeks.length,
      });
    }
  }, [allWeeks, selectedWeek]);

  return {
    weekDateLocale,
    selectedWeek,
    showWeekNav,
    activeMeeting,
    meetingsInfo,
    dutyRows,
    handleChangeMeeting,
    handleChangeWeekBack,
    handleChangeWeekNext,
  };
};

export default useDutiesEditor;
