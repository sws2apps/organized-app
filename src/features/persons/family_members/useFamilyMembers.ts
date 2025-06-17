import { useCallback, useMemo } from 'react';
import { useAtomValue } from 'jotai/react';
import { personCurrentDetailsState, personsActiveState } from '@states/persons';
import { setPersonCurrentDetails } from '@services/states/persons';
import { buildPersonFullname } from '@utils/common';
import { fullnameOptionState } from '@states/settings';

const useFamilyMembers = () => {
  const personsActive = useAtomValue(personsActiveState);
  const currentPerson = useAtomValue(personCurrentDetailsState);
  const fullnameOption = useAtomValue(fullnameOptionState);

  const isFamilyHead = currentPerson.person_data.family_members?.head;

  const isMemberOfFamily = useMemo(() => {
    return personsActive.some((p) => {
      if (p.person_data.family_members) {
        const isMember = p.person_data.family_members.members.includes(
          currentPerson.person_uid
        );
        return isMember;
      }
      return false;
    });
  }, [personsActive, currentPerson.person_uid]);

  const currentFamily = useMemo(() => {
    return personsActive.find((person) =>
      person.person_data.family_members?.members.includes(
        currentPerson.person_uid
      )
    );
  }, [currentPerson.person_uid, personsActive]);

  const familyMembers = useMemo(() => {
    if (isMemberOfFamily) {
      return currentFamily.person_data.family_members;
    } else if (currentPerson.person_data.family_members?.head) {
      return currentPerson.person_data.family_members;
    }
    return { head: '', members: [] };
  }, [currentPerson, isMemberOfFamily, currentFamily]);

  const haveFamily = Boolean(
    familyMembers.head || familyMembers.members.length
  );

  const options = useMemo(
    () =>
      personsActive
        .filter((person) => !person.person_data.family_members?.head)
        .map((person) => {
          return {
            person_uid: person.person_uid,
            person_name: buildPersonFullname(
              person.person_data.person_lastname.value,
              person.person_data.person_firstname.value,
              fullnameOption
            ),
          };
        }),
    [fullnameOption, personsActive]
  );

  const onSetHead = useCallback(() => {
    const clonedPerson = structuredClone(currentPerson);
    const family = clonedPerson.person_data.family_members ?? {
      head: false,
      members: [],
      updatedAt: '',
    };

    family.head = !family.head;
    if (!family.head) {
      family.members = [];
    }
    family.updatedAt = new Date().toISOString();
    clonedPerson.person_data.family_members = family;
    setPersonCurrentDetails(clonedPerson);
  }, [currentPerson]);

  const handleAddFamilyMembers = useCallback(
    (members: string[]) => {
      const clonedPerson = structuredClone(currentPerson);
      const family = clonedPerson.person_data.family_members ?? {
        head: false,
        members: [],
        updatedAt: '',
      };

      family.members = members;
      family.updatedAt = new Date().toISOString();
      clonedPerson.person_data.family_members = family;
      setPersonCurrentDetails(clonedPerson);
    },
    [currentPerson]
  );

  const onRemovePerson = useCallback(
    (personId: string) => {
      if (!personId) {
        return;
      }
      const person = structuredClone(
        isFamilyHead ? currentPerson : currentFamily
      );
      person.person_data.family_members.members =
        person.person_data.family_members.members.filter((p) => p !== personId);
      person.person_data.family_members.updatedAt = new Date().toISOString();
      setPersonCurrentDetails(person);
    },
    [currentFamily, currentPerson, isFamilyHead]
  );

  return {
    options,
    personsActive,
    familyMembers,
    onSetHead,
    handleAddFamilyMembers,
    onRemovePerson,
    currentFamily,
    haveFamily,
    isMemberOfFamily,
    isFamilyHead,
  };
};

export default useFamilyMembers;
