import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { personsActiveState } from '@states/persons';
import { GroupDetailsProps, UsersOption } from './index.types';
import { fullnameOptionState } from '@states/settings';
import { buildPersonFullname } from '@utils/common';
import { fieldGroupsState } from '@states/field_service_groups';
import { FieldServiceGroupMemberType } from '@definition/field_service_groups';
import usePerson from '@features/persons/hooks/usePerson';

const useGroupDetails = ({ group, onChange }: GroupDetailsProps) => {
  const { personIsElder, personIsMS } = usePerson();

  const persons = useAtomValue(personsActiveState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const groups = useAtomValue(fieldGroupsState);

  const groups_members = useMemo(() => {
    const assigned = groups.reduce(
      (acc: FieldServiceGroupMemberType[], current) => {
        acc.push(...current.group_data.members);
        return acc;
      },
      []
    );

    return assigned;
  }, [groups]);

  const appointed = useMemo(() => {
    const available = persons.filter(
      (person) =>
        groups_members.some(
          (record) => record.person_uid === person.person_uid
        ) === false
    );

    const result = available.filter((person) => {
      const isElder = personIsElder(person);
      const isMS = personIsMS(person);

      return isElder || isMS;
    });

    return result.sort((a, b) => {
      const isElderA = personIsElder(a) ? 1 : 0;
      const isElderB = personIsElder(b) ? 1 : 0;

      return isElderB - isElderA;
    });
  }, [persons, personIsElder, personIsMS, groups_members]);

  const overseer = useMemo(() => {
    if (!group) return null;

    const groupOverseer = group.group_data.members.find(
      (record) => record.isOverseer
    );
    if (!groupOverseer) return null;

    const person = persons.find(
      (record) => record.person_uid === groupOverseer.person_uid
    );

    return {
      person_uid: person.person_uid,
      person_name: buildPersonFullname(
        person.person_data.person_lastname.value,
        person.person_data.person_firstname.value,
        fullnameOption
      ),
    } as UsersOption;
  }, [group, persons, fullnameOption]);

  const name = useMemo(() => {
    if (!group) return '';

    return group.group_data.name;
  }, [group]);

  const assistant = useMemo(() => {
    if (!group) return null;

    const groupAssistant = group.group_data.members.find(
      (record) => record.isAssistant
    );
    if (!groupAssistant) return null;

    const person = persons.find(
      (record) => record.person_uid === groupAssistant.person_uid
    );

    return {
      person_uid: person.person_uid,
      person_name: buildPersonFullname(
        person.person_data.person_lastname.value,
        person.person_data.person_firstname.value,
        fullnameOption
      ),
    } as UsersOption;
  }, [group, persons, fullnameOption]);

  const overseers: UsersOption[] = useMemo(() => {
    return appointed
      .filter((person) => person.person_uid !== assistant?.person_uid)
      .map((person) => {
        return {
          person_uid: person.person_uid,
          person_name: buildPersonFullname(
            person.person_data.person_lastname.value,
            person.person_data.person_firstname.value,
            fullnameOption
          ),
          elder: personIsElder(person),
        };
      });
  }, [appointed, fullnameOption, assistant, personIsElder]);

  const assistants: UsersOption[] = useMemo(() => {
    return appointed
      .filter((person) => person.person_uid !== overseer?.person_uid)
      .map((person) => {
        return {
          person_uid: person.person_uid,
          person_name: buildPersonFullname(
            person.person_data.person_lastname.value,
            person.person_data.person_firstname.value,
            fullnameOption
          ),
          elder: personIsElder(person),
        };
      });
  }, [appointed, fullnameOption, overseer, personIsElder]);

  const handleNameChange = (value: string) => {
    const newGroup = structuredClone(group);

    newGroup.group_data.updatedAt = new Date().toISOString();
    newGroup.group_data.name = value;

    onChange(newGroup);
  };

  const handleOverseerChange = (value: UsersOption) => {
    const newGroup = structuredClone(group);

    newGroup.group_data.updatedAt = new Date().toISOString();

    newGroup.group_data.members = newGroup.group_data.members.filter(
      (member) => !member.isOverseer
    );

    if (value) {
      newGroup.group_data.members.push({
        isOverseer: true,
        isAssistant: false,
        sort_index: 0,
        person_uid: value.person_uid,
      });
    }

    onChange(newGroup);
  };

  const handleAssistantChange = (value: UsersOption) => {
    const newGroup = structuredClone(group);

    newGroup.group_data.updatedAt = new Date().toISOString();

    newGroup.group_data.members = newGroup.group_data.members.filter(
      (member) => !member.isAssistant
    );

    if (value) {
      newGroup.group_data.members.push({
        isOverseer: false,
        isAssistant: true,
        sort_index: 1,
        person_uid: value.person_uid,
      });
    }

    onChange(newGroup);
  };

  return {
    overseers,
    overseer,
    handleOverseerChange,
    assistants,
    assistant,
    handleAssistantChange,
    name,
    handleNameChange,
  };
};

export default useGroupDetails;
