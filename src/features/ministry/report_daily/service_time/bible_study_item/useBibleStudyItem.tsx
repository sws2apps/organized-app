import { MouseEvent, useMemo } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  bibleStudyEditorOpenState,
  currentBibleStudyState,
} from '@states/user_bible_studies';
import { BibleStudyItemProps } from './index.types';
import { userFieldServiceReportsState } from '@states/user_field_service_reports';
import { formatDate } from '@services/dateformat';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import { dbUserFieldServiceReportsSave } from '@services/dexie/user_field_service_reports';
import { UserFieldServiceDailyReportType } from '@definition/user_field_service_reports';
import { UserFieldServiceDailyReportSchema } from '@services/dexie/schema';

const useBibleStudyItem = ({
  bibleStudy,
  onSelectorClose,
  date,
}: BibleStudyItemProps) => {
  const { t } = useAppTranslation();

  const setEditorOpen = useSetRecoilState(bibleStudyEditorOpenState);
  const setCurrentStudy = useSetRecoilState(currentBibleStudyState);

  const userReports = useRecoilValue(userFieldServiceReportsState);

  const selected = useMemo(() => {
    const reportDate = formatDate(date, 'yyyy/MM/dd');

    const report = userReports.find(
      (record) => record.report_date === reportDate
    ) as UserFieldServiceDailyReportType;

    if (!report) return false;

    return report.report_data.bible_studies.records.includes(
      bibleStudy.person_uid
    );
  }, [date, userReports, bibleStudy]);

  const handleEditStudy = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    onSelectorClose?.();

    setCurrentStudy(bibleStudy);
    setEditorOpen(true);
  };

  const handleSelectStudy = async () => {
    const reportDate = formatDate(date, 'yyyy/MM/dd');
    const currentReport = userReports.find(
      (record) => record.report_date === reportDate
    );

    try {
      let report: UserFieldServiceDailyReportType;

      if (!currentReport) {
        report = structuredClone(UserFieldServiceDailyReportSchema);
        report.report_date = reportDate;
      }

      if (currentReport) {
        report = currentReport as UserFieldServiceDailyReportType;
      }

      report.report_data.bible_studies.records =
        report.report_data.bible_studies.records.filter(
          (record) => record !== bibleStudy.person_uid
        );
      report.report_data.bible_studies.records.push(bibleStudy.person_uid);

      const cnCount = report.report_data.bible_studies.value;
      report.report_data.bible_studies.value = cnCount ? cnCount + 1 : 1;

      report.report_data.updatedAt = new Date().toISOString();

      await dbUserFieldServiceReportsSave(report);

      onSelectorClose?.();
    } catch (error) {
      console.error(error);

      onSelectorClose?.();

      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return { handleEditStudy, handleSelectStudy, selected };
};

export default useBibleStudyItem;
