import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import {
  congFieldServiceReportsState,
  selectedMonthFieldServiceReportState,
} from '@states/field_service_reports';
import { PersonType } from '@definition/person';
import { shortDateFormatState } from '@states/settings';
import { formatDate } from '@services/dateformat';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import { congFieldServiceReportSchema } from '@services/dexie/schema';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { handleSaveFieldServiceReports } from '@services/app/cong_field_service_reports';
import { branchFieldReportsState } from '@states/branch_field_service_reports';

const useLateReport = (person: PersonType) => {
  const { t } = useAppTranslation();

  const { isSecretary } = useCurrentUser();

  const reports = useRecoilValue(congFieldServiceReportsState);
  const currentMonth = useRecoilValue(selectedMonthFieldServiceReportState);
  const shortDateFormat = useRecoilValue(shortDateFormatState);
  const branchReports = useRecoilValue(branchFieldReportsState);

  const branch_submitted = useMemo(() => {
    const report = branchReports.find(
      (record) => record.report_date === currentMonth
    );

    if (!report) return false;

    return report.report_data.submitted;
  }, [branchReports, currentMonth]);

  const report = useMemo(() => {
    return reports.find(
      (record) =>
        record.report_data.report_date === currentMonth &&
        record.report_data.person_uid === person.person_uid
    );
  }, [reports, currentMonth, person]);

  const readOnly = useMemo(() => {
    if (!report) return false;

    return report.report_data.late.submitted.length > 0;
  }, [report]);

  const late = useMemo(() => {
    if (!report) return false;

    return report.report_data.late.value;
  }, [report]);

  const [checked, setChecked] = useState(late);

  const show_late = useMemo(() => {
    if (!report) {
      if (branch_submitted) return true;

      return false;
    }

    if (report.report_data.late.value) return true;

    return branch_submitted && !report.report_data.shared_ministry;
  }, [report, branch_submitted]);

  const late_sent = useMemo(() => {
    if (!report) return '';

    if (report.report_data.late.submitted.length === 0) return '';

    const [year, month] = report.report_data.late.submitted.split('/');
    const dateSent = new Date(+year, +month, 0);
    const sent = formatDate(dateSent, shortDateFormat);

    return t('tr_lateReportSent', { date: sent });
  }, [report, t, shortDateFormat]);

  const handleChecked = async (value: boolean) => {
    setChecked(value);

    try {
      let lateReport: CongFieldServiceReportType;

      if (!report) {
        lateReport = structuredClone(congFieldServiceReportSchema);
        lateReport.report_id = crypto.randomUUID();
        lateReport.report_data.report_date = currentMonth;
        lateReport.report_data.person_uid = person.person_uid;
      }

      if (report) {
        lateReport = structuredClone(report);
      }

      lateReport.report_data.late.value = value;

      if (value) {
        lateReport.report_data.status = isSecretary ? 'confirmed' : 'received';
      }

      if (!value) {
        lateReport.report_data.status = 'confirmed';
        lateReport.report_data.shared_ministry = false;
        lateReport.report_data.bible_studies = 0;
        lateReport.report_data.comments = '';
        lateReport.report_data.hours = {
          credit: { approved: 0, value: 0 },
          field_service: 0,
        };
      }

      lateReport.report_data.updatedAt = new Date().toISOString();

      await handleSaveFieldServiceReports(lateReport);
    } catch (error) {
      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return {
    show_late,
    late_sent,
    checked,
    handleChecked,
    readOnly,
  };
};

export default useLateReport;
