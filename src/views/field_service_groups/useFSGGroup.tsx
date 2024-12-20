import { FieldServiceGroupMemberType } from '@definition/field_service_groups';
import { FSGGroupType } from './index.types';
import { buildPersonFullname } from '@utils/common';

const useFSGGroup = ({ data, persons, fullnameOption }: FSGGroupType) => {
  const group_overseer = data.group_data.members.find(
    (member) => member.isOverseer && !member.isAssistant
  );

  const group_overseer_assistent = data.group_data.members.find(
    (member) => member.isAssistant && !member.isOverseer
  );

  const getMemberName = (person: FieldServiceGroupMemberType) => {
    if (person) {
      const personData = persons.find(
        (record) => record.person_uid === person.person_uid
      );
      return buildPersonFullname(
        personData.person_data.person_lastname.value,
        personData.person_data.person_firstname.value,
        fullnameOption
      );
    }

    return '';
  };

  return {
    group_overseer,
    group_overseer_assistent,
    getMemberName,
  };
};

export default useFSGGroup;
