import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { congFieldServiceReportSchema } from '@services/dexie/schema';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { PersonType } from '@definition/person';
import {
  congFieldServiceReportsState,
  selectedMonthFieldServiceReportState,
} from '@states/field_service_reports';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import { debounceFieldServiceSave } from '@services/app/cong_field_service_reports';

const useComments = (person: PersonType) => {
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

  const comments = useMemo(() => {
    if (!currentReport) return '';

    return currentReport.report_data.comments;
  }, [currentReport]);

  const [value, setValue] = useState(comments);

  const handleCommentsChange = async (value: string) => {
    setValue(value);

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

      report.report_data.comments = value;
      report.report_data.updatedAt = new Date().toISOString();

      debounceFieldServiceSave(report);
    } catch (error) {
      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    setValue(comments);
  }, [comments]);

  return { value, handleCommentsChange };
};

export default useComments;
