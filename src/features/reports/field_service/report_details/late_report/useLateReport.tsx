import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import {
  congFieldServiceReportsState,
  selectedMonthFieldServiceReportState,
} from '@states/field_service_reports';
import { PersonType } from '@definition/person';
import { currentReportMonth } from '@utils/date';
import { shortDateFormatState } from '@states/settings';
import { formatDate } from '@services/dateformat';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import { congFieldServiceReportSchema } from '@services/dexie/schema';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { handleSaveFieldServiceReports } from '@services/app/cong_field_service_reports';

const useLateReport = (person: PersonType) => {
  const { t } = useAppTranslation();

  const reports = useRecoilValue(congFieldServiceReportsState);
  const currentMonth = useRecoilValue(selectedMonthFieldServiceReportState);
  const shortDateFormat = useRecoilValue(shortDateFormatState);

  const report = useMemo(() => {
    return reports.find(
      (record) =>
        record.report_data.report_date === currentMonth &&
        record.report_data.person_uid === person.person_uid
    );
  }, [reports, currentMonth, person]);

  const late = useMemo(() => {
    if (!report) return false;

    return report.report_data.late.value;
  }, [report]);

  const [checked, setChecked] = useState(late);

  const show_late = useMemo(() => {
    const currentReport = currentReportMonth();

    if (currentMonth >= currentReport) return false;

    if (!report) return true;

    return !report.report_data.shared_ministry;
  }, [currentMonth, report]);

  const late_sent = useMemo(() => {
    if (!report) return '';

    if (report.report_data.late.submitted.length === 0) return '';

    const date = new Date(report.report_data.late.submitted);
    const sent = formatDate(date, shortDateFormat);

    return t('tr_lateReportSent', { date: sent });
  }, [report, t, shortDateFormat]);

  const handleChecked = async (value: boolean) => {
    setChecked(value);

    try {
      let lateReport: CongFieldServiceReportType;

      if (!report) {
        lateReport = structuredClone(congFieldServiceReportSchema);
        report.report_id = crypto.randomUUID();
        lateReport.report_data.report_date = currentMonth;
        lateReport.report_data.person_uid = person.person_uid;
      }

      if (report) {
        lateReport = structuredClone(report);
      }

      lateReport.report_data.late.value = value;
      lateReport.report_data.updatedAt = new Date().toISOString();

      await handleSaveFieldServiceReports(lateReport);
    } catch (error) {
      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return { show_late, late_sent, checked, handleChecked };
};

export default useLateReport;
