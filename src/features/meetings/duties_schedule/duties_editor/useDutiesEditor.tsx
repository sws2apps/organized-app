import { useEffect, useMemo, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  AssignmentCode,
  DutiesMeetingPrefixType,
} from '@definition/assignment';
import { schedulesState, selectedWeekState } from '@states/schedules';
import { dutiesCustomState, meetingDutiesState } from '@states/settings';
import {
  schedulesDutiesFieldList,
  schedulesDutiesMeetingInfo,
} from '@services/app/schedules';
import {
  addDays,
  formatDate,
  formatMediumDateWithFullMonth,
} from '@utils/date';
import { useAppTranslation } from '@hooks/index';
import { DutyFieldType } from '../duty_row/index.types';

export type DutiesMeetingValue = 'midweek' | 'weekend';

const MEETING_PREFIX: Record<DutiesMeetingValue, DutiesMeetingPrefixType> = {
  midweek: 'MM',
  weekend: 'WM',
};

const useDutiesEditor = () => {
  const { t } = useAppTranslation();

  const [selectedWeek, setSelectedWeek] = useAtom(selectedWeekState);

  const schedules = useAtomValue(schedulesState);
  const dutiesConfig = useAtomValue(meetingDutiesState);
  const customDuties = useAtomValue(dutiesCustomState);

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

  // rendered fields come from the same list that drives counters and autofill
  const dutyRows = useMemo(() => {
    const fields = dutiesConfig
      ? schedulesDutiesFieldList(activeMeeting, dutiesConfig)
      : [];

    const responsible = t('tr_responsible');
    const attendant = t('tr_attendant');

    // sections and custom duties carry a schedule_id and render on their own
    const byType = (type: AssignmentCode, label: string): DutyFieldType[] =>
      fields
        .filter((field) => field.type === type && !field.schedule_id)
        .map((field) => ({ ...field, label }));

    return {
      // one column per duty: combined has a single one, split keeps them apart
      audioVideo: [
        byType(AssignmentCode.DUTIES_AudioVideo, responsible),
        byType(AssignmentCode.DUTIES_Audio, t('tr_dutiesAudio')),
        byType(AssignmentCode.DUTIES_Video, t('tr_dutiesVideo')),
      ],
      microphones: byType(AssignmentCode.DUTIES_Microphone, responsible),
      stage: byType(AssignmentCode.DUTIES_Stage, responsible),
      entranceAttendant: byType(
        AssignmentCode.DUTIES_EntranceAttendant,
        attendant
      ),
      auditoriumAttendant: byType(
        AssignmentCode.DUTIES_AuditoriumAttendant,
        attendant
      ),
      hospitality: byType(
        AssignmentCode.DUTIES_Hospitality,
        t('tr_hospitality')
      ),
      videoconferenceHost: byType(
        AssignmentCode.DUTIES_VideoconferenceHost,
        responsible
      ),
      custom: customDuties.map((duty) => ({
        id: duty.id,
        name: duty.name,
        fields: fields
          .filter((field) => field.schedule_id?.startsWith(`${duty.id}_`))
          .map((field): DutyFieldType => ({ ...field, label: responsible })),
      })),
    };
  }, [activeMeeting, dutiesConfig, customDuties, t]);

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

  // open the next unassigned week by default instead of the empty state
  useEffect(() => {
    if (selectedWeek.length > 0 || schedules.length === 0) return;

    // the running week has weekOf at most 6 days back
    const minWeekOf = formatDate(addDays(new Date(), -6), 'yyyy/MM/dd');

    const candidates = schedules.filter(
      (schedule) => schedule.weekOf >= minWeekOf
    );

    const nextUnassigned = candidates.find((schedule) => {
      const midweek = schedulesDutiesMeetingInfo(schedule.weekOf, 'midweek');
      const weekend = schedulesDutiesMeetingInfo(schedule.weekOf, 'weekend');
      const total = midweek.total + weekend.total;

      return total > 0 && midweek.assigned + weekend.assigned < total;
    });

    const nextWeek = nextUnassigned ?? candidates.at(0);

    if (nextWeek) setSelectedWeek(nextWeek.weekOf);
  }, [selectedWeek, schedules, setSelectedWeek]);

  return {
    weekDateLocale,
    selectedWeek,
    showWeekNav,
    activeMeeting,
    activePrefix: MEETING_PREFIX[activeMeeting],
    micSectionsEnabled: dutiesConfig?.mic_sections.value ?? false,
    meetingsInfo,
    dutyRows,
    handleChangeMeeting,
    handleChangeWeekBack,
    handleChangeWeekNext,
  };
};

export default useDutiesEditor;
