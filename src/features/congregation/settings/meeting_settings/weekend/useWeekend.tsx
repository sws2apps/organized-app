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

const useWeekendSettings = () => {
  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);
  const persons = useRecoilValue(personsActiveState);
  const useDisplayName = useRecoilValue(displayNameMeetingsEnableState);
  const fullnameOption = useRecoilValue(fullnameOptionState);

  const [hour24, setHour24] = useState(false);
  const [meetingDay, setMeetingDay] = useState<number | string>('');
  const [meetingTime, setMeetingTime] = useState<Date>(null);
  const [autoAssignOpeningPrayer, setAutoAssignOpeningPrayer] = useState(false);
  const [substituteSpeakerEnabled, setSubstituteSpeakerEnabled] =
    useState(false);
  const [subtituteWTConductorDisplayed, setSubtituteWTConductorDisplayed] =
    useState(true);
  const [wtConductorMainPerson, setWTConductorMainPerson] = useState('');
  const [monthlyOverlapShown, setMonthlyOverlapShown] = useState(true);

  const personsWTCondcutorList = useMemo(() => {
    const elligiblePersons = persons.filter((record) =>
      record.person_data.assignments.find(
        (item) =>
          item._deleted === false &&
          item.code === AssignmentCode.WM_WTStudyConductor
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
    const weekendSettings = structuredClone(
      settings.cong_settings.weekend_meeting
    );

    const current = weekendSettings.find((record) => record.type === dataView);

    current.weekday.value = value;
    current.weekday.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.weekend_meeting': weekendSettings,
    });
  };

  const handleMeetingTimeChange = async (value: Date) => {
    const time = value ? formatDate(value, 'HH:mm') : '00:00';

    const weekendSettings = structuredClone(
      settings.cong_settings.weekend_meeting
    );

    const current = weekendSettings.find((record) => record.type === dataView);

    current.time.value = time;
    current.time.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.weekend_meeting': weekendSettings,
    });
  };

  const handleAutoOpeningPrayerToggle = async () => {
    const weekendSettings = structuredClone(
      settings.cong_settings.weekend_meeting
    );

    const current = weekendSettings.find((record) => record.type === dataView);

    current.opening_prayer_auto_assigned.value = !autoAssignOpeningPrayer;
    current.opening_prayer_auto_assigned.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.weekend_meeting': weekendSettings,
    });
  };

  const handleSubstituteSpeakerToggle = async () => {
    const weekendSettings = structuredClone(
      settings.cong_settings.weekend_meeting
    );

    const current = weekendSettings.find((record) => record.type === dataView);

    current.substitute_speaker_enabled.value = !substituteSpeakerEnabled;
    current.substitute_speaker_enabled.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.weekend_meeting': weekendSettings,
    });
  };

  const handleWTConductorToggle = async () => {
    const weekendSettings = structuredClone(
      settings.cong_settings.weekend_meeting
    );

    const current = weekendSettings.find((record) => record.type === dataView);

    current.substitute_w_study_conductor_displayed.value =
      !subtituteWTConductorDisplayed;
    current.substitute_w_study_conductor_displayed.updatedAt =
      new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.weekend_meeting': weekendSettings,
    });
  };

  const handleMonthlyOverlapToggle = async () => {
    const weekendSettings = structuredClone(
      settings.cong_settings.weekend_meeting
    );

    const current = weekendSettings.find((record) => record.type === dataView);

    current.consecutive_monthly_parts_notice_shown.value = !monthlyOverlapShown;
    current.consecutive_monthly_parts_notice_shown.updatedAt =
      new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.weekend_meeting': weekendSettings,
    });
  };

  const handleWTConductorMainPersonChange = async (value: string) => {
    const weekendSettings = structuredClone(
      settings.cong_settings.weekend_meeting
    );

    const current = weekendSettings.find((record) => record.type === dataView);

    current.w_study_conductor_default.value = value;
    current.w_study_conductor_default.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.weekend_meeting': weekendSettings,
    });
  };

  useEffect(() => {
    const hourFormat = settings.cong_settings.format_24h_enabled.find(
      (record) => record.type === dataView
    );

    setHour24(hourFormat.value);

    const weekendSettings = settings.cong_settings.weekend_meeting.find(
      (record) => record.type === dataView
    );

    setMeetingDay(weekendSettings.weekday.value);
    setMeetingTime(generateDateFromTime(weekendSettings.time.value));
    setAutoAssignOpeningPrayer(
      weekendSettings.opening_prayer_auto_assigned.value
    );
    setSubstituteSpeakerEnabled(
      weekendSettings.substitute_speaker_enabled.value
    );
    setSubtituteWTConductorDisplayed(
      weekendSettings.substitute_w_study_conductor_displayed.value
    );
    setWTConductorMainPerson(weekendSettings.w_study_conductor_default.value);
    setMonthlyOverlapShown(
      weekendSettings.consecutive_monthly_parts_notice_shown.value
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
    handleWTConductorMainPersonChange,
    wtConductorMainPerson,
    personsWTCondcutorList,
    handleWTConductorToggle,
    handleMonthlyOverlapToggle,
    handleSubstituteSpeakerToggle,
    substituteSpeakerEnabled,
    subtituteWTConductorDisplayed,
    monthlyOverlapShown,
  };
};

export default useWeekendSettings;
