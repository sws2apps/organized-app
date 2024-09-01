import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { personsState } from '@states/persons';
import { userLocalUIDState } from '@states/settings';

const useHookCurrentUser = () => {
  const userUID = useRecoilValue(userLocalUIDState);
  const persons = useRecoilValue(personsState);

  const person = useMemo(() => {
    return persons.find((record) => record.person_uid === userUID);
  }, [persons, userUID]);

  return { person };
};

export default useHookCurrentUser;
