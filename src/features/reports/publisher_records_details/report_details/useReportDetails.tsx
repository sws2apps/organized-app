import { useEffect, useMemo } from 'react';
import { useAtomValue, useAtom } from 'jotai';
import { AssignmentCode } from '@definition/assignment';
import { monthNamesState } from '@states/app';
import {
  congFieldServiceReportsState,
  publisherCurrentReportState,
} from '@states/field_service_reports';
import { ReportDetailsProps } from './index.types';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import { congFieldServiceReportSchema } from '@services/dexie/schema';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { handleSaveFieldServiceReports } from '@services/app/cong_field_service_reports';
import { dbPersonsSave } from '@services/dexie/persons';
import { useAppTranslation } from '@hooks/index';
import { userDataViewState } from '@states/settings';
import { formatDate } from '@utils/date';
import usePerson from '@features/persons/hooks/usePerson';

const useReportDetails = ({ month, person, onClose }: ReportDetailsProps) => {
  const { t } = useAppTranslation();

  const { personIsEnrollmentActive, personIsBaptizedPublisher } = usePerson();

  const [currentReport, setCurrentReport] = useAtom(
    publisherCurrentReportState
  );

  const monthNames = useAtomValue(monthNamesState);
  const congReports = useAtomValue(congFieldServiceReportsState);
  const dataView = useAtomValue(userDataViewState);

  const reportMonth = useMemo(() => {
    const [year, monthIndex] = month.split('/').map(Number);

    return `${monthNames[monthIndex - 1]} ${year}`;
  }, [month, monthNames]);

  const report = useMemo(() => {
    return congReports.find(
      (record) =>
        record.report_data.person_uid === person.person_uid &&
        record.report_data.report_date === month
    );
  }, [congReports, person, month]);

  const creditEnabled = useMemo(() => {
    if (!person) return false;

    return (
      person.person_data.assignments
        .find((a) => a.type === dataView)
        ?.values.includes(AssignmentCode.MINISTRY_HOURS_CREDIT) ?? false
    );
  }, [person, dataView]);

  const isAP = useMemo(() => {
    if (!person) return false;

    return personIsEnrollmentActive(person, 'AP', month);
  }, [person, month, personIsEnrollmentActive]);

  const isFMF = useMemo(() => {
    if (!person) return false;

    return personIsEnrollmentActive(person, 'FMF', month);
  }, [person, month, personIsEnrollmentActive]);

  const isFR = useMemo(() => {
    if (!person) return false;

    return personIsEnrollmentActive(person, 'FR', month);
  }, [person, month, personIsEnrollmentActive]);

  const isFS = useMemo(() => {
    if (!person) return false;

    return personIsEnrollmentActive(person, 'FS', month);
  }, [person, month, personIsEnrollmentActive]);

  const hoursEnabled = useMemo(() => {
    return isAP || isFMF || isFR || isFS;
  }, [isAP, isFMF, isFR, isFS]);

  const enable_quick_AP = useMemo(() => {
    if (isFMF || isFR || isFS || isAP) {
      return false;
    }

    if (!person) return false;

    const isBaptized = personIsBaptizedPublisher(person);
    return isBaptized;
  }, [isAP, isFMF, isFR, isFS, personIsBaptizedPublisher, person]);

  const handleSaveReport = async () => {
    try {
      await handleSaveFieldServiceReports(currentReport);

      onClose?.();
    } catch (error) {
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleAssignAP = async () => {
    try {
      const newPerson = structuredClone(person);

      const [varYear, varMonth] = month.split('/');

      const startDate = `${month}/01`;
      const endDate = formatDate(
        new Date(+varYear, +varMonth, 0),
        'yyyy/MM/dd'
      );

      newPerson.person_data.enrollments.push({
        id: crypto.randomUUID(),
        updatedAt: new Date().toISOString(),
        _deleted: false,
        enrollment: 'AP',
        start_date: startDate,
        end_date: endDate,
      });

      await dbPersonsSave(newPerson);

      displaySnackNotification({
        header: t('tr_quickAssignAP'),
        message: t('tr_quickAssignAPDesc'),
        severity: 'success',
      });
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    let userReport: CongFieldServiceReportType;

    if (!report) {
      userReport = structuredClone(congFieldServiceReportSchema);
      userReport.report_id = crypto.randomUUID();
      userReport.report_data.report_date = month;
      userReport.report_data.person_uid = person.person_uid;
    }

    if (report) {
      userReport = structuredClone(report);
    }

    setCurrentReport(userReport);
  }, [report, setCurrentReport, month, person]);

  return {
    reportMonth,
    creditEnabled,
    hoursEnabled,
    handleSaveReport,
    enable_quick_AP,
    handleAssignAP,
  };
};

export default useReportDetails;
