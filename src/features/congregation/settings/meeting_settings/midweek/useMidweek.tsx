import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { generateDateFromTime } from '@utils/date';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { formatDate } from '@services/dateformat';
import { personsActiveState } from '@states/persons';
import { AssignmentCode } from '@definition/assignment';
import { personGetDisplayName } from '@utils/common';

const useMidweekSettings = () => {
  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);
  const persons = useRecoilValue(personsActiveState);
  const useDisplayName = useRecoilValue(displayNameMeetingsEnableState);
  const fullnameOption = useRecoilValue(fullnameOptionState);

  const [hour24, setHour24] = useState(false);
  const [meetingDay, setMeetingDay] = useState<number | string>('');
  const [meetingTime, setMeetingTime] = useState<Date>(null);
  const [autoAssignOpeningPrayer, setAutoAssignOpeningPrayer] = useState(false);
  const [autoAssignClosingPrayer, setAutoAssignClosingPrayer] = useState(false);
  const [auxClassEnabled, setAuxClassEnabled] = useState(false);
  const [auxCounselorMainEnabled, setAuxCounselorMainEnabled] = useState(false);
  const [auxCounselorMainPerson, setAuxCounselorMainPerson] = useState('');

  const personsAuxCounselorList = useMemo(() => {
    const elligiblePersons = persons.filter((record) =>
      record.person_data.assignments.find(
        (item) =>
          item._deleted === false &&
          item.code === AssignmentCode.MM_AuxiliaryCounselor
      )
    );

    const result = elligiblePersons.map((person) => {
      return {
        label: personGetDisplayName(person, useDisplayName, fullnameOption),
        value: person.person_uid,
      };
    });

    return result;
  }, [persons, useDisplayName, fullnameOption]);

  const handleMeetingDayChange = async (value: number) => {
    const midweekSettings = structuredClone(
      settings.cong_settings.midweek_meeting
    );

    const current = midweekSettings.find((record) => record.type === dataView);

    current.weekday.value = value;
    current.weekday.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.midweek_meeting': midweekSettings,
    });
  };

  const handleMeetingTimeChange = async (value: Date) => {
    const time = value ? formatDate(value, 'HH:mm') : '00:00';

    const midweekSettings = structuredClone(
      settings.cong_settings.midweek_meeting
    );

    const current = midweekSettings.find((record) => record.type === dataView);

    current.time.value = time;
    current.time.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.midweek_meeting': midweekSettings,
    });
  };

  const handleAutoOpeningPrayerToggle = async () => {
    const midweekSettings = structuredClone(
      settings.cong_settings.midweek_meeting
    );

    const current = midweekSettings.find((record) => record.type === dataView);

    current.opening_prayer_auto_assigned.value = !autoAssignOpeningPrayer;
    current.opening_prayer_auto_assigned.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.midweek_meeting': midweekSettings,
    });
  };

  const handleAutoClosingPrayerToggle = async () => {
    const midweekSettings = structuredClone(
      settings.cong_settings.midweek_meeting
    );

    const current = midweekSettings.find((record) => record.type === dataView);

    current.closing_prayer_auto_assigned.value = !autoAssignClosingPrayer;
    current.closing_prayer_auto_assigned.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.midweek_meeting': midweekSettings,
    });
  };

  const handleAuxClassToggle = async () => {
    const midweekSettings = structuredClone(
      settings.cong_settings.midweek_meeting
    );

    const current = midweekSettings.find((record) => record.type === dataView);

    current.class_count.value = auxClassEnabled ? 1 : 2;
    current.class_count.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.midweek_meeting': midweekSettings,
    });
  };

  const handleAuxCounselorMainToggle = async () => {
    const midweekSettings = structuredClone(
      settings.cong_settings.midweek_meeting
    );

    const current = midweekSettings.find((record) => record.type === dataView);

    current.aux_class_counselor_default.enabled.value =
      !auxCounselorMainEnabled;
    current.aux_class_counselor_default.enabled.updatedAt =
      new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.midweek_meeting': midweekSettings,
    });
  };

  const handleAuxCounselorMainPersonChange = async (value: string) => {
    const midweekSettings = structuredClone(
      settings.cong_settings.midweek_meeting
    );

    const current = midweekSettings.find((record) => record.type === dataView);

    current.aux_class_counselor_default.person.value = value;
    current.aux_class_counselor_default.person.updatedAt =
      new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.midweek_meeting': midweekSettings,
    });
  };

  useEffect(() => {
    const hourFormat = settings.cong_settings.format_24h_enabled.find(
      (record) => record.type === dataView
    );

    setHour24(hourFormat.value);

    const midweekSettings = settings.cong_settings.midweek_meeting.find(
      (record) => record.type === dataView
    );

    setMeetingDay(midweekSettings.weekday.value);
    setMeetingTime(generateDateFromTime(midweekSettings.time.value));
    setAutoAssignOpeningPrayer(
      midweekSettings.opening_prayer_auto_assigned.value
    );
    setAutoAssignClosingPrayer(
      midweekSettings.closing_prayer_auto_assigned.value
    );
    setAuxClassEnabled(midweekSettings.class_count.value === 2);
    setAuxCounselorMainEnabled(
      midweekSettings.aux_class_counselor_default.enabled.value
    );
    setAuxCounselorMainPerson(
      midweekSettings.aux_class_counselor_default.person.value
    );
  }, [settings, dataView]);

  return {
    meetingDay,
    handleMeetingDayChange,
    hour24,
    meetingTime,
    handleMeetingTimeChange,
    autoAssignOpeningPrayer,
    handleAutoOpeningPrayerToggle,
    autoAssignClosingPrayer,
    handleAutoClosingPrayerToggle,
    auxClassEnabled,
    handleAuxClassToggle,
    auxCounselorMainEnabled,
    handleAuxCounselorMainToggle,
    personsAuxCounselorList,
    auxCounselorMainPerson,
    handleAuxCounselorMainPersonChange,
  };
};

export default useMidweekSettings;
