import { useCallback, useMemo } from 'react';
import { useAtomValue } from 'jotai/react';
import { personCurrentDetailsState, personsActiveState } from '@states/persons';
import { setPersonCurrentDetails } from '@services/states/persons';
import { buildPersonFullname } from '@utils/common';
import { fullnameOptionState } from '@states/settings';

const DEFAULT_FAMILY_DATA = {
  head: false,
  members: [],
  updatedAt: '',
};

const useFamilyMembers = () => {
  const personsActive = useAtomValue(personsActiveState);
  const currentPerson = useAtomValue(personCurrentDetailsState);
  const fullnameOption = useAtomValue(fullnameOptionState);

  const isFamilyHead = currentPerson.person_data.family_members?.head;

  const isMemberOfFamily = useCallback(
    (person_uid: string) => {
      return personsActive.some((p) => {
        if (p.person_data.family_members) {
          const isMember =
            p.person_data.family_members.members.includes(person_uid);
          return isMember;
        }
        return false;
      });
    },
    [personsActive]
  );

  const isCurrentPersonMemberOfAFamily = isMemberOfFamily(
    currentPerson.person_uid
  );

  const currentFamily = useMemo(() => {
    return personsActive.find((person) =>
      person.person_data.family_members?.members.includes(
        currentPerson.person_uid
      )
    );
  }, [currentPerson.person_uid, personsActive]);

  const familyHeadName = useMemo(() => {
    if (isFamilyHead) {
      return buildPersonFullname(
        currentPerson.person_data?.person_lastname.value,
        currentPerson.person_data?.person_firstname.value,
        fullnameOption
      );
    } else {
      if (!currentFamily) {
        return '';
      }

      return buildPersonFullname(
        currentFamily.person_data?.person_lastname.value,
        currentFamily.person_data?.person_firstname.value,
        fullnameOption
      );
    }
  }, [
    currentFamily,
    currentPerson.person_data?.person_firstname.value,
    currentPerson.person_data?.person_lastname.value,
    fullnameOption,
    isFamilyHead,
  ]);

  const familyMembers = useMemo(() => {
    if (isCurrentPersonMemberOfAFamily) {
      return currentFamily.person_data.family_members;
    } else if (currentPerson.person_data.family_members?.head) {
      return currentPerson.person_data.family_members;
    }
    return DEFAULT_FAMILY_DATA;
  }, [isCurrentPersonMemberOfAFamily, currentPerson, currentFamily]);

  const haveFamily = Boolean(
    familyMembers.head || familyMembers.members.length
  );

  const options = useMemo(
    () =>
      personsActive
        .filter((person) => {
          const isMe = person.person_uid !== currentPerson.person_uid;
          const isHead = person.person_data.family_members?.head;
          const isInMyFamily =
            currentPerson.person_data.family_members?.members?.includes(
              person.person_uid
            );
          const isInAFamily =
            !isInMyFamily && isMemberOfFamily(person.person_uid);
          return isMe && !isHead && !isInAFamily;
        })
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
    [currentPerson, fullnameOption, personsActive, isMemberOfFamily]
  );

  const onSetHead = useCallback(() => {
    const clonedPerson = structuredClone(currentPerson);
    const family =
      clonedPerson.person_data.family_members ?? DEFAULT_FAMILY_DATA;

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
      const family =
        clonedPerson.person_data.family_members ?? DEFAULT_FAMILY_DATA;

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

      const person = structuredClone(currentPerson);
      person.person_data.family_members.members =
        person.person_data.family_members.members.filter((p) => p !== personId);
      person.person_data.family_members.updatedAt = new Date().toISOString();
      setPersonCurrentDetails(person);
    },
    [currentPerson]
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
    familyHeadName,
    isCurrentPersonMemberOfAFamily,
  };
};

export default useFamilyMembers;
