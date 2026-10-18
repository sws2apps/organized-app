import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { formatDate } from '@utils/date';
import { personsState } from '@states/persons';
import {
  accountTypeState,
  settingsState,
  userDataViewState,
  userLocalUIDState,
} from '@states/settings';
import { congAccountConnectedState } from '@states/app';
import {
  fieldWithLanguageGroupsState,
  languageGroupsState,
} from '@states/field_service_groups';
import usePerson from '@features/persons/hooks/usePerson';

const useCurrentUser = () => {
  const {
    personIsEnrollmentActive,
    personIsBaptizedPublisher,
    personIsPublisher,
  } = usePerson();

  const userUID = useAtomValue(userLocalUIDState);
  const persons = useAtomValue(personsState);
  const settings = useAtomValue(settingsState);
  const connected = useAtomValue(congAccountConnectedState);
  const accountType = useAtomValue(accountTypeState);
  const fieldGroups = useAtomValue(fieldWithLanguageGroupsState);
  const languageGroups = useAtomValue(languageGroupsState);
  const dataView = useAtomValue(userDataViewState);

  const person = useMemo(() => {
    return persons.find((record) => record.person_uid === userUID);
  }, [persons, userUID]);

  const first_report = useMemo(() => {
    if (!person) return;

    if (person.person_data.first_report?.value) {
      return formatDate(
        new Date(person.person_data.first_report.value),
        'yyyy/MM'
      );
    }

    if (
      !person.person_data.publisher_unbaptized &&
      !person.person_data.publisher_baptized
    ) {
      return;
    }

    // get all status history
    let history = [
      ...person.person_data.publisher_unbaptized.history,
      ...person.person_data.publisher_baptized.history,
    ];

    history = history.filter(
      (record) => !record._deleted && record.start_date?.length > 0
    );

    history.sort((a, b) => a.start_date.localeCompare(b.start_date));

    if (history.length === 0) return;

    const firstDate = new Date(history.at(0).start_date);

    return formatDate(firstDate, 'yyyy/MM');
  }, [person]);

  const isPublisher = useMemo(() => {
    if (!person) return false;

    if (
      !person.person_data.publisher_unbaptized &&
      !person.person_data.publisher_baptized
    ) {
      return false;
    }

    return personIsPublisher(person);
  }, [person, personIsPublisher]);

  const enable_AP_application = useMemo(() => {
    if (!connected) return false;

    if (!person) return false;

    if (!settings.cong_settings.data_sync.value) return false;

    if (!isPublisher) return false;

    const isBaptized = personIsBaptizedPublisher(person);

    if (!isBaptized) return false;

    const isAP = personIsEnrollmentActive(person, 'AP');
    const isFMF = personIsEnrollmentActive(person, 'FMF');
    const isFR = personIsEnrollmentActive(person, 'FR');
    const isFS = personIsEnrollmentActive(person, 'FS');

    const hasEnrollments = isAP || isFMF || isFR || isFS;

    return !hasEnrollments;
  }, [
    isPublisher,
    connected,
    person,
    personIsBaptizedPublisher,
    personIsEnrollmentActive,
    settings,
  ]);

  const userRole = useMemo(() => {
    return settings.user_settings.cong_role;
  }, [settings]);

  const isAdmin = useMemo(() => {
    return userRole.some(
      (role) =>
        role === 'admin' || role === 'coordinator' || role === 'secretary'
    );
  }, [userRole]);

  const isElder = useMemo(() => {
    if (isAdmin) return true;

    if (accountType === 'pocket') return false;

    return userRole.includes('elder');
  }, [accountType, isAdmin, userRole]);

  const isServiceCommittee = useMemo(() => {
    if (isAdmin) return true;

    // only check for service overseer since coordinator and secretary are already admin
    return userRole.includes('service_overseer');
  }, [isAdmin, userRole]);

  const my_group = useMemo(() => {
    const findGroup = fieldGroups.find((record) =>
      record.group_data.members.some((member) => member.person_uid === userUID)
    );

    return findGroup;
  }, [fieldGroups, userUID]);

  const languageGroup = useMemo(() => {
    return languageGroups.find((record) => record.group_id === dataView);
  }, [languageGroups, dataView]);

  const user_in_group = useMemo(() => {
    return languageGroups.some((record) =>
      record.group_data.members.some((member) => member.person_uid === userUID)
    );
  }, [userUID, languageGroups]);

  const isGroup = useMemo(() => {
    return languageGroups.some((record) => record.group_id === dataView);
  }, [languageGroups, dataView]);

  const isLanguageGroupOverseer = useMemo(() => {
    if (accountType === 'pocket') return false;

    if (isAdmin) return true;

    if (!isGroup) return false;

    return userRole.includes('language_group_overseers');
  }, [accountType, isAdmin, userRole, isGroup]);

  const isPersonEditor = useMemo(() => {
    if (isAdmin) return true;

    const hasRole = userRole.some(
      (role) =>
        role === 'midweek_schedule' ||
        role === 'weekend_schedule' ||
        role === 'public_talk_schedule'
    );

    if (!hasRole) return false;

    if (!isGroup) return true;

    if (isGroup && user_in_group) return true;

    return false;
  }, [isAdmin, userRole, user_in_group, isGroup]);

  const isPersonViewer = useMemo(() => {
    if (accountType === 'pocket') return false;

    if (isPersonEditor) return true;

    return userRole.some((role) => role === 'elder');
  }, [accountType, isPersonEditor, userRole]);

  const isAttendanceEditor = useMemo(() => {
    if (isAdmin) return true;

    if (isGroup && user_in_group && isLanguageGroupOverseer) return true;

    const hasRole = userRole.includes('attendance_tracking');

    if (!hasRole) return false;

    if (!isGroup) return true;

    if (isGroup && user_in_group) return true;

    return false;
  }, [isAdmin, userRole, user_in_group, isGroup, isLanguageGroupOverseer]);

  const isAppointed = useMemo(() => {
    if (accountType === 'pocket') return false;

    if (isAdmin) return true;

    return userRole.some((role) => role === 'elder' || role === 'ms');
  }, [accountType, isAdmin, userRole]);

  const isMidweekEditor = useMemo(() => {
    if (isAdmin) return true;

    if (isGroup && user_in_group && isLanguageGroupOverseer) return true;

    const hasRole = userRole.includes('midweek_schedule');

    if (!hasRole) return false;

    if (!isGroup) return true;

    if (isGroup && user_in_group) return true;

    return false;
  }, [isAdmin, userRole, user_in_group, isGroup, isLanguageGroupOverseer]);

  const isWeekendEditor = useMemo(() => {
    if (isAdmin) return true;

    if (isGroup && user_in_group && isLanguageGroupOverseer) return true;

    const hasRole = userRole.includes('weekend_schedule');

    if (!hasRole) return false;

    if (!isGroup) return true;

    if (isGroup && user_in_group) return true;

    return false;
  }, [isAdmin, userRole, user_in_group, isGroup, isLanguageGroupOverseer]);

  const isMeetingEditor = useMemo(() => {
    return isMidweekEditor || isWeekendEditor;
  }, [isMidweekEditor, isWeekendEditor]);

  const isSecretary = useMemo(() => {
    if (isAdmin) return true;

    return userRole.includes('secretary');
  }, [isAdmin, userRole]);

  const isPublicTalkCoordinator = useMemo(() => {
    if (isAdmin) return true;

    if (isGroup && user_in_group && isLanguageGroupOverseer) return true;

    const hasRole = userRole.includes('public_talk_schedule');

    if (!hasRole) return false;

    if (!isGroup) return true;

    if (isGroup && user_in_group) return true;

    return false;
  }, [isAdmin, userRole, user_in_group, isGroup, isLanguageGroupOverseer]);

  const isGroupOverseer = useMemo(() => {
    if (accountType === 'pocket') return false;

    if (isAdmin) return true;

    return userRole.includes('group_overseers');
  }, [accountType, isAdmin, userRole]);

  const isSettingsEditor = useMemo(() => {
    if (!isGroup && isAdmin) return true;

    if (isGroup && (isAdmin || isLanguageGroupOverseer)) return true;

    return false;
  }, [isGroup, isAdmin, isLanguageGroupOverseer]);

  const isDutiesEditor = useMemo(() => {
    if (isAdmin) return true;

    if (isGroup && user_in_group && isLanguageGroupOverseer) return true;

    const hasRole = userRole.includes('duties_schedule');

    if (!hasRole) return false;

    if (!isGroup) return true;

    if (isGroup && user_in_group) return true;

    return false;
  }, [isAdmin, userRole, user_in_group, isGroup, isLanguageGroupOverseer]);

  return {
    person,
    first_report,
    enable_AP_application,
    isAdmin,
    isPublisher,
    isServiceCommittee,
    isElder,
    isPersonEditor,
    isAttendanceEditor,
    isAppointed,
    isMidweekEditor,
    isWeekendEditor,
    accountType,
    isMeetingEditor,
    isSecretary,
    isPersonViewer,
    isPublicTalkCoordinator,
    isGroupOverseer,
    my_group,
    isGroup,
    languageGroup,
    isLanguageGroupOverseer,
    isSettingsEditor,
    isDutiesEditor,
  };
};

export default useCurrentUser;
