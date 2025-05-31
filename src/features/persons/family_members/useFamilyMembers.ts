import { useCallback, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai/react';
import { personCurrentDetailsState, personsActiveState } from '@states/persons';
import { setPersonCurrentDetails } from '@services/states/persons';

const useFamilyMembers = () => {
  const personsActive = useAtomValue(personsActiveState);
  const currentPerson = useAtomValue(personCurrentDetailsState);
  const [newlyAddedMemberCount, setNewlyAddedMemberCount] = useState(1);
  const familyMembers = useMemo(() => {
    if (currentPerson.person_data.family_members) {
      return currentPerson.person_data.family_members.members;
    }
    return [];
  }, [currentPerson]);

  const options = useMemo(
    () =>
      personsActive.filter(
        (person) =>
          !familyMembers.includes(person.person_uid) &&
          person.person_uid !== currentPerson.person_uid
      ),
    [currentPerson.person_uid, familyMembers, personsActive]
  );

  const handleAddNewMember = useCallback(() => {
    setNewlyAddedMemberCount((prev) => prev + 1);
  }, []);

  const onSelectPerson = useCallback(
    (personId: string) => {
      const person = structuredClone(currentPerson);
      if (person.person_data.family_members.members.includes(personId)) {
        return;
      }
      person.person_data.family_members.members.push(personId);
      person.person_data.family_members.updatedAt = new Date().toISOString();
      setPersonCurrentDetails(person);
      setNewlyAddedMemberCount((prev) => Math.max(prev - 1, 0));
    },
    [currentPerson]
  );

  const onRemovePerson = useCallback(
    (personId?: string) => {
      if (!personId) {
        return;
      }
      const person = structuredClone(currentPerson);
      person.person_data.family_members.members =
        person.person_data.family_members.members.filter((p) => p !== personId);
      person.person_data.family_members.updatedAt = new Date().toISOString();
      setPersonCurrentDetails(person);
    },
    [currentPerson]
  );

  return {
    newlyAddedMemberCount,
    options,
    personsActive,
    familyMembers,
    onSelectPerson,
    handleAddNewMember,
    onRemovePerson,
  };
};

export default useFamilyMembers;
