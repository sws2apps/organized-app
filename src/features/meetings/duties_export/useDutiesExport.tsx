import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { AssignmentCode } from '@definition/assignment';
import { SchedWeekType } from '@definition/schedules';
import { Week } from '@definition/week_type';
import { WEEK_TYPE_NO_MEETING } from '@constants/index';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import {
  DutyFieldDefinitionType,
  MeetingDutiesConfigType,
  schedulesDutiesConfig,
  schedulesDutiesFieldList,
  schedulesDutiesGetFieldValue,
  schedulesGetMeetingDate,
} from '@services/app/schedules';
import { schedulesState } from '@states/schedules';
import { sourcesState } from '@states/sources';
import { personsState } from '@states/persons';
import { weekTypeLocaleState } from '@states/weekType';
import { headerForScheduleState } from '@states/field_service_groups';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
  JWLangLocaleState,
  userDataViewState,
} from '@states/settings';
import { personGetDisplayName } from '@utils/common';
import { useAppTranslation } from '@hooks/index';
import {
  DutiesCardIconType,
  DutiesScheduleCardType,
  DutiesScheduleRowType,
} from '@views/meetings/duties/index.types';
import { TemplateMeetingDuties } from '@views/index';
import { DutiesExportSettings, DutiesExportType } from './index.types';

type DutyMeeting = 'midweek' | 'weekend';

type DutyMatcher = (field: DutyFieldDefinitionType) => boolean;

type MeetingSlotType = {
  id: string;
  schedule: SchedWeekType;
  meeting: DutyMeeting;
  date: string;
  event?: string;
};

const MEETINGS: DutyMeeting[] = ['midweek', 'weekend'];

// combined and split audio/video coexist here: only the duty the congregation
// configured produces fields, so the unused ones drop out on their own
const STATIC_DUTIES: {
  code: AssignmentCode;
  icon: DutiesCardIconType;
  label: string;
}[] = [
  {
    code: AssignmentCode.DUTIES_AudioVideo,
    icon: 'audioVideo',
    label: 'tr_audioVideo',
  },
  { code: AssignmentCode.DUTIES_Audio, icon: 'audio', label: 'tr_dutiesAudio' },
  { code: AssignmentCode.DUTIES_Video, icon: 'video', label: 'tr_dutiesVideo' },
  {
    code: AssignmentCode.DUTIES_Microphone,
    icon: 'microphone',
    label: 'tr_dutiesMicrophones',
  },
  { code: AssignmentCode.DUTIES_Stage, icon: 'stage', label: 'tr_dutiesStage' },
  {
    code: AssignmentCode.DUTIES_EntranceAttendant,
    icon: 'entranceAttendant',
    label: 'tr_dutiesEntranceAttendant',
  },
  {
    code: AssignmentCode.DUTIES_AuditoriumAttendant,
    icon: 'auditoriumAttendant',
    label: 'tr_dutiesAuditoriumAttendant',
  },
  {
    code: AssignmentCode.DUTIES_Hospitality,
    icon: 'hospitality',
    label: 'tr_hospitality',
  },
  {
    code: AssignmentCode.DUTIES_VideoconferenceHost,
    icon: 'videoconferenceHost',
    label: 'tr_dutiesVideoconferenceHost',
  },
];

const useDutiesExport = (onClose: DutiesExportType['onClose']) => {
  const { t } = useAppTranslation();

  const schedules = useAtomValue(schedulesState);
  const sources = useAtomValue(sourcesState);
  const persons = useAtomValue(personsState);
  const weekTypes = useAtomValue(weekTypeLocaleState);
  const dataView = useAtomValue(userDataViewState);
  const congregation = useAtomValue(headerForScheduleState);
  const sourceLang = useAtomValue(JWLangLocaleState);
  const displayNameEnabled = useAtomValue(displayNameMeetingsEnableState);
  const fullnameOption = useAtomValue(fullnameOptionState);

  const [startWeek, setStartWeek] = useState('');
  const [endWeek, setEndWeek] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSetStartWeek = (value: string) => setStartWeek(value);

  const handleSetEndWeek = (value: string) => setEndWeek(value);

  const personName = (uid: string) => {
    if (uid.length === 0) return '';

    const person = persons.find((record) => record.person_uid === uid);

    if (!person) return uid;

    return personGetDisplayName(person, displayNameEnabled, fullnameOption);
  };

  const meetingEvent = (schedule: SchedWeekType, meeting: DutyMeeting) => {
    const weekType =
      schedule[`${meeting}_meeting`].week_type.find(
        (record) => record.type === dataView
      )?.value ?? Week.NORMAL;

    if (!WEEK_TYPE_NO_MEETING.includes(weekType)) return undefined;

    const source = sources.find((record) => record.weekOf === schedule.weekOf);

    const eventName =
      source?.[`${meeting}_meeting`].event_name.find(
        (record) => record.type === dataView
      )?.value ?? '';

    if (eventName.length > 0) return eventName;

    return weekTypes.find((record) => record.id === weekType)?.week_type_name;
  };

  const meetingSlots = (weeks: SchedWeekType[]): MeetingSlotType[] => {
    return weeks
      .flatMap((schedule) =>
        MEETINGS.map((meeting) => ({
          id: `${schedule.weekOf}_${meeting}`,
          schedule,
          meeting,
          date: schedulesGetMeetingDate({
            week: schedule.weekOf,
            meeting,
            short: true,
          }).locale,
          event: meetingEvent(schedule, meeting),
        }))
      )
      .filter((slot) => slot.date.length > 0);
  };

  const dutyRows = (
    id: string,
    slots: MeetingSlotType[],
    fields: Record<DutyMeeting, DutyFieldDefinitionType[]>,
    matcher: DutyMatcher
  ): DutiesScheduleRowType[] => {
    return slots.map((slot) => {
      const assigned = slot.event
        ? []
        : fields[slot.meeting]
            .filter(matcher)
            .map((field) => ({
              id: `${slot.id}_${field.assignment}_${field.schedule_id ?? ''}`,
              name: personName(
                schedulesDutiesGetFieldValue(slot.schedule, field, dataView)
              ),
            }))
            .filter((person) => person.name.length > 0);

      return {
        id: `${id}_${slot.id}`,
        date: slot.date,
        event: slot.event,
        persons: assigned,
      };
    });
  };

  const dutyCards = (
    weeks: SchedWeekType[],
    config: MeetingDutiesConfigType
  ) => {
    const slots = meetingSlots(weeks);

    const fields: Record<DutyMeeting, DutyFieldDefinitionType[]> = {
      midweek: schedulesDutiesFieldList('midweek', config),
      weekend: schedulesDutiesFieldList('weekend', config),
    };

    const allFields = MEETINGS.flatMap((meeting) => fields[meeting]);

    const cards: DutiesScheduleCardType[] = [];

    const addCard = (
      id: string,
      name: string,
      icon: DutiesCardIconType,
      matcher: DutyMatcher
    ) => {
      if (!allFields.some(matcher)) return;

      cards.push({
        id,
        name,
        icon,
        rows: dutyRows(id, slots, fields, matcher),
      });
    };

    for (const duty of STATIC_DUTIES) {
      addCard(
        String(duty.code),
        t(duty.label),
        duty.icon,
        (field) => field.type === duty.code && !field.schedule_id
      );
    }

    // microphone sections and custom duties carry their own name and fields
    const named = [
      {
        items: config.sections ?? [],
        icon: 'microphone' as DutiesCardIconType,
      },
      { items: config.custom ?? [], icon: 'custom' as DutiesCardIconType },
    ];

    for (const { items, icon } of named) {
      for (const item of items.filter((record) => !record._deleted)) {
        addCard(item.id, item.name, icon, (field) =>
          Boolean(field.schedule_id?.startsWith(`${item.id}_`))
        );
      }
    }

    return cards;
  };

  const handleExportSchedules = async (settings: DutiesExportSettings) => {
    if (startWeek.length === 0 || endWeek.length === 0) return;

    try {
      setIsProcessing(true);

      const config = schedulesDutiesConfig();

      const weeks = schedules.filter(
        (schedule) => schedule.weekOf >= startWeek && schedule.weekOf <= endWeek
      );

      const duties = config ? dutyCards(weeks, config) : [];

      const blob = await pdf(
        <TemplateMeetingDuties
          duties={duties}
          congregation={congregation}
          lang={sourceLang}
          orientation={settings.orientation}
          fontSize={settings.fontSize}
        />
      ).toBlob();

      const filename = `MD_${startWeek.replaceAll('/', '')}-${endWeek.replaceAll('/', '')}.pdf`;

      saveAs(blob, filename);

      setIsProcessing(false);
      onClose?.();
    } catch (error) {
      console.error(error);

      setIsProcessing(false);
      onClose?.();

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode((error as Error).message),
        severity: 'error',
      });
    }
  };

  return {
    isProcessing,
    handleSetStartWeek,
    handleSetEndWeek,
    handleExportSchedules,
  };
};

export default useDutiesExport;
