import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { LanguageGroupType } from '@definition/settings';
import { circuitNumberState, settingsState } from '@states/settings';
import { congAccountConnectedState, congregationUsersState } from '@states/app';
import { apiCongregationUsersGet } from '@services/api/congregation';
import { displaySnackNotification } from '@services/recoil/app';
import { personsState } from '@states/persons';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { dbPersonsBulkSave } from '@services/dexie/persons';
import { CreateState, GroupAddProps } from './index.types';

const useGroupAdd = ({ onClose }: GroupAddProps) => {
  const { t } = useAppTranslation();

  const { isAdmin } = useCurrentUser();

  const isConnected = useRecoilValue(congAccountConnectedState);

  const { data: users } = useQuery({
    queryKey: ['congregation_users'],
    queryFn: apiCongregationUsersGet,
    refetchOnMount: 'always',
    enabled: isConnected && isAdmin,
  });

  const setUsers = useSetRecoilState(congregationUsersState);

  const congCircuit = useRecoilValue(circuitNumberState);
  const persons = useRecoilValue(personsState);
  const settings = useRecoilValue(settingsState);

  const [step, setStep] = useState<CreateState>('start');
  const [members, setMembers] = useState<string[]>([]);
  const [group, setGroup] = useState<LanguageGroupType>({
    id: '',
    _deleted: false,
    language: '',
    name: '',
    circuit: congCircuit,
    admins: [],
    updatedAt: '',
    midweek_meeting: false,
    weekend_meeting: false,
  });

  const handleNext = () => {
    if (
      group.name.length === 0 ||
      group.circuit.length === 0 ||
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

  const handleCreateGroup = async () => {
    try {
      let groupId: string;

      const languageGroups = structuredClone(
        settings.cong_settings.language_groups.groups
      );

      const findGroup = languageGroups.find(
        (record) => record.name === group.name
      );

      if (findGroup?._deleted === false) {
        throw new Error(t('tr_languageGroupExists'));
      }

      if (findGroup?._deleted) {
        groupId = findGroup.id;

        findGroup._deleted = false;
        findGroup.updatedAt = new Date().toISOString();
        findGroup.admins = group.admins;
      }

      if (!findGroup) {
        groupId = crypto.randomUUID();

        group.id = groupId;
        group.updatedAt = new Date().toISOString();

        languageGroups.push(group);
      }

      const groupMembers = members.concat(group.admins);

      const personsToUpdate = groupMembers.map((member) => {
        const find = persons.find((record) => record.person_uid === member);
        const person = structuredClone(find);

        if (Array.isArray(person.person_data.categories)) {
          person.person_data.categories = {
            value: ['main', groupId],
            updatedAt: new Date().toISOString(),
          };
        } else {
          person.person_data.categories.value.push(groupId);
          person.person_data.categories.updatedAt = new Date().toISOString();
        }

        return person;
      });

      await dbAppSettingsUpdate({
        'cong_settings.language_groups.groups': languageGroups,
      });

      await dbPersonsBulkSave(personsToUpdate);

      await displaySnackNotification({
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

  useEffect(() => {
    if (users && Array.isArray(users)) {
      setUsers(users);
    }
  }, [setUsers, users]);

  return {
    step,
    handleNext,
    group,
    handleGroupChange,
    members,
    handleChangeMembers,
    handleCreateGroup,
  };
};

export default useGroupAdd;
