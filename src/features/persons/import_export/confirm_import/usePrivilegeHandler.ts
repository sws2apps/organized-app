import { PersonType, isPrivilegeType } from '@definition/person';
import { privilegesAddHistory, privilegeChange } from '@utils/privileges';
import useConvertValue from './useConvertValue';

const usePrivilegeHandler = () => {
  const { convertValue } = useConvertValue();

  const makePrivilegeHandler =
    (privilegeName: string) =>
    (csvperson: PersonType, privilegeValue: string) => {
      if (
        Array.isArray(csvperson.person_data.privileges) &&
        csvperson.person_data.privileges.length === 0
      ) {
        if (
          isPrivilegeType(privilegeName) &&
          convertValue(privilegeValue, 'boolean')
        ) {
          privilegesAddHistory(csvperson);
          if (
            Array.isArray(csvperson.person_data.privileges) &&
            csvperson.person_data.privileges.length !== 0
          ) {
            privilegeChange(
              csvperson,
              csvperson.person_data.privileges[0].id,
              privilegeName
            );
          }
        }
      }
    };
  return { makePrivilegeHandler };
};

export default usePrivilegeHandler;
