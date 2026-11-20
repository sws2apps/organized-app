import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  AssignmentCode,
  DutiesMeetingPrefixType,
} from '@definition/assignment';
import {
  schedulesState,
  selectedWeekState,
  dutiesSelectedMeetingState,
} from '@states/schedules';
import {
  dutiesCustomState,
  dutiesScheduleWeeklyState,
  meetingDutiesState,
  settingsState,
  userDataViewState,
  JWLangState,
} from '@states/settings';
import { sourcesState } from '@states/sources';
import { fieldServiceGroupsState } from '@states/field_service_groups';
import {
  schedulesDutiesFieldList,
  schedulesDutiesMeetingStatus,
  schedulesDutiesSections,
  schedulesResolveMeetingDate,
} from '@services/app/schedules';
import {
  formatMediumDateWithFullMonth,
  formatDate,
  getWeekDate,
} from '@utils/date';
import { useAppTranslation } from '@hooks/index';
import useWeekNavigation from '@features/meetings/hooks/useWeekNavigation';
import { DutyFieldType } from '@features/meetings/duties_schedule/duty_row/index.types';
import { DutiesMeetingValue } from '@services/app/duties';

const MEETING_PREFIX: Record<DutiesMeetingValue, DutiesMeetingPrefixType> = {
  midweek: 'MM',
  weekend: 'WM',
};

const useDutiesEditor = () => {
  const { t } = useAppTranslation();

  const [selectedWeek, setSelectedWeek] = useAtom(selectedWeekState);

  const navigationRef = useRef<HTMLDivElement>(null);
  const [isNavigationWrapped, setIsNavigationWrapped] = useState(false);

  const schedules = useAtomValue(schedulesState);
  const settings = useAtomValue(settingsState);
  const weekly = useAtomValue(dutiesScheduleWeeklyState);
  const dutiesConfig = useAtomValue(meetingDutiesState);
  const customDuties = useAtomValue(dutiesCustomState);
  const sources = useAtomValue(sourcesState);
  const dataView = useAtomValue(userDataViewState);
  const lang = useAtomValue(JWLangState);
  const groups = useAtomValue(fieldServiceGroupsState);

  const [selectedMeeting, setActiveMeeting] = useAtom(
    dutiesSelectedMeetingState
  );

  const { handleChangeWeekBack, handleChangeWeekNext, showWeekArrows } =
    useWeekNavigation(selectedWeek, setSelectedWeek);

  // a cancelled meeting or one without material has no duties to fill
  const meetingStatus = useMemo(() => {
    const schedule = schedules.find((record) => record.weekOf === selectedWeek);

    return {
      midweek: schedule
        ? schedulesDutiesMeetingStatus(schedule, 'midweek')
        : 'missing-materials',
      weekend: schedule
        ? schedulesDutiesMeetingStatus(schedule, 'weekend')
        : 'missing-materials',
    };
    // the held check reads sources and the data view from the store
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWeek, schedules, sources, dataView, lang, groups]);

  let activeMeeting = selectedMeeting;
  if (weekly && meetingStatus.midweek === 'held') activeMeeting = 'midweek';
  else if (weekly && meetingStatus.weekend === 'held')
    activeMeeting = 'weekend';

  useLayoutEffect(() => {
    const row = navigationRef.current;
    if (!row) return;
    const [date, tabs] = row.children;
    if (!date || !tabs) {
      setIsNavigationWrapped(false);
      return;
    }

    const measure = () => {
      setIsNavigationWrapped(
        tabs.getBoundingClientRect().top >= date.getBoundingClientRect().bottom
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    observer.observe(date);
    observer.observe(tabs);
    return () => observer.disconnect();
  }, [selectedWeek, weekly]);

  const schedule = schedules.find((record) => record.weekOf === selectedWeek);
  const headerDate =
    !weekly && schedule
      ? schedulesResolveMeetingDate({
          settings,
          schedule,
          meeting: activeMeeting,
          dataView,
        })
      : selectedWeek;
  const weekDateLocale = selectedWeek
    ? formatMediumDateWithFullMonth(headerDate)
    : '';

  // rendered fields come from the same list that drives counters and autofill
  const dutyRows = useMemo(() => {
    const fields =
      dutiesConfig && meetingStatus[activeMeeting] === 'held'
        ? schedulesDutiesFieldList(
            activeMeeting,
            dutiesConfig,
            schedulesDutiesSections(selectedWeek, activeMeeting)
          )
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
    // the sections of the week come from the schedules
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeMeeting,
    meetingStatus,
    dutiesConfig,
    customDuties,
    selectedWeek,
    schedules,
    t,
  ]);

  const handleChangeMeeting = setActiveMeeting;

  return {
    navigationRef,
    isNavigationWrapped,
    dataView,
    weekly,
    weekDateLocale,
    isCurrentWeek: selectedWeek === formatDate(getWeekDate(), 'yyyy/MM/dd'),
    selectedWeek,
    showWeekNav: showWeekArrows,
    activeMeeting,
    activePrefix: MEETING_PREFIX[activeMeeting],
    micSectionsEnabled: !weekly && (dutiesConfig?.mic_sections.value ?? false),
    meetingStatus,
    dutyRows,
    handleChangeMeeting,
    handleChangeWeekBack,
    handleChangeWeekNext,
  };
};

export default useDutiesEditor;
