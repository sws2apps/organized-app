import { updatedAtOverride } from '@utils/common';
import { UserFieldServiceReportType } from '@definition/user_field_service_reports';
import { UserBibleStudyType } from '@definition/user_bible_studies';
import appDb from '@db/appDb';

const useMinistryReportsImport = () => {
  const getUserReports = async (reports: UserFieldServiceReportType[]) => {
    const result: UserFieldServiceReportType[] = [];

    result.push(...reports);

    const oldReports = await appDb.user_field_service_reports.toArray();

    for (const oldReport of oldReports) {
      const newReport = reports.find(
        (record) => record.report_date === oldReport.report_date
      );

      if (!newReport) {
        oldReport.report_data._deleted = true;
        oldReport.report_data.updatedAt = new Date().toISOString();

        result.push(oldReport);
      }
    }

    return result.map((record) => {
      const data = updatedAtOverride(record);
      return data;
    });
  };

  const getUserBibleStudies = async (studies: UserBibleStudyType[]) => {
    const result: UserBibleStudyType[] = [];

    result.push(...studies);

    const oldStudies = await appDb.user_bible_studies.toArray();

    for (const oldStudy of oldStudies) {
      const newStudy = studies.find(
        (record) => record.person_uid === oldStudy.person_uid
      );

      if (!newStudy) {
        oldStudy.person_data._deleted = true;
        oldStudy.person_data.updatedAt = new Date().toISOString();

        result.push(oldStudy);
      }
    }

    return result.map((record) => {
      const data = updatedAtOverride(record);
      return data;
    });
  };

  return { getUserReports, getUserBibleStudies };
};

export default useMinistryReportsImport;
