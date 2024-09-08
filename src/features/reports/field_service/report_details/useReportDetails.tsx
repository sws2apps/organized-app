import { useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  congFieldServiceReportsState,
  selectedMonthFieldServiceReportState,
  selectedPublisherReportState,
} from '@states/field_service_reports';
import { personsState } from '@states/persons';
import { AssignmentCode } from '@definition/assignment';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import { dbPersonsSave } from '@services/dexie/persons';
import { dbFieldServiceReportsSave } from '@services/dexie/cong_field_service_reports';
import { branchFieldReportsState } from '@states/branch_field_service_reports';
import usePerson from '@features/persons/hooks/usePerson';

const useReportDetails = () => {
  const { t } = useAppTranslation();

  const {
    personIsEnrollmentActive,
    personIsBaptizedPublisher,
    personIsUnbaptizedPublisher,
  } = usePerson();

  const [publisher, setPublisher] = useRecoilState(
    selectedPublisherReportState
  );

  const persons = useRecoilValue(personsState);
  const currentMonth = useRecoilValue(selectedMonthFieldServiceReportState);
  const reports = useRecoilValue(congFieldServiceReportsState);
  const branchReports = useRecoilValue(branchFieldReportsState);

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

  const isAP = useMemo(() => {
    if (!person) return false;

    return personIsEnrollmentActive(person, 'AP', currentMonth);
  }, [person, currentMonth, personIsEnrollmentActive]);

  const isFMF = useMemo(() => {
    if (!person) return false;

    return personIsEnrollmentActive(person, 'FMF', currentMonth);
  }, [person, currentMonth, personIsEnrollmentActive]);

  const isFR = useMemo(() => {
    if (!person) return false;

    return personIsEnrollmentActive(person, 'FR', currentMonth);
  }, [person, currentMonth, personIsEnrollmentActive]);

  const isFS = useMemo(() => {
    if (!person) return false;

    return personIsEnrollmentActive(person, 'FS', currentMonth);
  }, [person, currentMonth, personIsEnrollmentActive]);

  const hoursEnabled = useMemo(() => {
    return isAP || isFMF || isFR || isFS;
  }, [isAP, isFMF, isFR, isFS]);

  const isInactive = useMemo(() => {
    if (!person) return true;

    const isBaptized = personIsBaptizedPublisher(person, currentMonth);
    const isUnbaptized = personIsUnbaptizedPublisher(person, currentMonth);

    const active = isBaptized || isUnbaptized;

    return !active;
  }, [
    person,
    currentMonth,
    personIsBaptizedPublisher,
    personIsUnbaptizedPublisher,
  ]);

  const report_editable = useMemo(() => {
    const report = branchReports.find(
      (record) => record.report_date === currentMonth
    );

    if (!report) return true;

    return !report.report_data.submitted;
  }, [branchReports, currentMonth]);

  const enable_quick_AP = useMemo(() => {
    if (!report_editable) return false;

    if (isFMF || isFR || isFS || isAP) {
      return false;
    }

    if (!person) return false;

    const isBaptized = personIsBaptizedPublisher(person);
    return isBaptized;
  }, [
    isAP,
    isFMF,
    isFR,
    isFS,
    personIsBaptizedPublisher,
    person,
    report_editable,
  ]);

  const unverified = useMemo(() => {
    if (!person) return false;

    if (!report_editable) return false;

    const report = reports.find(
      (record) =>
        record.report_data.person_uid === person.person_uid &&
        record.report_data.report_date === currentMonth
    );

    if (!report) return false;

    const status = report.report_data.status;
    return status === 'received';
  }, [person, currentMonth, reports, report_editable]);

  const handleBack = () => setPublisher(undefined);

  const handleAssignAP = async () => {
    try {
      const newPerson = structuredClone(person);

      const [year, month] = currentMonth.split('/');

      const startDate = new Date(`${currentMonth}/01`).toISOString();
      const endDate = new Date(+year, +month, 0).toISOString();

      newPerson.person_data.enrollments.push({
        id: crypto.randomUUID(),
        updatedAt: new Date().toISOString(),
        _deleted: false,
        enrollment: 'AP',
        start_date: startDate,
        end_date: endDate,
      });

      await dbPersonsSave(newPerson);

      await displaySnackNotification({
        header: t('tr_quickAssignAP'),
        message: t('tr_quickAssignAPDesc'),
        severity: 'success',
      });
    } catch (error) {
      console.error(error);

      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleVerifyReport = async () => {
    try {
      const foundReport = reports.find(
        (record) =>
          record.report_data.person_uid === person.person_uid &&
          record.report_data.report_date === currentMonth
      );

      const report = structuredClone(foundReport);
      report.report_data.status = 'confirmed';

      await dbFieldServiceReportsSave(report);
    } catch (error) {
      console.error(error);

      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleMarkAsActive = async () => {
    try {
      const newPerson = structuredClone(person);

      const isBaptized = newPerson.person_data.publisher_baptized.active.value;
      const isUnbaptized =
        newPerson.person_data.publisher_unbaptized.active.value;

      const startDate = new Date(`${currentMonth}/01`).toISOString();

      if (isBaptized) {
        newPerson.person_data.publisher_baptized.history.push({
          id: crypto.randomUUID(),
          _deleted: false,
          updatedAt: new Date().toISOString(),
          start_date: startDate,
          end_date: null,
        });
      }

      if (isUnbaptized) {
        newPerson.person_data.publisher_unbaptized.history.push({
          id: crypto.randomUUID(),
          _deleted: false,
          updatedAt: new Date().toISOString(),
          start_date: startDate,
          end_date: null,
        });
      }

      await dbPersonsSave(newPerson);
    } catch (error) {
      console.error(error);

      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return {
    person,
    hoursEnabled,
    creditEnabled,
    handleBack,
    enable_quick_AP,
    unverified,
    handleAssignAP,
    handleVerifyReport,
    isInactive,
    handleMarkAsActive,
    currentMonth,
  };
};

export default useReportDetails;
