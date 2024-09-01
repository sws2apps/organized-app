import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  reportUserSelectedMonthState,
  userFieldServiceReportsState,
} from '@states/user_field_service_reports';
import { UserFieldServiceMonthlyReportType } from '@definition/user_field_service_reports';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';
import { userFieldServiceMonthlyReportSchema } from '@services/dexie/schema';
import { dbUserFieldServiceReportsSave } from '@services/dexie/user_field_service_reports';
import { getMessageByCode } from '@services/i18n/translation';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';

const useBibleStudies = () => {
  const { t } = useAppTranslation();

  const currentMonth = useRecoilValue(reportUserSelectedMonthState);
  const reports = useRecoilValue(userFieldServiceReportsState);

  const { status, bible_studies_names, bible_studies } =
    useMinistryMonthlyRecord(currentMonth);

  const [value, setValue] = useState(bible_studies);

  const monthReport = useMemo(() => {
    return reports.find(
      (record) => record.report_date === currentMonth
    ) as UserFieldServiceMonthlyReportType;
  }, [reports, currentMonth]);

  const namedRecordsCount = useMemo(() => {
    return bible_studies_names.length;
  }, [bible_studies_names]);

  const handleValueChange = async (value: number) => {
    if (status !== 'pending') return;

    try {
      let report: UserFieldServiceMonthlyReportType;

      if (!monthReport) {
        report = structuredClone(userFieldServiceMonthlyReportSchema);
        report.report_date = currentMonth;
      }

      if (monthReport) {
        report = structuredClone(monthReport);
      }

      report.report_data.bible_studies = value;

      if (value > 0 && !report.report_data.shared_ministry) {
        report.report_data.shared_ministry = true;
      }

      report.report_data.updatedAt = new Date().toISOString();

      await dbUserFieldServiceReportsSave(report);
    } catch (error) {
      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const bibleStudiesValidator = async (value: number) => {
    if (value >= namedRecordsCount) return true;

    await displaySnackNotification({
      header: t('tr_cantDeductStudiesTitle'),
      message: t('tr_cantDeductStudiesDesc'),
      severity: 'error',
    });

    return false;
  };

  useEffect(() => {
    setValue(bible_studies);
  }, [bible_studies]);

  return {
    value,
    handleValueChange,
    bibleStudiesValidator,
    namedRecords: bible_studies_names,
    status,
  };
};

export default useBibleStudies;
