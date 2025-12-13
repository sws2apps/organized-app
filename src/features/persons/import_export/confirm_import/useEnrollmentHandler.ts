import { PersonType, isEnrollmentType } from '@definition/person';
import { enrollmentChange, enrollmentsAddHistory } from '@utils/enrollments';
import useConvertValue from './useConvertValue';

const useEnrollmentHandler = () => {
  const { convertValue } = useConvertValue();

  const makeEnrollmentHandler =
    (enrollmentRaw: string) =>
    (csvperson: PersonType, enrollmentValue: string) => {
      const enrollmentType = enrollmentRaw;

      if (!Array.isArray(csvperson.person_data.enrollments)) {
        return;
      }

      const enabled = !!convertValue(enrollmentValue, 'boolean');
      if (!isEnrollmentType(enrollmentType) || !enabled) return;
      if (csvperson.person_data.enrollments.length === 0) {
        enrollmentsAddHistory(csvperson);
      }
      if (csvperson.person_data.enrollments.length !== 0) {
        const histories = csvperson.person_data.enrollments;
        const target =
          [...histories].reverse().find((h) => !h._deleted && !h.end_date) ??
          histories[histories.length - 1];
        if (!target) return;
        enrollmentChange(csvperson, target.id, enrollmentType);
      }
    };

  return { makeEnrollmentHandler };
};

export default useEnrollmentHandler;
