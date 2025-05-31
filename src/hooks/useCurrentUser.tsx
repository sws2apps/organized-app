import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { formatDate } from '@services/dateformat';
import { personsState } from '@states/persons';
import {
  accountTypeState,
  settingsState,
  userDataViewState,
  userLocalUIDState,
} from '@states/settings';
import { congAccountConnectedState, featureFlagsState } from '@states/app';
import {
  fieldGroupsState,
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
  const fieldGroups = useAtomValue(fieldGroupsState);
  const FEATURE_FLAGS = useAtomValue(featureFlagsState);
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
    if (!FEATURE_FLAGS['LANGUAGE_GROUPS']) return;

    return languageGroups.find((record) => record.group_id === dataView);
  }, [FEATURE_FLAGS, languageGroups, dataView]);

  const user_in_group = useMemo(() => {
    return my_group?.group_id === languageGroup?.group_id;
  }, [my_group, languageGroup]);

  const isPersonEditor = useMemo(() => {
    if (isAdmin) return true;

    const hasRole = userRole.some(
      (role) =>
        role === 'midweek_schedule' ||
        role === 'weekend_schedule' ||
        role === 'public_talk_schedule'
    );

    if (!hasRole) return false;

    if (user_in_group && dataView === 'main') return false;

    return true;
  }, [isAdmin, userRole, dataView, user_in_group]);

  const isPersonViewer = useMemo(() => {
    if (accountType === 'pocket') return false;

    if (isPersonEditor) return true;

    return userRole.some((role) => role === 'elder');
  }, [accountType, isPersonEditor, userRole]);

  const isAttendanceEditor = useMemo(() => {
    if (isAdmin) return true;

    const hasRole = userRole.includes('attendance_tracking');

    if (!hasRole) return false;

    if (user_in_group && dataView === 'main') return false;

    return true;
  }, [isAdmin, userRole, dataView, user_in_group]);

  const isAppointed = useMemo(() => {
    if (accountType === 'pocket') return false;

    if (isAdmin) return true;

    return userRole.some((role) => role === 'elder' || role === 'ms');
  }, [accountType, isAdmin, userRole]);

  const isMidweekEditor = useMemo(() => {
    if (isAdmin) return true;

    const hasRole = userRole.includes('midweek_schedule');

    if (!hasRole) return false;

    if (user_in_group && dataView === 'main') return false;

    return true;
  }, [isAdmin, userRole, dataView, user_in_group]);

  const isWeekendEditor = useMemo(() => {
    if (isAdmin) return true;

    const hasRole = userRole.includes('weekend_schedule');

    if (!hasRole) return false;

    if (user_in_group && dataView === 'main') return false;

    return true;
  }, [isAdmin, userRole, dataView, user_in_group]);

  const isMeetingEditor = useMemo(() => {
    return isMidweekEditor || isWeekendEditor;
  }, [isMidweekEditor, isWeekendEditor]);

  const isSecretary = useMemo(() => {
    if (isAdmin) return true;

    return userRole.includes('secretary');
  }, [isAdmin, userRole]);

  const isPublicTalkCoordinator = useMemo(() => {
    if (isAdmin) return true;

    const hasRole = userRole.includes('public_talk_schedule');

    if (!hasRole) return false;

    if (user_in_group && dataView === 'main') return false;

    return true;
  }, [isAdmin, userRole, dataView, user_in_group]);

  const isGroupOverseer = useMemo(() => {
    if (accountType === 'pocket') return false;

    if (isAdmin) return true;

    if (!my_group) return false;

    const overseer = my_group.group_data.members.find(
      (record) => record.person_uid === userUID
    );

    return overseer.isOverseer;
  }, [accountType, isAdmin, userUID, my_group]);

  const isGroup = useMemo(() => {
    if (!FEATURE_FLAGS['LANGUAGE_GROUPS']) return false;

    return languageGroups.some((record) => record.group_id === dataView);
  }, [FEATURE_FLAGS, languageGroups, dataView]);

  const isGroupAdmin = useMemo(() => {
    if (!FEATURE_FLAGS['LANGUAGE_GROUPS']) return false;

    if (!isGroup) return false;

    return isAdmin;
  }, [FEATURE_FLAGS, isGroup, isAdmin]);

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
    isGroupAdmin,
    languageGroup,
  };
};

export default useCurrentUser;
