import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { FullnameOption, LanguageGroupType } from '@definition/settings';
import { circuitNumberState, settingsState } from '@states/settings';
import { displaySnackNotification } from '@services/states/app';
import { personsState } from '@states/persons';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { dbPersonsBulkSave } from '@services/dexie/persons';
import { CreateState, GroupAddProps } from './index.types';
import { convertSettingsObjectToArray } from '@services/app/settings';

const useGroupAdd = ({ onClose }: GroupAddProps) => {
  const { t } = useAppTranslation();

  const congCircuit = useAtomValue(circuitNumberState);
  const persons = useAtomValue(personsState);
  const settings = useAtomValue(settingsState);

  const [step, setStep] = useState<CreateState>('start');
  const [members, setMembers] = useState<string[]>([]);
  const [group, setGroup] = useState<LanguageGroupType>({
    id: '',
    _deleted: false,
    language: '',
    name: '',
    admins: [],
    updatedAt: '',
    midweek_meeting: false,
    weekend_meeting: false,
  });
  const [circuit, setCircuit] = useState(congCircuit);

  const handleNext = () => {
    if (
      group.name.length === 0 ||
      circuit.length === 0 ||
      group.language.length === 0
    ) {
      return;
    }

    setStep('final');
  };

  const handleGroupChange = (value: LanguageGroupType) => {
    setGroup(value);
  };

  const handleChangeMembers = (values: string[]) => {
    setMembers(values);
  };

  const handleChangeCircuit = (value: string) => setCircuit(value);

  const handleCreateGroup = async () => {
    try {
      const appSettings = convertSettingsObjectToArray(
        structuredClone(settings)
      );

      const languageGroups = appSettings.cong_settings.language_groups.groups;

      const findGroup = languageGroups.find(
        (record) => record.name === group.name
      );

      if (findGroup?._deleted === false) {
        throw new Error(t('tr_languageGroupExists'));
      }

      group.id = crypto.randomUUID();
      group.updatedAt = new Date().toISOString();

      languageGroups.push(group);

      const sourceLanguages =
        appSettings.cong_settings.source_material.language;

      sourceLanguages.push({
        _deleted: false,
        type: group.id,
        updatedAt: new Date().toISOString(),
        value: group.language,
      });

      const congCircuit = appSettings.cong_settings.cong_circuit;

      congCircuit.push({
        _deleted: false,
        type: group.id,
        updatedAt: new Date().toISOString(),
        value: circuit,
      });

      const displayName = appSettings.cong_settings.display_name_enabled;

      displayName.push({
        _deleted: false,
        type: group.id,
        updatedAt: new Date().toISOString(),
        meetings: false,
        others: false,
      });

      const fullnameOption = appSettings.cong_settings.fullname_option;

      fullnameOption.push({
        _deleted: false,
        type: group.id,
        updatedAt: new Date().toISOString(),
        value: FullnameOption.FIRST_BEFORE_LAST,
      });

      const shortDateFormat = appSettings.cong_settings.short_date_format;

      shortDateFormat.push({
        _deleted: false,
        type: group.id,
        updatedAt: new Date().toISOString(),
        value: 'MM/dd/yyyy',
      });

      const format24h = appSettings.cong_settings.format_24h_enabled;

      format24h.push({
        _deleted: false,
        type: group.id,
        updatedAt: new Date().toISOString(),
        value: true,
      });

      const onlineRecord = appSettings.cong_settings.attendance_online_record;

      onlineRecord.push({
        _deleted: false,
        type: group.id,
        updatedAt: new Date().toISOString(),
        value: false,
      });

      const weekStart = appSettings.cong_settings.week_start_sunday;

      weekStart.push({
        _deleted: false,
        type: group.id,
        updatedAt: new Date().toISOString(),
        value: false,
      });

      const midweekMeeting = appSettings.cong_settings.midweek_meeting;

      midweekMeeting.push({
        type: group.id,
        _deleted: { value: false, updatedAt: new Date().toISOString() },
        aux_class_counselor_default: {
          enabled: { value: false, updatedAt: new Date().toISOString() },
          person: { value: '', updatedAt: new Date().toISOString() },
        },
        class_count: { value: 1, updatedAt: new Date().toISOString() },
        opening_prayer_linked_assignment: {
          value: '',
          updatedAt: new Date().toISOString(),
        },
        closing_prayer_linked_assignment: {
          value: '',
          updatedAt: new Date().toISOString(),
        },
        time: { value: '17:30', updatedAt: new Date().toISOString() },
        weekday: { value: 2, updatedAt: new Date().toISOString() },
      });

      const weekendMeeting = appSettings.cong_settings.weekend_meeting;

      weekendMeeting.push({
        type: group.id,
        _deleted: { value: false, updatedAt: new Date().toISOString() },
        consecutive_monthly_parts_notice_shown: {
          value: true,
          updatedAt: new Date().toISOString(),
        },
        opening_prayer_auto_assigned: {
          value: true,
          updatedAt: new Date().toISOString(),
        },
        outgoing_talks_schedule_public: {
          value: false,
          updatedAt: new Date().toISOString(),
        },
        substitute_speaker_enabled: {
          value: false,
          updatedAt: new Date().toISOString(),
        },
        substitute_w_study_conductor_displayed: {
          value: false,
          updatedAt: new Date().toISOString(),
        },
        time: { value: '14:00', updatedAt: new Date().toISOString() },
        w_study_conductor_default: {
          value: '',
          updatedAt: new Date().toISOString(),
        },
        weekday: { value: 7, updatedAt: new Date().toISOString() },
      });

      await dbAppSettingsUpdate({
        'cong_settings.language_groups.groups': languageGroups,
        'cong_settings.source_material.language': sourceLanguages,
        'cong_settings.cong_circuit': congCircuit,
        'cong_settings.display_name_enabled': displayName,
        'cong_settings.fullname_option': fullnameOption,
        'cong_settings.short_date_format': shortDateFormat,
        'cong_settings.format_24h_enabled': format24h,
        'cong_settings.attendance_online_record': onlineRecord,
        'cong_settings.week_start_sunday': weekStart,
        'cong_settings.midweek_meeting': midweekMeeting,
        'cong_settings.weekend_meeting': weekendMeeting,
      });

      const groupMembers = members.concat(group.admins);
      const personsToUpdate = groupMembers.map((member) => {
        const find = persons.find((record) => record.person_uid === member);
        const person = structuredClone(find);

        if (Array.isArray(person.person_data.categories)) {
          person.person_data.categories = {
            value: ['main', group.id],
            updatedAt: new Date().toISOString(),
          };
        } else {
          person.person_data.categories.value.push(group.id);
          person.person_data.categories.updatedAt = new Date().toISOString();
        }

        return person;
      });

      await dbPersonsBulkSave(personsToUpdate);

      displaySnackNotification({
        severity: 'success',
        header: t('tr_newLangGroupCreatedSuccess'),
        message: t('tr_newLangGroupCreatedSuccessDesc', {
          LanguageGroupName: group.name,
        }),
      });

      onClose();
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        severity: 'error',
        header: t('error_app_generic-title'),
        message: (error as Error).message,
      });
    }
  };

  return {
    step,
    handleNext,
    group,
    handleGroupChange,
    members,
    handleChangeMembers,
    handleCreateGroup,
    circuit,
    handleChangeCircuit,
  };
};

export default useGroupAdd;
