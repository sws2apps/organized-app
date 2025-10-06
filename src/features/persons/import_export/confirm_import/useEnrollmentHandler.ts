import { PersonType, isEnrollmentType } from '@definition/person';
import { enrollmentChange, enrollmentsAddHistory } from '@utils/enrollments';
import useConvertValue from './useConvertValue';

const useEnrollmentHandler = () => {
  const { convertValue } = useConvertValue();

  const makeEnrollmentHandler =
    (enrollmentRaw: string) =>
    (csvperson: PersonType, enrollmentValue: string) => {
      const enrollmentType = enrollmentRaw;

      if (
        Array.isArray(csvperson.person_data.enrollments) &&
        csvperson.person_data.enrollments.length === 0
      ) {
        if (
          isEnrollmentType(enrollmentType) &&
          convertValue(enrollmentValue, 'boolean')
        ) {
          enrollmentsAddHistory(csvperson);
          enrollmentChange(
            csvperson,
            csvperson.person_data.enrollments[0].id,
            enrollmentType
          );
        }
      }
    };

  return { makeEnrollmentHandler };
};

export default useEnrollmentHandler;
