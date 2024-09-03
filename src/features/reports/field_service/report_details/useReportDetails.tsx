import { useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  selectedMonthFieldServiceReportState,
  selectedPublisherReportState,
} from '@states/field_service_reports';
import { personsState } from '@states/persons';
import usePerson from '@features/persons/hooks/usePerson';
import { AssignmentCode } from '@definition/assignment';

const useReportDetails = () => {
  const { personIsEnrollmentActive } = usePerson();

  const [publisher, setPublisher] = useRecoilState(
    selectedPublisherReportState
  );

  const persons = useRecoilValue(personsState);
  const currentMonth = useRecoilValue(selectedMonthFieldServiceReportState);

  const person = useMemo(() => {
    return persons.find((record) => record.person_uid === publisher);
  }, [persons, publisher]);

  const creditEnabled = useMemo(() => {
    if (!person) return false;

    const isValid = person.person_data.assignments.some(
      (record) =>
        record._deleted === false &&
        record.code === AssignmentCode.MINISTRY_HOURS_CREDIT
    );
    return isValid;
  }, [person]);

  const hoursEnabled = useMemo(() => {
    if (!person) return false;

    const isAP = personIsEnrollmentActive(person, 'AP', currentMonth);
    const isFMF = personIsEnrollmentActive(person, 'FMF', currentMonth);
    const isFR = personIsEnrollmentActive(person, 'FR', currentMonth);
    const isFS = personIsEnrollmentActive(person, 'FS', currentMonth);

    return isAP || isFMF || isFR || isFS;
  }, [person, currentMonth, personIsEnrollmentActive]);

  const handleBack = () => setPublisher(undefined);

  return { person, hoursEnabled, creditEnabled, handleBack };
};

export default useReportDetails;
