import { personsActiveState } from '@states/persons';
import { useRecoilValue } from 'recoil';
import { MiniPerson } from './mini_person';

const useManageAccessAll = () => {
  const personsAll = useRecoilValue(personsActiveState);

  const congregationPersons: MiniPerson[] = personsAll.map((value) => {
    if (
      (value.person_data.male && value.person_data.publisher_unbaptized) ||
      value.person_data.female
    ) {
      return {
        username: `${value.person_data.person_firstname.value} ${value.person_data.person_lastname.value}`,
        uid: value.person_uid,
      };
    }
  });

  const baptizedBrothers: MiniPerson[] = personsAll.map((value) => {
    if (value.person_data.male && value.person_data.publisher_baptized) {
      return {
        username: `${value.person_data.person_firstname.value} ${value.person_data.person_lastname.value}`,
        uid: value.person_uid,
      };
    }
  });

  return { congregationPersons, baptizedBrothers };
};

export default useManageAccessAll;
