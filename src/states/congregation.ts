import { atom } from 'jotai';
import { APIUserRequest, CongregationUserType } from '@definition/api';
import { personsState } from './persons';
import { personIsBaptizedPublisher } from '@services/app/persons';

export const isProcessingUserState = atom(false);

export const joinRequestsState = atom<APIUserRequest[]>([]);

export const joinRequestsCountState = atom((get) => {
  const requests = get(joinRequestsState);

  return requests.length;
});

export const congregationUsersState = atom<CongregationUserType[]>([]);

export const congregationsPersonsState = atom((get) => {
  const users = get(congregationUsersState);
  const persons = get(personsState);

  return users.filter((record) => {
    const adminRoles = ['admin', 'coordinator', 'secretary'];

    if (record.profile.cong_role.some((role) => adminRoles.includes(role))) {
      return false;
    }

    const person = persons.find(
      (person) => person.person_uid === record.profile?.user_local_uid
    );

    if (!person) return false;

    const isFemale = person.person_data.female.value;

    if (isFemale) return true;

    const isBaptized = personIsBaptizedPublisher(person);

    return !isBaptized;
  });
});

export const congregationsAppAdminState = atom((get) => {
  const users = get(congregationUsersState);

  return users.filter((record) => {
    const roles = record.profile.cong_role || [];
    const admins = ['admin', 'coordinator', 'secretary'];

    return roles.some((role) => admins.includes(role));
  });
});

export const congregationsBaptizedPersonsState = atom((get) => {
  const users = get(congregationUsersState);
  const persons = get(personsState);

  return users.filter((record) => {
    const roles = record.profile.cong_role || [];
    const admins = ['admin', 'coordinator', 'secretary'];

    const admin = roles.some((role) => admins.includes(role));

    if (admin) return false;

    const person = persons.find(
      (person) => person.person_uid === record.profile?.user_local_uid
    );

    if (!person) return false;

    const isMale = person.person_data.male.value;

    if (!isMale) return false;

    const isBaptized = personIsBaptizedPublisher(person);

    return isBaptized;
  });
});
