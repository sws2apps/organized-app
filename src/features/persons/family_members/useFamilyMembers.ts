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

  const familyMembers = useMemo(() => {
    if (currentPerson.person_data.family_members) {
      return currentPerson.person_data.family_members;
    }
    return { head: '', members: [] };
  }, [currentPerson]);

  const currentFamily = useMemo(() => {
    return personsActive.find((person) =>
      person.person_data.family_members?.members.includes(
        currentPerson.person_uid
      )
    );
  }, [currentPerson.person_uid, personsActive]);

  const haveFamily = Boolean(
    familyMembers.head || familyMembers.members.length
  );

  const options = useMemo(
    () => ({
      memberOptions: personsActive
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
      headOptions: personsActive.map((person) => {
        return {
          person_uid: person.person_uid,
          person_name: buildPersonFullname(
            person.person_data.person_lastname.value,
            person.person_data.person_firstname.value,
            fullnameOption
          ),
        };
      }),
    }),
    [currentPerson, fullnameOption, personsActive]
  );

  const handleAddFamily = useCallback(() => {
    setAddFamily(true);
  }, []);

  const onSelectHead = useCallback(
    (personId: string) => {
      const clonedPerson = structuredClone(currentPerson);
      const family = clonedPerson.person_data.family_members ?? {
        head: '',
        members: [],
        updatedAt: '',
      };

      family.head = personId;
      family.updatedAt = new Date().toISOString();
      clonedPerson.person_data.family_members = family;
      setPersonCurrentDetails(clonedPerson);
    },
    [currentPerson]
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
    onSelectHead,
    handleAddFamilyMembers,
    onRemovePerson,
    currentFamily,
    haveFamily,
    addFamily,
    handleAddFamily,
  };
};

export default useFamilyMembers;
