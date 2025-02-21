import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { LanguageGroupType } from '@definition/settings';
import { circuitNumberState } from '@states/settings';
import { congAccountConnectedState, congregationUsersState } from '@states/app';
import { apiCongregationUsersGet } from '@services/api/congregation';
import { displaySnackNotification } from '@services/recoil/app';
import { personsState } from '@states/persons';
import { CreateState } from './index.types';

const useGroupAdd = () => {
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
      group.id = crypto.randomUUID();

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

      console.log(group, personsToUpdate);
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
