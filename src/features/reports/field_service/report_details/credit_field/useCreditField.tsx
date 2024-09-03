import { useMemo, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { PersonType } from '@definition/person';
import {
  congFieldServiceReportsState,
  selectedMonthFieldServiceReportState,
} from '@states/field_service_reports';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import { congFieldServiceReportSchema } from '@services/dexie/schema';
import { handleSaveFieldServiceReports } from '@services/app/cong_field_service_reports';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';

const useCreditField = (person: PersonType) => {
  const creditRef = useRef<Element>(null);

  const { t } = useAppTranslation();

  const reports = useRecoilValue(congFieldServiceReportsState);
  const currentMonth = useRecoilValue(selectedMonthFieldServiceReportState);

  const currentReport = useMemo(() => {
    return reports.find(
      (record) =>
        record.report_data.report_date === currentMonth &&
        record.report_data.person_uid === person.person_uid
    );
  }, [reports, currentMonth, person]);

  const credit = useMemo(() => {
    if (!currentReport) return 0;

    if (currentReport.report_data.hours.credit.approved > 0) {
      return currentReport.report_data.hours.credit.approved;
    }

    return currentReport.report_data.hours.credit.value;
  }, [currentReport]);

  const handleCreditChange = async (value: number) => {
    try {
      let report: CongFieldServiceReportType;

      if (!currentReport) {
        report = structuredClone(congFieldServiceReportSchema);
        report.report_id = crypto.randomUUID();
        report.report_data.report_date = currentMonth;
        report.report_data.person_uid = person.person_uid;
      }

      if (currentReport) {
        report = structuredClone(currentReport);
      }

      report.report_data.hours.credit.approved = value;

      if (report.report_data.hours.field_service === 0) {
        report.report_data.shared_ministry = value > 0;
      }

      report.report_data.updatedAt = new Date().toISOString();

      await handleSaveFieldServiceReports(report);
    } catch (error) {
      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleSelectPreset = async (value: number) => {
    try {
      let report: CongFieldServiceReportType;

      if (!currentReport) {
        report = structuredClone(congFieldServiceReportSchema);
        report.report_id = crypto.randomUUID();
        report.report_data.report_date = currentMonth;
        report.report_data.person_uid = person.person_uid;
      }

      if (currentReport) {
        report = structuredClone(currentReport);
      }

      report.report_data.hours.credit.approved = value;

      if (report.report_data.hours.field_service === 0) {
        report.report_data.shared_ministry = true;
      }

      report.report_data.updatedAt = new Date().toISOString();

      await handleSaveFieldServiceReports(report);
    } catch (error) {
      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return { credit, handleCreditChange, handleSelectPreset, creditRef };
};

export default useCreditField;
