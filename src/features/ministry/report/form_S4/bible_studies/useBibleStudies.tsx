import { useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { FormS4Props } from '../index.types';
import {
  congFieldServiceReportSchema,
  userFieldServiceMonthlyReportSchema,
} from '@services/dexie/schema';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { userFieldServiceDailyReportsState } from '@states/user_field_service_reports';
import {
  dbUserFieldServiceReportsBulkSave,
  dbUserFieldServiceReportsSave,
} from '@services/dexie/user_field_service_reports';
import { dbDelegatedFieldServiceReportsSave } from '@services/dexie/delegated_field_service_reports';
import {
  UserFieldServiceDailyReportType,
  UserFieldServiceMonthlyReportType,
} from '@definition/user_field_service_reports';
import { UserBibleStudyType } from '@definition/user_bible_studies';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import { dbFieldServiceReportsSave } from '@services/dexie/cong_field_service_reports';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';

const useBibleStudies = ({ month, person_uid, publisher }: FormS4Props) => {
  const { t } = useAppTranslation();

  const bibleStudyRef = useRef<Element>(null);

  const userDailyReports = useRecoilValue(userFieldServiceDailyReportsState);

  const {
    bible_studies,
    bible_studies_records,
    read_only,
    status,
    delegatedReport,
    userReport,
    isSelf,
    congReport,
  } = useMinistryMonthlyRecord({ month, person_uid, publisher });

  const dailyReports = useMemo(() => {
    return userDailyReports.filter(
      (record) =>
        record.report_date.startsWith(month) &&
        record.report_data.bible_studies.records.length > 0
    );
  }, [userDailyReports, month]);

  const [value, setValue] = useState(bible_studies);

  const handleCheckSelected = (study: UserBibleStudyType) => {
    return bible_studies_records.some(
      (record) => record.person_uid === study.person_uid
    );
  };

  const handleBibleStudyRecordsChange = async (study: UserBibleStudyType) => {
    try {
      let report: UserFieldServiceMonthlyReportType;

      if (!userReport) {
        report = structuredClone(userFieldServiceMonthlyReportSchema);
        report.report_date = month;
        report.report_data.bible_studies.records = [];
      }

      if (userReport) {
        report = structuredClone(userReport);
      }

      if (typeof report.report_data.bible_studies === 'number') {
        report.report_data.bible_studies = {
          daily: report.report_data.bible_studies,
          monthly: 0,
          records: [],
        };
      }

      const findStudy = report.report_data.bible_studies.records.some(
        (record) => record === study.person_uid
      );

      if (!findStudy) {
        report.report_data.bible_studies.records.push(study.person_uid);
      }

      report.report_data.bible_studies.monthly++;
      report.report_data.shared_ministry = true;

      report.report_data.updatedAt = new Date().toISOString();

      await dbUserFieldServiceReportsSave(report);
    } catch (error) {
      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleBibleStudyChange = async (value: number) => {
    setValue(value);

    try {
      if (publisher) {
        const monthReport = isSelf ? userReport : delegatedReport;

        let report: UserFieldServiceMonthlyReportType;

        if (!monthReport) {
          report = structuredClone(userFieldServiceMonthlyReportSchema);
          report.report_date = month;

          if (!isSelf) {
            report.report_data.person_uid = person_uid;
          }
        }

        if (monthReport) {
          report = structuredClone(monthReport);
        }

        const daily = report.report_data.bible_studies.daily;

        report.report_data.bible_studies.monthly = value - daily || 0;

        if (value > 0) {
          report.report_data.shared_ministry = true;
        }

        report.report_data.updatedAt = new Date().toISOString();

        if (isSelf) {
          await dbUserFieldServiceReportsSave(report);
        }

        if (!isSelf) {
          await dbDelegatedFieldServiceReportsSave(report);
        }
      }

      if (!publisher) {
        let report: CongFieldServiceReportType;

        if (!congReport) {
          report = structuredClone(congFieldServiceReportSchema);
          report.report_id = crypto.randomUUID();
          report.report_data.report_date = month;
          report.report_data.person_uid = person_uid;
        }

        if (congReport) {
          report = structuredClone(congReport);
        }

        report.report_data.shared_ministry = true;
        report.report_data.bible_studies = value;
        report.report_data.updatedAt = new Date().toISOString();

        await dbFieldServiceReportsSave(report);
      }
    } catch (error) {
      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleBibleStudyDelete = async (study: UserBibleStudyType) => {
    if (status !== 'pending') return;

    try {
      const report = structuredClone(userReport);

      report.report_data.bible_studies.records =
        report.report_data.bible_studies.records.filter(
          (record) => record !== study.person_uid
        );

      report.report_data.bible_studies.monthly--;
      report.report_data.updatedAt = new Date().toISOString();

      const reportsDaily: UserFieldServiceDailyReportType[] = [];

      for (const dailyReport of dailyReports) {
        const findStudy =
          dailyReport.report_data.bible_studies.records.includes(
            study.person_uid
          );

        if (!findStudy) continue;

        const newReport = structuredClone(dailyReport);

        newReport.report_data.bible_studies.records =
          newReport.report_data.bible_studies.records.filter(
            (record) => record !== study.person_uid
          );

        newReport.report_data.bible_studies.value--;
        newReport.report_data.updatedAt = new Date().toISOString();

        reportsDaily.push(newReport);
      }

      await dbUserFieldServiceReportsBulkSave([report, ...reportsDaily]);
    } catch (error) {
      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const bibleStudiesValidator = async (value: number) => {
    if (!userReport) return true;

    const records = userReport.report_data.bible_studies.records?.length || 0;

    if (value < records) {
      await displaySnackNotification({
        header: t('tr_cantDeductStudiesTitle'),
        message: t('tr_cantDeductStudiesDesc'),
        severity: 'error',
      });

      return false;
    }

    const daily = userReport.report_data.bible_studies?.daily || 0;

    if (value < daily) {
      await displaySnackNotification({
        header: t('tr_cantDeductStudiesTitle'),
        message: t('tr_bibleStudiesMonthlyLess'),
        severity: 'error',
      });

      return false;
    }

    return true;
  };

  useEffect(() => {
    setValue(bible_studies);
  }, [bible_studies]);

  return {
    value,
    handleBibleStudyChange,
    read_only,
    bibleStudyRef,
    isSelf,
    handleBibleStudyRecordsChange,
    handleCheckSelected,
    bible_studies_records,
    handleBibleStudyDelete,
    bibleStudiesValidator,
  };
};

export default useBibleStudies;
