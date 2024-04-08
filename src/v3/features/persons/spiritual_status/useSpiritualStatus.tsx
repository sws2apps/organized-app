import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { personCurrentDetailsState } from '@states/persons';
import { PersontType } from '@definition/person';
import { setPersonCurrentDetails } from '@services/recoil/persons';

const useSpiritualStatus = () => {
  const person = useRecoilValue(personCurrentDetailsState);

  const [expandedStatus, setExpandedStatus] = useState({
    baptized: false,
    unbaptized: false,
    midweek: false,
  });

  const handleToggleExpand = (status: 'baptized' | 'unbaptized' | 'midweek') => {
    setExpandedStatus((prev) => {
      const newStatuses = structuredClone(prev);

      for (const key of Object.keys(newStatuses)) {
        if (key !== status) {
          newStatuses[key] = false;
        }
      }

      newStatuses[status] = !newStatuses[status];

      return newStatuses;
    });
  };

  const handleToggleMidweekMeetingStudent = async (checked: boolean) => {
    const newPerson: PersontType = structuredClone(person);

    newPerson.midweekMeetingStudent.active.value = checked;
    newPerson.midweekMeetingStudent.active.updatedAt = new Date().toISOString();

    await setPersonCurrentDetails(newPerson);
  };

  const handleToggleUnbaptizedPublisher = async (checked: boolean) => {
    const newPerson: PersontType = structuredClone(person);

    newPerson.unbaptizedPublisher.active.value = checked;
    newPerson.unbaptizedPublisher.active.updatedAt = new Date().toISOString();

    await setPersonCurrentDetails(newPerson);
  };

  const handleToggleBaptizedPublisher = async (checked: boolean) => {
    const newPerson: PersontType = structuredClone(person);

    newPerson.baptizedPublisher.active.value = checked;
    newPerson.baptizedPublisher.active.updatedAt = new Date().toISOString();

    await setPersonCurrentDetails(newPerson);
  };

  return {
    person,
    handleToggleMidweekMeetingStudent,
    handleToggleUnbaptizedPublisher,
    handleToggleBaptizedPublisher,
    expandedStatus,
    handleToggleExpand,
  };
};

export default useSpiritualStatus;
