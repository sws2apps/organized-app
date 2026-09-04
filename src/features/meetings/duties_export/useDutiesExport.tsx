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
  schedulesDutiesExportSettingsSave,
  schedulesDutiesFieldList,
  schedulesDutiesGetFieldValue,
  schedulesDutiesSections,
  schedulesDutiesSectionTitle,
  schedulesGetMeetingDate,
} from '@services/app/schedules';
import { dutiesSourceId } from '@services/app/duties';
import { schedulesState } from '@states/schedules';
import { sourcesState } from '@states/sources';
import { personsState } from '@states/persons';
import { weekTypeLocaleState } from '@states/weekType';
import { headerForScheduleState } from '@states/field_service_groups';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
  JWLangLocaleState,
  meetingDutiesExportSettingsState,
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
import { MICROPHONE_GROUP_GAP } from '@views/meetings/duties/packDuties';
import { DutiesExportSettings, DutiesExportType } from './index.types';

type DutyMeeting = 'midweek' | 'weekend';

type DutyMatcher = (field: DutyFieldDefinitionType) => boolean;

type DutyGroup = (field: DutyFieldDefinitionType) => string | undefined;

type MeetingSlotType = {
  id: string;
  schedule: SchedWeekType;
  meeting: DutyMeeting;
  date: string;
  sortDate: string;
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
  const savedExportSettings = useAtomValue(meetingDutiesExportSettingsState);

  const [startWeek, setStartWeek] = useState('');
  const [endWeek, setEndWeek] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orientation, setOrientation] = useState(
    savedExportSettings.orientation
  );
  const [fontSize, setFontSize] = useState(savedExportSettings.fontSize);

  const handleSetStartWeek = (value: string) => setStartWeek(value);

  const handleSetEndWeek = (value: string) => setEndWeek(value);

  const handleSetOrientation = async (value: 'portrait' | 'landscape') => {
    setOrientation(value);

    await schedulesDutiesExportSettingsSave({ orientation: value, fontSize });
  };

  const handleSetFontSize = async (value: number) => {
    setFontSize(value);

    await schedulesDutiesExportSettingsSave({ orientation, fontSize: value });
  };

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
        MEETINGS.map((meeting) => {
          const meetingDate = schedulesGetMeetingDate({
            week: schedule.weekOf,
            meeting,
            short: true,
          });

          return {
            id: `${schedule.weekOf}_${meeting}`,
            schedule,
            meeting,
            date: meetingDate.locale,
            sortDate: meetingDate.date,
            event: meetingEvent(schedule, meeting),
          };
        })
      )
      .filter((slot) => slot.date.length > 0)
      .sort((first, second) => first.sortDate.localeCompare(second.sortDate));
  };

  const sectionNote = (
    slot: MeetingSlotType,
    field: DutyFieldDefinitionType
  ) => {
    if (!field.schedule_id) return undefined;

    const sourceId = dutiesSourceId(field.schedule_id);

    const section = schedulesDutiesSections(
      slot.schedule.weekOf,
      slot.meeting
    ).find((record) => record.id === sourceId);

    if (!section) return undefined;

    return schedulesDutiesSectionTitle(
      section,
      slot.schedule.weekOf,
      slot.meeting
    );
  };

  const dutyRows = (
    id: string,
    slots: MeetingSlotType[],
    fieldsOf: (slot: MeetingSlotType) => DutyFieldDefinitionType[],
    matcher: DutyMatcher,
    groupForField?: DutyGroup
  ): DutiesScheduleRowType[] => {
    return slots.map((slot) => {
      const assigned = slot.event
        ? []
        : fieldsOf(slot)
            .filter(matcher)
            .map((field) => ({
              id: `${slot.id}_${field.assignment}_${field.schedule_id ?? ''}`,
              name: personName(
                schedulesDutiesGetFieldValue(slot.schedule, field, dataView)
              ),
              groupId: groupForField?.(field),
              // the brother reads from the sheet which parts he covers
              note: sectionNote(slot, field),
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

    const fieldsOf = (slot: MeetingSlotType) =>
      schedulesDutiesFieldList(
        slot.meeting,
        config,
        schedulesDutiesSections(slot.schedule.weekOf, slot.meeting)
      );

    const allFields = slots.flatMap(fieldsOf);

    const cards: DutiesScheduleCardType[] = [];

    const addCard = (
      id: string,
      name: string,
      icon: DutiesCardIconType,
      matcher: DutyMatcher,
      meetings: DutyMeeting[] = MEETINGS,
      groupGap = 0,
      groupForField?: DutyGroup
    ) => {
      if (!allFields.some(matcher)) return;

      cards.push({
        id,
        name,
        icon,
        rows: dutyRows(
          id,
          slots.filter((slot) => meetings.includes(slot.meeting)),
          fieldsOf,
          matcher,
          groupForField
        ),
        groupGap,
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

    // every week brings its own sections, so the card collects them all
    const microphoneSections = slots.flatMap((slot) =>
      schedulesDutiesSections(slot.schedule.weekOf, slot.meeting)
    );

    const microphoneGroup = (field: DutyFieldDefinitionType) =>
      microphoneSections.find((section) =>
        field.schedule_id?.startsWith(`${section.id}_`)
      )?.id;

    if (microphoneSections.length > 0) {
      addCard(
        'microphone-sections',
        t('tr_dutiesMicrophones'),
        'microphone',
        (field) =>
          field.type === AssignmentCode.DUTIES_Microphone &&
          Boolean(microphoneGroup(field)),
        MEETINGS,
        MICROPHONE_GROUP_GAP,
        microphoneGroup
      );
    }

    // custom duties keep their own card and name
    for (const item of (config.custom ?? []).filter(
      (record) => !record._deleted
    )) {
      addCard(item.id, item.name, 'custom', (field) =>
        Boolean(field.schedule_id?.startsWith(`${item.id}_`))
      );
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
    orientation,
    fontSize,
    handleSetStartWeek,
    handleSetEndWeek,
    handleSetOrientation,
    handleSetFontSize,
    handleExportSchedules,
  };
};

export default useDutiesExport;
