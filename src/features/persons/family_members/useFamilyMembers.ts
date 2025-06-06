import { useCallback, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai/react';
import { personCurrentDetailsState, personsActiveState } from '@states/persons';
import { setPersonCurrentDetails } from '@services/states/persons';
import { buildPersonFullname } from '@utils/common';
import { fullnameOptionState } from '@states/settings';

const useFamilyMembers = () => {
  const personsActive = useAtomValue(personsActiveState);
  const currentPerson = useAtomValue(personCurrentDetailsState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const [addFamily, setAddFamily] = useState(false);

  const isFamilyHead = Boolean(currentPerson.person_data.family_members?.head);

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
        .filter(
          (person) =>
            person.person_uid !== currentPerson.person_data.family_members?.head
        )
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
    [currentPerson, fullnameOption, personsActive]
  );

  const handleAddFamily = useCallback(() => {
    setAddFamily(true);
  }, []);

  const onSelectHead = useCallback(
    (personId: string) => {
      const isNotCurrentPerson = personId !== currentPerson.person_uid;
      const clonedPerson = structuredClone(
        isNotCurrentPerson
          ? personsActive.find((p) => p.person_uid === personId)
          : currentPerson
      );
      const family = clonedPerson.person_data.family_members ?? {
        head: '',
        members: [],
        updatedAt: '',
      };

      family.head = personId;
      family.updatedAt = new Date().toISOString();
      if (
        personId !== currentPerson.person_uid &&
        !family.members.includes(currentPerson.person_uid)
      ) {
        family.members = [...family.members, currentPerson.person_uid];
      }
      clonedPerson.person_data.family_members = family;
      setPersonCurrentDetails(clonedPerson);
    },
    [currentPerson, personsActive]
  );

  const handleAddFamilyMembers = useCallback(
    (members: string[]) => {
      const clonedPerson = structuredClone(currentPerson);
      const family = clonedPerson.person_data.family_members ?? {
        head: '',
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
    onSelectHead,
    handleAddFamilyMembers,
    onRemovePerson,
    currentFamily,
    haveFamily,
    addFamily,
    handleAddFamily,
    isMemberOfFamily,
  };
};

export default useFamilyMembers;
